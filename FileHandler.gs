// myfile struct (acts like FILE*)
class myfile {
public:
    int fd;             // system file descriptor
    string mode;        // "r", "w", "a", etc.
    vector<char> buffer; // optional buffer
    int pos;            // current position

    myfile() {
        fd = -1;
        pos = 0;
    }
};

// fread result struct
class FReadResult {
public:
    vector<char> data;  // data read
    myfile f;           // updated file struct
};

// fwrite result struct
class FWriteResult {
public:
    int written;        // number of chars written
    myfile f;           // updated file struct
};

class FileHandler {
public:

    // fopen imitation
    myfile fopen(string filename, string mode) {
        int flags = 0;

        if (mode[0] == 'r') {
            flags = O_RDONLY;
        } else if (mode[0] == 'w') {
            flags = O_WRONLY | O_CREAT | O_TRUNC;
        } else if (mode[0] == 'a') {
            flags = O_WRONLY | O_CREAT | O_APPEND;
        }

        int fd = sys_open(filename, flags, 0644); // assume syscall wrapper
        myfile f;
        f.fd = fd;
        f.mode = mode;
        f.pos = 0;
        return f;
    }

    // fclose imitation
    int fclose(myfile f) {
        if (f.fd < 0) return -1;
        return sys_close(f.fd); // assume syscall wrapper
    }

    // fread imitation
    // returns struct containing read data and updated file
    FReadResult fread(int count, myfile f) {
        FReadResult res;
        res.f = f;  // start with current file
        int i = 0;

        while (i < count) {
            char c;
            int r = sys_read(f.fd, c, 1); // read 1 char at a time
            if (r <= 0) break;
            res.data.push_back(c);
            res.f.pos++;
            i++;
        }

        return res;
    }

    // fwrite imitation
    // returns struct containing number of chars written and updated file
    FWriteResult fwrite(vector<char> data, myfile f) {
        FWriteResult res;
        res.f = f;
        res.written = 0;

        for (int i = 0; i < data.size(); i++) {
            int r = sys_write(f.fd, data[i], 1); // write 1 char at a time
            if (r <= 0) break;
            res.written++;
            res.f.pos++;
        }

        return res;
    }
};
