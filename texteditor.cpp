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

