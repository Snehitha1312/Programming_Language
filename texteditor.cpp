#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <termios.h>
#include <unistd.h>
#include <cstdlib>

using namespace std;

struct Editor {
    vector<string> rows;
    string filename;
    int cx = 0, cy = 0;
    bool insert_mode = false;
    bool command_mode = false;
    string command_buffer;
    string status_msg;
    termios orig_termios;
} E;

void disableRawMode() {
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &E.orig_termios);
}

void enableRawMode() {
    tcgetattr(STDIN_FILENO, &E.orig_termios);
    atexit(disableRawMode);

    termios raw = E.orig_termios;
    raw.c_lflag &= ~(ECHO | ICANON);
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw);
}

int readKey() {
    char c;
    if (read(STDIN_FILENO, &c, 1) == 1) return c;
    return -1;
}

void openFile(const string &fname) {
    E.filename = fname;
    ifstream in(fname);
    string line;
    while (getline(in, line)) E.rows.push_back(line);
    if (E.rows.empty()) E.rows.push_back("");
}

void saveFile() {
    if (E.filename.empty()) return;
    ofstream out(E.filename);
    for (size_t i = 0; i < E.rows.size(); i++) {
        out << E.rows[i];
        if (i + 1 < E.rows.size()) out << "\n";
    }
}



void drawRows() {
    cout << "\x1b[2J"; // Clear screen
    cout << "\x1b[H";  // Move cursor to top-left

    for (size_t i = 0; i < E.rows.size(); i++) {
        cout << E.rows[i] << "\r\n";
    }

    // Status line
    cout << "\x1b[7m"; // Inverse colors
    cout << "FILE: " << (E.filename.empty() ? "[No Name]" : E.filename)
         << " | MODE: " << (E.insert_mode ? "INSERT" : "NORMAL") << "\x1b[m\r\n";
}

void moveCursor(char key) {
    switch (key) {
        case 'h': if(E.cx>0) E.cx--; break;
        case 'l': if(E.cx<E.rows[E.cy].size()) E.cx++; break;
        case 'k': if(E.cy>0) { E.cy--; if(E.cx>E.rows[E.cy].size()) E.cx=E.rows[E.cy].size(); } break;
        case 'j': if(E.cy+1<E.rows.size()) { E.cy++; if(E.cx>E.rows[E.cy].size()) E.cx=E.rows[E.cy].size(); } break;
    }
}

void insertChar(char c) {
    E.rows[E.cy].insert(E.rows[E.cy].begin() + E.cx, c);
    E.cx++;
}
void deleteChar() {
    if (E.cx < E.rows[E.cy].size()) {
        E.rows[E.cy].erase(E.cx,1);
    }
}

void processCommand() {
    if (E.command_buffer == "q") exit(0);
    else if (E.command_buffer == "w") saveFile();
    else if (E.command_buffer == "wq") { saveFile(); exit(0); }
    else E.status_msg = "Not an editor command: :" + E.command_buffer;

    E.command_buffer.clear();
    E.command_mode = false;
}

    int c = readKey();

    if (!E.insert_mode) {
        switch (c) {
            case 'i': E.insert_mode = true; break;
            case 'q': exit(0); break;
            case 's': saveFile(); break;
            default: moveCursor(c);
        }
    } else {
        if (c == 27) { // ESC
            E.insert_mode = false;
        } else if (c == 127 || c == '\b') { // Backspace
            if(E.cx>0) { E.rows[E.cy].erase(E.cx-1,1); E.cx--; }
        } else if (c == '\r') { // Enter
            string newLine = E.rows[E.cy].substr(E.cx);
            E.rows[E.cy] = E.rows[E.cy].substr(0, E.cx);
            E.rows.insert(E.rows.begin() + E.cy + 1, newLine);
            E.cy++; E.cx = 0;
        } else {
            insertChar(c);
        }
    }
}

void processKeypress() {
    int c = readKey();

    if (E.command_mode) {
        if (c == '\r') { // Enter
            processCommand();
        } else if (c == 127 || c == '\b') { // Backspace
            if (!E.command_buffer.empty()) E.command_buffer.pop_back();
        } else if (c == 27) { // ESC
            E.command_mode = false;
            E.command_buffer.clear();
        } else {
            E.command_buffer.push_back(c);
        }
        return;
    }

    if (!E.insert_mode) {
        switch (c) {
            case 'i': E.insert_mode = true; break;
            case 'q': exit(0); break;
            case 's': saveFile(); break;
            case 'x': deleteChar(); break;
            case 'o': {
                E.rows.insert(E.rows.begin()+E.cy+1, "");
                E.cy++; E.cx = 0;
                E.insert_mode = true;
            } break;
            case ':': E.command_mode = true; break;
            default: moveCursor(c);
        }
    } else {
        if (c == 27) { // ESC
            E.insert_mode = false;
        } else if (c == 127 || c == '\b') { // Backspace
            if(E.cx>0) { E.rows[E.cy].erase(E.cx-1,1); E.cx--; }
        } else if (c == '\r') { // Enter
            string newLine = E.rows[E.cy].substr(E.cx);
            E.rows[E.cy] = E.rows[E.cy].substr(0, E.cx);
            E.rows.insert(E.rows.begin() + E.cy + 1, newLine);
            E.cy++; E.cx = 0;
        } else {
            insertChar(c);
        }
    }
}



int main(int argc, char* argv[]) {
    if (argc >= 2) openFile(argv[1]);
    enableRawMode();

    while (true) {
        drawRows();
        cout << "\x1b[" << E.cy+1 << ";" << E.cx+1 << "H"; // Move cursor
        cout.flush();
        processKeypress();
    }

    return 0;
}
