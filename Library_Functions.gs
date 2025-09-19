
// Custom IO class simulating cin and cout
// class IO {
// public:
//     // Custom cout
//     template <typename T>
//     IO& myCout(const T& value) {
//         cout << value;   // internally uses std::cout
//         return *this;
//     }

//     // Overload for manipulators like endl
//     IO& myCout(IO& (*manip)(IO&)) {
//         return manip(*this);
//     }

//     // Custom cin
//     template <typename T>
//     IO& myCin(T& value) {
//         cin >> value;   // internally uses std::cin
//         return *this;
//     }

//     // getline version
//     IO& myGetline(string& str) {
//         getline(cin, str);
//         return *this;
//     }

//     // Our custom endl
//     static IO& endl(IO& io) {
//         cout << "\n";
//         return io;
//     }
// };

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
};
