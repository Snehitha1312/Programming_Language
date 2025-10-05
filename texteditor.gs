import IO;
import StringHandler;
import Vector;
import FileHandler;
import Utility;
import Termios;

TerminalHandler th;

// Constants
//define MAX_ROWS 1024
//define MAX_COLS 1024

// Instances
IOHandler io;
StringHandler sh;
FileHandler fh;
Utility util;

// Editor structure
class Editor {
public
    char rows[1024][1024]; // text rows
    int rowCount = 0;
    char filename[256];
    int cx = 0;
    int cy = 0;
    bool insert_mode = FL;
    bool command_mode = FL;
    char command_buffer[256];
    char status_msg[256];
};
Editor E;

// Terminal control
void disableRawMode() {
    th.disableRawMode();
}

void enableRawMode() {
    th.enableRawMode();
}

// Key input
int readKey() {
    return io.readChar();
}

// Open file
void openFile(char fname[]) {
    if (sh.length(fname) == 0) {
        E.rowCount = 1;
        E.rows[0][0] = '\0';
        return;
    }

    if (fh.fopen(fname, 0) != 0) { // 0 = read
        E.rowCount = 1;
        E.rows[0][0] = '\0';
        return;
    }

    char buffer[1024* 1024];
    int bytesRead = fh.fread(buffer, sizeof(buffer));

    int start = 0;
    E.rowCount = 0;
    for (int i = 0; i < bytesRead; i++) {
        if (buffer[i] == '\n') {
            int len = i - start;
            if (len >= 1024) len = 1024 - 1;
            for (int j = 0; j < len; j++) {
                E.rows[E.rowCount][j] = buffer[start + j];
            }
            E.rows[E.rowCount][len] = '\0';
            E.rowCount++;
            start = i + 1;
        }
    }
    if (start < bytesRead) {
        int len = bytesRead - start;
        if (len >= 1024) len = 1024 - 1;
        for (int j = 0; j < len; j++) {
            E.rows[E.rowCount][j] = buffer[start + j];
        }
        E.rows[E.rowCount][len] = '\0';
        E.rowCount++;
    }

    fh.fclose();
    sh.substr(fname, 0, sh.length(fname), E.filename);
}

// Save file
void saveFile() {
    if (sh.length(E.filename) == 0) return;

    if (fh.fopen(E.filename, 1) != 0) { // 1 = write
        sh.substr("Error saving file", 0, 17, E.status_msg);
        return;
    }

    for (int i = 0; i < E.rowCount; i++) {
        char *line = E.rows[i];
        int len = sh.length(line);
        fh.fwrite(line, len);
        if (i + 1 < E.rowCount) {
            char nl = '\n';
            fh.fwrite(&nl, 1);
        }
    }

    fh.fclose();
    char msg[256];
    int len = sh.length(E.filename);
    char quotes[] = "\"";
    sh.substr(E.filename, 0, len, msg);
    sh.insert(msg, 0, '"');
    sh.insert(msg, sh.length(msg), '"');
    sh.substr(" written", 0, 8, E.status_msg);
}

// Draw screen
void drawRows() {
    io.printString("\x1b[2J"); 
    io.printString("\x1b[H");  

    for (int i = 0; i < E.rowCount; i++) {
        io.printInt(i + 1);
        io.printString(" ");
        io.printString(E.rows[i]);
        io.printString("\r\n");
    }

    io.printString("\x1b[7m");  
    io.printString("FILE: ");
    io.printString(E.filename);
    io.printString(" | MODE: ");
    io.printString(E.insert_mode ? "INSERT" : (E.command_mode ? "COMMAND" : "NORMAL"));
    io.printString("\x1b[m\r\n");

    if (E.command_mode) {
        io.printString(":");
        io.printString(E.command_buffer);
        io.printString("\r\n");
    } else {
        io.printString(E.status_msg);
        io.printString("\r\n");
    }
}

// Cursor movement
void moveCursor(char key) {
    if (key == 'h') {
        if (E.cx > 0) E.cx--;
    } 
    else if (key == 'l') {
        if (E.cx < sh.length(E.rows[E.cy])) E.cx++;
    } 
    else if (key == 'k') {
        if (E.cy > 0) {
            E.cy--;
            if (E.cx > sh.length(E.rows[E.cy])) E.cx = sh.length(E.rows[E.cy]);
        }
    } 
    else if (key == 'j') {
        if (E.cy + 1 < E.rowCount) {
            E.cy++;
            if (E.cx > sh.length(E.rows[E.cy])) E.cx = sh.length(E.rows[E.cy]);
        }
    }
}

// Insert/delete character
void insertChar(char c) {
    sh.insert(E.rows[E.cy], E.cx, c);
    E.cx++;
}

void deleteChar() {
    if (E.cx < sh.length(E.rows[E.cy])) {
        sh.erase(E.rows[E.cy], E.cx, 1);
    }
}

// Command processing
void processCommand() {
    if (sh.length(E.command_buffer) == 0) return;

    if (sh.compare(E.command_buffer, "q") == 0) exit(0);
    else if (sh.compare(E.command_buffer, "w") == 0) saveFile();
    else if (sh.compare(E.command_buffer, "wq") == 0) { saveFile(); exit(0); }
    else {
        sh.substr("Not an editor command: ", 0, 23, E.status_msg);
        // append command
    }

    E.command_buffer[0] = '\0';
    E.command_mode = FL;
}

// Keypress handling
void processKeypress() {
    char c = io.readChar();

    if (E.command_mode) {
        if (c == '\r' || c == '\n') processCommand();
        else if (c == 127 || c == '\b') {
            int len = sh.length(E.command_buffer);
            if (len > 0) E.command_buffer[len - 1] = '\0';
        } else if (c == 27) { 
            E.command_mode = FL;
            E.command_buffer[0] = '\0';
        } else {
            sh.insert(E.command_buffer, sh.length(E.command_buffer), c);
        }
        return;
    }

    if (!E.insert_mode) {
        if (c == 'i') E.insert_mode = TR;
        else if (c == 'q') exit(0);
        else if (c == 's') saveFile();
        else if (c == 'x') deleteChar();
        else if (c == 'o') {
            for (int i = E.rowCount; i > E.cy + 1; i--) {
                sh.substr(E.rows[i-1], 0, sh.length(E.rows[i-1]), E.rows[i]);
            }
            E.rows[E.cy + 1][0] = '\0';
            E.rowCount++;
            E.cy++;
            E.cx = 0;
            E.insert_mode = TR;
        }
        else if (c == ':') E.command_mode = TR;
        else moveCursor(c);
    } 
    else {
        if (c == 27) E.insert_mode = FL;
        else if (c == 127 || c == '\b') { 
            if (E.cx > 0) {
                sh.erase(E.rows[E.cy], E.cx - 1, 1);
                E.cx--;
            }
        }
        else if (c == '\r') { 
            char newLine[1024];
            sh.substr(E.rows[E.cy], E.cx, sh.length(E.rows[E.cy]) - E.cx, newLine);
            E.rows[E.cy][E.cx] = '\0';
            for (int i = E.rowCount; i > E.cy + 1; i--) {
                sh.substr(E.rows[i-1], 0, sh.length(E.rows[i-1]), E.rows[i]);
            }
            sh.substr(newLine, 0, sh.length(newLine), E.rows[E.cy+1]);
            E.rowCount++;
            E.cy++;
            E.cx = 0;
        }
        else insertChar(c);
    }
}

// Main
int main() {
    openFile(""); // default empty file
    while (TR) {
        drawRows();
        processKeypress();
    }
    return 0;
}
