#include <cstdio>   // for getchar(), putchar()
#include <cstdlib>  // for exit()

// For now we are using these header files but we need to get them from the OS Team since they could not provide it now , we are temporarily using this




class IOHandler {
public:
    // Read a character
    char readChar() {
        return getchar();  // reads one char
    }

    // Read a string until newline
    void readString(char* buffer, int size) {
        int i = 0;
        char c;
        while (i < size - 1 && (c = getchar()) != '\n' && c != EOF) {
            buffer[i++] = c;
        }
        buffer[i] = '\0';
    }

    // Read an integer
    int readInt() {
        char buffer[50];
        readString(buffer, 50);
        return atoi(buffer); // convert string → int
    }

    // Print a string
    void printString(const char* str) {
        while (*str) {
            putchar(*str);
            str++;
        }
    }

    // Print integer
    void printInt(int x) {
        char buffer[50];
        sprintf(buffer, "%d", x);  // convert int → string
        printString(buffer);
    }

    // Print double
    void printDouble(double x) {
        char buffer[100];
        sprintf(buffer, "%lf", x); // convert double → string
        printString(buffer);
    }
    
};

