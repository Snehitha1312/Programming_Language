//define O_RDONLY  0   // open for reading only
//define O_WRONLY  1   // open for writing only
//define O_RDWR    2   // open for reading and writing
//define O_CREAT   64  // create file if it does not exist
//define O_TRUNC   512 // truncate file if it exists
//define O_APPEND  1024 // append mode
class FileHandler {

    private int fd;         // file descriptor
    private bool isOpen;    // flag to check if file is open

    FileHandler() {
        fd = -1;
        isOpen = false;
    }

    public int fopen(char filename[], int mode) {
        int flags = 0;

        if (mode == 0)       flags = 0;                    // read
        else if (mode == 1)  flags = 1 | 64 | 512; // write (create/truncate)
        else if (mode == 2)  flags = 1 | 64 | 1024; // append

        fd = sys_open(filename, flags, 0644); // using syscall
        if (fd < 0) {
            isOpen = false;
            return -1; // error
        }

        isOpen = true;
        return 0; // success
    }

    public void fclose() {
        if (isOpen) {
            sys_close(fd);
            fd = -1;
            isOpen = false;
        }
    }

    public int fread(char buffer[], int size) {
        if (!isOpen) return -1;
        int bytesRead = sys_read(fd, buffer, size);
        return bytesRead;
    }


    public int fwrite(char buffer[], int size) {
        if (!isOpen) return -1;
        int bytesWritten = sys_write(fd, buffer, size);
        return bytesWritten;
    }


    public bool is_open() {
        return isOpen;
    }
};
