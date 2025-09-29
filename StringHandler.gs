
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
