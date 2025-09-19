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
    
};


class Arithmetic {
public:

    int abs(int x) {
        return (x < 0) ? -x : x;
    }

    double abs(double x) {
        return (x < 0) ? -x : x;
    }

    double sqrt(double x) {
        if (x < 0) return -1; 
        if (x == 0 || x == 1) return x;

        double guess = x;
        double eps = 1e-9; 
        while (true) {
            double newGuess = 0.5 * (guess + x / guess);
            if (abs(newGuess - guess) < eps) break;
            guess = newGuess;
        }
        return guess;
    }

    double exp(double x) {
        double term = 1;   
        double sum = 1;  
        int n = 1;
        double eps = 1e-12;

        while (abs(term) > eps) {
            term *= x / n;  
            sum += term;
            n++;
        }
        return sum;
    }

    double power(double base, int exp) {
        if (exp == 0) return 1;
        if (exp < 0) return 1.0 / power(base, -exp);

        double result = 1;
        while (exp > 0) {
            if (exp % 2 == 1) result *= base;
            base *= base;
            exp /= 2;
        }
        return result;
    }


    int max(int a, int b) {
        return (a > b) ? a : b;
    }

    double max(double a, double b) {
        return (a > b) ? a : b;
    }

    int min(int a, int b) {
        return (a < b) ? a : b;
    }

    double min(double a, double b) {
        return (a < b) ? a : b;
    }
};


class StringHandler {
public:
    // length
    int length(const char* str) {
        int len = 0;
        while (str[len] != '\0') {
            len++;
        }
        return len;
    }

    // substr
    void substr(const char* str, int start, int len, char* res) {
        int n = length(str);
        if (start < 0 || start >= n) {
            res[0] = '\0'; // invalid start
            return;
        }
        int i;
        for (i = 0; i < len && (start + i) < n; i++) {
            res[i] = str[start + i];
        }
        res[i] = '\0';
    }

    //  insert
    void insert(char* str, int pos, const char* toInsert) {
        int n = length(str);
        int m = length(toInsert);

        if (pos < 0 || pos > n) return;

        // Shift right
        for (int i = n - 1; i >= pos; i--) {
            str[i + m] = str[i];
        }

        // Copy insertion
        for (int i = 0; i < m; i++) {
            str[pos + i] = toInsert[i];
        }

        str[n + m] = '\0';
    }

    // compare
    int compare(const char* s1, const char* s2) {
        int i = 0;
        while (s1[i] != '\0' && s2[i] != '\0') {
            if (s1[i] != s2[i]) {
                return (s1[i] - s2[i]);
            }
            i++;
        }
        return s1[i] - s2[i];
    }

    //  erase
    void erase(char* str, int pos, int len) {
        int n = length(str);
        if (pos < 0 || pos >= n) return;

        for (int i = pos; i + len < n; i++) {
            str[i] = str[i + len];
        }
        str[n - len] = '\0';
    }

    // islower
    bool islower(char c) {
        return (c >= 'a' && c <= 'z');
    }

   // isupper
    bool isupper(char c) {
        return (c >= 'A' && c <= 'Z');
    }

    // tolower
    char tolower(char c) {
        if (isupper(c)) return c + ('a' - 'A');
        return c;
    }

    // toupper
    char toupper(char c) {
        if (islower(c)) return c - ('a' - 'A');
        return c;
    }

    //isalpha
    bool isalpha(char c) {
        return (islower(c) || isupper(c));
    }

    // isalnum
    bool isalnum(char c) {
        return (isalpha(c) || isnum(c));
    }

    // isnum (check digit)
    bool isnum(char c) {
        return (c >= '0' && c <= '9');
    }
};
