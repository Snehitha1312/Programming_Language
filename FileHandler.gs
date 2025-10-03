// Mimicking FILE* with a custom struct
struct MyFILE {
    int fd;         // file descriptor from system call
    const char* mode;
};

class FileHandler {
public:

    // fopen 
    MyFILE* fopen(const char* filename, const char* mode) {
        int flags = 0;

        if (mode[0] == 'r') {
            if (mode[1] == '+')
                flags = O_RDWR;       // read + write
            else
                flags = O_RDONLY;     // read only
        }
        else if (mode[0] == 'w') {
            if (mode[1] == '+')
                flags = O_RDWR | O_CREAT | O_TRUNC;
            else
                flags = O_WRONLY | O_CREAT | O_TRUNC;
        }
        else if (mode[0] == 'a') {
            if (mode[1] == '+')
                flags = O_RDWR | O_CREAT | O_APPEND;
            else
                flags = O_WRONLY | O_CREAT | O_APPEND;
        }

        int fd = sys_open(filename, flags, 0644);  // assume syscall wrapper
        if (fd < 0) return nullptr;

        MyFILE* f = new MyFILE();
        f->fd = fd;
        f->mode = mode;
        return f;
    }

    // fclose 
    int fclose(MyFILE* stream) {
        if (!stream) return -1;
        int ret = sys_close(stream->fd);
        delete stream;
        return ret;
    }

    // fread 
    size_t fread(void* buffer, size_t size, size_t count, MyFILE* stream) {
        if (!stream) return 0;
        size_t total = size * count;
        int bytes = sys_read(stream->fd, buffer, total);
        if (bytes < 0) return 0;
        return bytes / size;   // return number of elements read
    }

    // fwrite 
    size_t fwrite(const void* buffer, size_t size, size_t count, MyFILE* stream) {
        if (!stream) return 0;
        size_t total = size * count;
        int bytes = sys_write(stream->fd, buffer, total);
        if (bytes < 0) return 0;
        return bytes / size;   // return number of elements written
    }
};
