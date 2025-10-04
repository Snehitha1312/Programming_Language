class FileHandler {
private:
    int fd;         // file descriptor
    bool isOpen;    // flag to check if file is open

public:
    FileHandler() {
        fd = -1;
        isOpen = false;
    }

    int fopen(char filename[], int mode) {
        int flags = 0;

        if (mode == 0)       flags = O_RDONLY;                    // read
        else if (mode == 1)  flags = O_WRONLY | O_CREAT | O_TRUNC; // write (create/truncate)
        else if (mode == 2)  flags = O_WRONLY | O_CREAT | O_APPEND; // append

        fd = sys_open(filename, flags, 0644); // using syscall
        if (fd < 0) {
            isOpen = false;
            return -1; // error
        }

        isOpen = true;
        return 0; // success
    }

    void fclose() {
        if (isOpen) {
            sys_close(fd);
            fd = -1;
            isOpen = false;
        }
    }

    int fread(char buffer[], int size) {
        if (!isOpen) return -1;
        int bytesRead = sys_read(fd, buffer, size);
        return bytesRead;
    }


    int fwrite(char buffer[], int size) {
        if (!isOpen) return -1;
        int bytesWritten = sys_write(fd, buffer, size);
        return bytesWritten;
    }


    bool is_open() {
        return isOpen;
    }
};
