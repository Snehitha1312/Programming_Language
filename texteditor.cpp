// simple_vi_editor.cpp
// Plan + single-file implementation of a simple vi-like editor in C++
// ---------------------------------------------------------------
// Goal: Minimal, educational vi-like editor with two modes: command and insert.
// Features implemented:
//  - Open a file into an editable buffer
//  - Save to disk
//  - Insert mode for typing text
//  - Command mode for navigation and commands (like :w, :q)
//  - Cursor movement with h/j/k/l and arrow keys
//  - Backspace and delete
//  - Status bar with filename, mode, and message
//  - Basic search (/pattern) (simple forward search)
// 
// Design notes:
//  - Single-file code inspired by the minimal Kilo editor by antirez.
//  - Uses POSIX termios to enable raw mode (works on Linux/macOS).
//  - Text buffer: std::vector<std::string> rows, each string is one line.
//  - Simple command interface: when in command mode, typing ':' opens command prompt at status bar.
//  - Insert mode: typed characters are inserted at cursor, Enter creates new line.
//  - Not implemented: syntax highlighting, undo/redo, multiple windows, visual mode.
//
// Build: g++ -std=c++17 simple_vi_editor.cpp -o simplevi
// Run:   ./simplevi [optional_filename]
//
// Usage overview:
//  - Start the editor. If given a filename, it will load the file.
//  - Default mode: command mode. Press 'i' to enter insert mode.
//  - In insert mode: type normally. Press ESC to go back to command mode.
//  - In command mode: use arrow keys or h/j/k/l to move.
//  - Type ':' to enter a command; supported commands: :w (save), :q (quit), :wq (save+quit), :q! (quit without save)
//  - Type '/' then pattern to search forward, press Enter to search.
//
// Limitations & safety:
//  - This editor opens files and writes to disk — be careful when testing on important files.
//  - Terminal handling uses raw mode; if the program crashes, run `reset` in your terminal.
//
// -----------------------------------------------------------------------------

#include <termios.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <cstdio>
#include <cstdlib>
#include <cerrno>
#include <string>
#include <vector>
#include <iostream>
#include <fstream>
#include <sstream>
#include <ctime>

using std::string;
using std::vector;

// ------------------------ Terminal Raw Mode ------------------------
struct EditorConfig {
    int screenrows;
    int screencols;
    int cx, cy; // cursor x (col), y (row)
    int rowoff; // row offset for vertical scrolling
    int coloff; // column offset for horizontal scrolling
    bool dirty; // file modified but not saved
    string filename;
    string statusmsg;
    time_t statusmsg_time;
    vector<string> rows;
    bool insert_mode; // true when in insert mode
    termios orig_termios;
} E;

void die(const char *s) {
    perror(s);
    // restore terminal before exit
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &E.orig_termios);
    exit(1);
}

void disableRawMode() {
    if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &E.orig_termios) == -1)
        ; // can't call die here because may already be exiting
}

void enableRawMode() {
    if (tcgetattr(STDIN_FILENO, &E.orig_termios) == -1) die("tcgetattr");
    atexit(disableRawMode);

    termios raw = E.orig_termios;
    raw.c_iflag &= ~(BRKINT | ICRNL | INPCK | ISTRIP | IXON);
    raw.c_oflag &= ~(OPOST);
    raw.c_cflag |= (CS8);
    raw.c_lflag &= ~(ECHO | ICANON | IEXTEN | ISIG);
    raw.c_cc[VMIN] = 0;
    raw.c_cc[VTIME] = 1; // 0.1 seconds

    if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw) == -1) die("tcsetattr");
}

// ------------------------ I/O helpers ------------------------
int editorReadKey() {
    char c;
    while (true) {
        ssize_t n = read(STDIN_FILENO, &c, 1);
        if (n == 1) break;
        if (n == -1 && errno != EAGAIN) die("read");
    }
    if (c == '\x1b') {
        char seq[3];
        if (read(STDIN_FILENO, &seq[0], 1) != 1) return '\x1b';
        if (read(STDIN_FILENO, &seq[1], 1) != 1) return '\x1b';

        if (seq[0] == '[') {
            if (seq[1] >= '0' && seq[1] <= '9') {
                // extended escape
                char seq2;
                if (read(STDIN_FILENO, &seq2, 1) != 1) return '\x1b';
                if (seq2 == '~') {
                    switch (seq[1]) {
                        case '3': return 127; // DEL
                    }
                }
            } else {
                switch (seq[1]) {
                    case 'A': return 1000; // ARROW_UP
                    case 'B': return 1001; // ARROW_DOWN
                    case 'C': return 1002; // ARROW_RIGHT
                    case 'D': return 1003; // ARROW_LEFT
                }
            }
        }
        return '\x1b';
    }
    return c;
}

int getCursorPosition(int &rows, int &cols) {
    char buf[32];
    unsigned int i = 0;
    if (write(STDOUT_FILENO, "\x1b[6n", 4) != 4) return -1;
    while (i < sizeof(buf) - 1) {
        if (read(STDIN_FILENO, &buf[i], 1) != 1) break;
        if (buf[i] == 'R') break;
        i++;
    }
    buf[i] = '\0';
    if (buf[0] != '\x1b' || buf[1] != '[') return -1;
    if (sscanf(&buf[2], "%d;%d", &rows, &cols) != 2) return -1;
    return 0;
}

int getWindowSize(int &rows, int &cols) {
    struct winsize ws;
    if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &ws) == -1) {
        // fallback: ask the terminal
        if (write(STDOUT_FILENO, "\x1b[999C\x1b[999B", 12) != 12) return -1;
        return getCursorPosition(rows, cols);
    } else {
        cols = ws.ws_col;
        rows = ws.ws_row;
        return 0;
    }
}

// ------------------------ Row operations ------------------------

void editorInsertRow(int at, const string &s) {
    if (at < 0 || at > (int)E.rows.size()) return;
    E.rows.insert(E.rows.begin() + at, s);
    E.dirty = true;
}

void editorDelRow(int at) {
    if (at < 0 || at >= (int)E.rows.size()) return;
    E.rows.erase(E.rows.begin() + at);
    E.dirty = true;
}

void editorRowInsertChar(int y, int x, int c) {
    if (y < 0 || y >= (int)E.rows.size()) {
        // if adding to new empty buffer
        if (y == (int)E.rows.size()) {
            editorInsertRow(y, "");
        } else return;
    }
    string &row = E.rows[y];
    if (x < 0) x = 0;
    if (x > (int)row.size()) x = row.size();
    row.insert(row.begin() + x, (char)c);
    E.dirty = true;
}

void editorRowDelChar(int y, int x) {
    if (y < 0 || y >= (int)E.rows.size()) return;
    string &row = E.rows[y];
    if (x < 0 || x >= (int)row.size()) return;
    row.erase(row.begin() + x);
    E.dirty = true;
}

// ------------------------ File I/O ------------------------

void editorOpen(const char *filename) {
    E.filename = filename ? string(filename) : string();
    std::ifstream ifs;
    if (filename) {
        ifs.open(filename);
        if (!ifs) {
            // new file
            editorInsertRow(0, "");
            return;
        }
    }
    string line;
    E.rows.clear();
    while (std::getline(ifs, line)) {
        // drop trailing CR
        if (!line.empty() && line.back() == '\r') line.pop_back();
        E.rows.push_back(line);
    }
    if (E.rows.empty()) E.rows.push_back("");
    E.dirty = false;
}

void editorSave() {
    if (E.filename.empty()) {
        // save as not yet implemented interactively; for simplicity, refuse
        E.statusmsg = "No filename. Start editor with: ./simplevi filename";
        E.statusmsg_time = time(NULL);
        return;
    }
    std::ofstream ofs(E.filename, std::ios::trunc);
    if (!ofs) {
        E.statusmsg = "Can't open file for writing";
        E.statusmsg_time = time(NULL);
        return;
    }
    for (size_t i = 0; i < E.rows.size(); ++i) {
        ofs << E.rows[i];
        if (i + 1 < E.rows.size()) ofs << '\n';
    }
    ofs.close();
    E.dirty = false;
    E.statusmsg = "File saved.";
    E.statusmsg_time = time(NULL);
}

// ------------------------ Output ------------------------

void editorScroll() {
    if (E.cy < E.rowoff) {
        E.rowoff = E.cy;
    }
    if (E.cy >= E.rowoff + E.screenrows - 2) { // reserve one line for status
        E.rowoff = E.cy - (E.screenrows - 2) + 1;
    }
    if (E.cx < E.coloff) E.coloff = E.cx;
    if (E.cx >= E.coloff + E.screencols) E.coloff = E.cx - E.screencols + 1;
}

void editorDrawRows(std::string &buf) {
    for (int y = 0; y < E.screenrows - 1; ++y) {
        int filerow = y + E.rowoff;
        if (filerow >= (int)E.rows.size()) {
            if (E.rows.empty() && y == (E.screenrows - 1) / 3) {
                string welcome = "SimpleVi -- C++ minimal editor";
                if ((int)welcome.size() > E.screencols) welcome.resize(E.screencols);
                int padding = (E.screencols - welcome.size()) / 2;
                if (padding) buf.append("~");
                for (int i = 0; i < padding - 1; ++i) buf.append(" ");
                buf.append(welcome);
            } else {
                buf.append("~");
            }
        } else {
            string &line = E.rows[filerow];
            int len = (int)line.size() - E.coloff;
            if (len < 0) len = 0;
            if (len > E.screencols) len = E.screencols;
            if (len > 0) buf.append(line.substr(E.coloff, len));
        }
        buf.append("\x1b[K"); // clear line right
        buf.append("\r\n");
    }
}

void editorDrawStatusBar(std::string &buf) {
    buf.append("\x1b[7m"); // invert
    char status[80], rstatus[80];
    int len = snprintf(status, sizeof(status), "%.20s - %d lines %s",
                       E.filename.empty() ? "[No Name]" : E.filename.c_str(), (int)E.rows.size(),
                       E.dirty ? "(modified)" : "");
    int rlen = snprintf(rstatus, sizeof(rstatus), "%s | %d,%d",
                        E.insert_mode ? "-- INSERT --" : "-- COMMAND --", E.cy + 1, E.cx + 1);
    if (len > E.screencols) len = E.screencols;
    buf.append(string(status, status + len));
    while (len < E.screencols) {
        if (E.screencols - len == rlen) {
            buf.append(string(rstatus, rstatus + rlen));
            break;
        } else {
            buf.append(" ");
            len++;
        }
    }
    buf.append("\x1b[m\r\n");
}

void editorDrawMessageBar(std::string &buf) {
    buf.append("\x1b[K");
    if (!E.statusmsg.empty() && time(NULL) - E.statusmsg_time < 5) {
        if ((int)E.statusmsg.size() > E.screencols) buf.append(E.statusmsg.substr(0, E.screencols));
        else buf.append(E.statusmsg);
    }
}

void editorRefreshScreen() {
    editorScroll();

    std::string buf;
    buf.append("\x1b[?25l"); // hide cursor
    buf.append("\x1b[H"); // move cursor to home

    editorDrawRows(buf);
    editorDrawStatusBar(buf);
    editorDrawMessageBar(buf);

    char seq[32];
    int cx = (E.cx - E.coloff) + 1;
    int cy = (E.cy - E.rowoff) + 1;
    snprintf(seq, sizeof(seq), "\x1b[%d;%dH", cy, cx);
    buf.append(seq);
    buf.append("\x1b[?25h"); // show cursor

    write(STDOUT_FILENO, buf.c_str(), buf.size());
}

// ------------------------ Input and commands ------------------------

void editorMoveCursor(int key) {
    switch (key) {
        case 'h':
        case 1003: // left arrow
            if (E.cx > 0) E.cx--;
            else if (E.cy > 0) { E.cy--; E.cx = E.rows[E.cy].size(); }
            break;
        case 'l':
        case 1002: // right arrow
            if (E.cy < (int)E.rows.size()) {
                if (E.cx < (int)E.rows[E.cy].size()) E.cx++;
                else if (E.cx == (int)E.rows[E.cy].size() && E.cy + 1 < (int)E.rows.size()) { E.cy++; E.cx = 0; }
            }
            break;
        case 'k':
        case 1000: // up
            if (E.cy != 0) E.cy--;
            break;
        case 'j':
        case 1001: // down
            if (E.cy < (int)E.rows.size() - 1) E.cy++;
            break;
    }
    // clamp cx to end of line
    int rowlen = (E.cy >= 0 && E.cy < (int)E.rows.size()) ? (int)E.rows[E.cy].size() : 0;
    if (E.cx > rowlen) E.cx = rowlen;
}

string editorPrompt(const string &prompt) {
    string buf;
    while (true) {
        E.statusmsg = prompt + buf;
        E.statusmsg_time = time(NULL);
        editorRefreshScreen();
        int c = editorReadKey();
        if (c == '\r') {
            if (!buf.empty()) {
                E.statusmsg.clear();
                return buf;
            }
            return string();
        } else if (c == 127 || c == '\b') {
            if (!buf.empty()) buf.pop_back();
        } else if (c == 27) {
            E.statusmsg.clear();
            return string();
        } else if (isprint(c)) {
            buf.push_back((char)c);
        }
    }
}

void editorInsertNewline() {
    if (E.cx == 0) {
        editorInsertRow(E.cy, "");
    } else {
        string &row = E.rows[E.cy];
        string newrow = row.substr(E.cx);
        row.erase(E.cx);
        editorInsertRow(E.cy + 1, newrow);
    }
    E.cy++;
    E.cx = 0;
}

void editorProcessKeypress() {
    int c = editorReadKey();
    if (E.insert_mode) {
        if (c == 27) {
            E.insert_mode = false; // ESC
            return;
        }
        if (c == '\r') {
            editorInsertNewline();
            return;
        }
        if (c == 127) {
            if (E.cx == 0 && E.cy > 0) {
                int prevlen = E.rows[E.cy - 1].size();
                E.rows[E.cy - 1] += E.rows[E.cy];
                editorDelRow(E.cy);
                E.cy--;
                E.cx = prevlen;
            } else {
                editorRowDelChar(E.cy, E.cx - 1);
                E.cx--;
            }
            return;
        }
        if (isprint(c)) {
            editorRowInsertChar(E.cy, E.cx, c);
            E.cx++;
        }
        return;
    }

    switch (c) {
        case 'i':
            E.insert_mode = true;
            break;
        case ':': {
            string cmd = editorPrompt(":" );
            if (cmd == "w") editorSave();
            else if (cmd == "q") {
                if (E.dirty) { E.statusmsg = "No write since last change (use :q! to force)."; E.statusmsg_time = time(NULL); }
                else exit(0);
            }
            else if (cmd == "q!") exit(0);
            else if (cmd == "wq") { editorSave(); exit(0); }
            break;
        }
        case '/': {
            string pat = editorPrompt("/" );
            if (!pat.empty()) {
                // naive forward search
                for (int r = E.cy; r < (int)E.rows.size(); ++r) {
                    size_t pos = E.rows[r].find(pat);
                    if (pos != string::npos) {
                        E.cy = r;
                        E.cx = pos;
                        E.statusmsg = "Pattern found";
                        E.statusmsg_time = time(NULL);
                        break;
                    }
                }
            }
            break;
        }
        case 'h': case 'j': case 'k': case 'l':
        case 1000: case 1001: case 1002: case 1003:
            editorMoveCursor(c);
            break;
        case 127: // DEL
            if (E.cx < (int)E.rows[E.cy].size()) editorRowDelChar(E.cy, E.cx);
            else if (E.cx == (int)E.rows[E.cy].size() && E.cy + 1 < (int)E.rows.size()) {
                E.rows[E.cy] += E.rows[E.cy + 1];
                editorDelRow(E.cy + 1);
            }
            break;
        case 'x': // delete character under cursor
            if (E.cy < (int)E.rows.size()) editorRowDelChar(E.cy, E.cx);
            break;
        case 's': // substitute: delete char under cursor and enter insert
            if (E.cy < (int)E.rows.size()) editorRowDelChar(E.cy, E.cx);
            E.insert_mode = true;
            break;
        case '0':
            E.cx = 0;
            break;
        case '$':
            E.cx = E.rows[E.cy].size();
            break;
        case '\x03': // Ctrl-C
        case '\x04': // Ctrl-D
            exit(0);
            break;
    }
}

// ------------------------ Init ------------------------

int main(int argc, char *argv[]) {
    enableRawMode();
    if (getWindowSize(E.screenrows, E.screencols) == -1) die("getWindowSize");
    E.cx = 0; E.cy = 0; E.rowoff = 0; E.coloff = 0; E.dirty = false; E.insert_mode = false;

    if (argc >= 2) editorOpen(argv[1]); else editorInsertRow(0, "");

    E.statusmsg = "HELP: i to insert | :w to save | :q to quit";
    E.statusmsg_time = time(NULL);

    while (1) {
        editorRefreshScreen();
        editorProcessKeypress();
    }
    return 0;
}
