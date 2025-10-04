import IO;
import StringHandler;
import Vector;
import FileHandler;   
import Utility;        

// Instances
IOHandler io;
StringHandler sh;
FileHandler fh;  

// Editor structure
class Editor {
public
    Vector<string> rows;      // text rows
    string filename;
    int cx = 0;            
    int cy = 0;            
    bool insert_mode = FL;
    bool command_mode = FL;
    string command_buffer;
    string status_msg;
    MyFile file;           // current open file
};
Editor E;

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

void openFile(string fname) {
    E.filename = fname;

    if (sh.length(fname) == 0) {
        E.rows.push_back("");
        return;
    }

    E.file = fh.fopen(fname, "r");
    if (E.file.fd < 0) {
        E.rows.push_back("");
        return;
    }

    FReadResult r = fh.fread(1024, E.file);
    E.file = r.f;  // update file struct

    int start = 0;
    for (int i = 0; i < r.data.size(); i++) {
        if (r.data.at(i) == '\n') {
            string line = "";
            for (int j = start; j < i; j++) line = line + r.data.at(j);
            E.rows.push_back(line);
            start = i + 1;
        }
    }
    if (start < r.data.size()) {
        string lastLine = "";
        for (int j = start; j < r.data.size(); j++) lastLine = lastLine + r.data.at(j);
        E.rows.push_back(lastLine);
    }

    fh.fclose(E.file);
}

void saveFile() {
    if (sh.length(E.filename) == 0) return;

    E.file = fh.fopen(E.filename, "w");
    if (E.file.fd < 0) {
        E.status_msg = "Error saving file";
        return;
    }

    for (int i = 0; i < E.rows.size(); i++) {
        string line = E.rows.at(i);
        Vector<char> buf;
        for (int j = 0; j < sh.length(line); j++) buf.push_back(line[j]);
        FWriteResult w = fh.fwrite(buf, E.file);
        E.file = w.f;
        if (i + 1 < E.rows.size()) {
            Vector<CHAR> newline;
            newline.push_back('\n');
            w = fh.fwrite(newline, E.file);
            E.file = w.f;
        }
    }

    fh.fclose(E.file);
    E.status_msg = "\"" + E.filename + "\" written";
}

void drawRows() {
    io.printString("\x1b[2J"); 
    io.printString("\x1b[H");  

    for (int i = 0; i < E.rows.size(); i++) {
        io.printInt(i + 1);
        io.printString(" ");
        io.printString(E.rows.at(i));
        io.printString("\r\n");
    }

    io.printString("\x1b[7m");  
    io.printString("FILE: " + (sh.length(E.filename) == 0 ? "[No Name]" : E.filename)
                   + " | MODE: " + (E.insert_mode ? "INSERT" : (E.command_mode ? "COMMAND" : "NORMAL")));
    io.printString("\x1b[m\r\n");

    if (E.command_mode) {
        io.printString(":" + E.command_buffer + "\r\n");
    } else {
        io.printString(E.status_msg + "\r\n");
    }
}

void moveCursor(CHAR key) {
    if (key == 'h') {
        if (E.cx > 0) {
            E.cx = E.cx - 1;
        }
    } 
    else if (key == 'l') {
        if (E.cx < sh.length(E.rows.at(E.cy))) {
            E.cx = E.cx + 1;
        }
    } 
    else if (key == 'k') {
        if (E.cy > 0) {
            E.cy = E.cy - 1;
            if (E.cx > sh.length(E.rows.at(E.cy))) {
                E.cx = sh.length(E.rows.at(E.cy));
            }
        }
    } 
    else if (key == 'j') {
        if (E.cy + 1 < E.rows.size()) {
            E.cy = E.cy + 1;
            if (E.cx > sh.length(E.rows.at(E.cy))) {
                E.cx = sh.length(E.rows.at(E.cy));
            }
        }
    }
}

void insertChar(CHAR c) {
    sh.insert(E.rows.at(E.cy), E.cx, c);
    E.cx = E.cx + 1;
}

void deleteChar() {
    if (E.cx < sh.length(E.rows.at(E.cy))) {
        sh.erase(E.rows.at(E.cy), E.cx, 1);
    }
}


void processCommand() {
    if (E.command_buffer == "q") exit(0);
    else if (E.command_buffer == "w") saveFile();
    else if (E.command_buffer == "wq") { saveFile(); exit(0); }
    else E.status_msg = "Not an editor command: :" + E.command_buffer;

    E.command_buffer = "";
    E.command_mode = FL;
}

//---------------------- Keypress Processing ----------------------//
void processKeypress() {
    CHAR c = io.readChar();

    if (E.command_mode) {
        if (c == '\r' || c == '\n') processCommand();
        else if (c == 127 || c == '\b') {
            if (sh.length(E.command_buffer) > 0) 
                E.command_buffer = E.command_buffer.substr(0, sh.length(E.command_buffer)-1);
        } else if (c == 27) { 
            E.command_mode = FL;
            E.command_buffer = "";
        } else {
            sh.insert(E.command_buffer, sh.length(E.command_buffer), c);
        }
        return;
    }

    if (!E.insert_mode) {
        if (c == 'i') {
            E.insert_mode = TR;
        }
        else if (c == 'q') {
            exit(0);
        }
        else if (c == 's') {
            saveFile();
        }
        else if (c == 'x') {
            deleteChar();
        }
        else if (c == 'o') {
            E.rows.insert(E.cy + 1, ""); 
            E.cy = E.cy + 1; 
            E.cx = 0; 
            E.insert_mode = TR;
        }
        else if (c == ':') {
            E.command_mode = TR;
        }
        else {
            moveCursor(c);
        }
    } 
    else {
        if (c == 27) { 
            E.insert_mode = FL; 
        }
        else if (c == 127 || c == '\b') { 
            if (E.cx > 0) { 
                sh.erase(E.rows.at(E.cy), E.cx-1, 1); 
                E.cx = E.cx - 1; 
            } 
        }
        else if (c == '\r') { 
            string newLine = sh.substr(E.rows.at(E.cy), E.cx, sh.length(E.rows.at(E.cy)) - E.cx);
            E.rows.at(E.cy) = sh.substr(E.rows.at(E.cy), 0, E.cx);
            E.rows.insert(E.cy + 1, newLine); 
            E.cy = E.cy + 1; 
            E.cx = 0;
        }
        else {
            insertChar(c);
        }
    }
}


int main() {
    openFile("");  // default file
    while (TR) {
        drawRows();
        processKeypress();
    }
    return 0;
}
