// termios.gs — terminal control library (struct + raw mode)

class Termios {
public
    int c_lflag;

    Termios() {
        c_lflag = 0;
    }

    void copyFrom(Termios src) {
        c_lflag = src.c_lflag;
    }
};


class TerminalHandler {
private
    Termios E_orig_termios;

public
    void disableRawMode() {
        tcsetattr(0, 2, E_orig_termios);  // STDIN_FILENO = 0, TCSAFLUSH = 2
    }

    void enableRawMode() {
        tcgetattr(0, E_orig_termios);
        sys_write(1, "Raw mode enabled.\n", 18);

        Termios raw;
        raw.copyFrom(E_orig_termios);
        raw.c_lflag = raw.c_lflag & ~(1 | 2);  // simulate ECHO | ICANON
        tcsetattr(0, 2, raw);
    }

    void tcgetattr(int fd, Termios &t) {
        // simulate system terminal state read
        t.c_lflag = 1;
    }

    void tcsetattr(int fd, int flag, Termios t) {
        // simulate applying terminal attributes
        sys_write(1, "Termios attributes set.\n", 25);
    }
};
