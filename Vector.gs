
// Vector for int
class VectorInt {
private:
    int arr[1000];
    int vsize;

public:
    VectorInt() {
        vsize = 0;
    }

    void push_back(int val) {
        if (vsize < 1000) {
            arr[vsize] = val;
            vsize++;
        }
    }

    void pop_back() {
        if (vsize > 0) vsize--;
    }

    int size() {
        return vsize;
    }

    int at(int index) {
        if (index < 0 || index >= vsize) return -1;
        return arr[index];
    }

    void set(int index, int val) {
        if (index < 0 || index >= vsize) return;
        arr[index] = val;
    }

    void clear() {
        vsize = 0;
    }

    bool empty() {
        return (vsize == 0);
    }

    void print() {
        int i;
        for (i = 0; i < vsize; i++) {
            sys_print_int(arr[i]);
            sys_print_char(' ');
        }
        sys_print_char('\n');
    }
};


// ===============================
// Vector for float
// ===============================
class VectorFloat {
private:
    float arr[1000];
    int vsize;

public:
    VectorFloat() {
        vsize = 0;
    }

    void push_back(float val) {
        if (vsize < 1000) {
            arr[vsize] = val;
            vsize++;
        }
    }

    void pop_back() {
        if (vsize > 0) vsize--;
    }

    int size() {
        return vsize;
    }

    float at(int index) {
        if (index < 0 || index >= vsize) return -1.0;
        return arr[index];
    }

    void set(int index, float val) {
        if (index < 0 || index >= vsize) return;
        arr[index] = val;
    }

    void clear() {
        vsize = 0;
    }

    bool empty() {
        return (vsize == 0);
    }

    void print() {
        int i;
        for (i = 0; i < vsize; i++) {
            sys_print_double(arr[i]); // using system double printer for float
            sys_print_char(' ');
        }
        sys_print_char('\n');
    }
};

// Vector for char
// ===============================
class VectorChar {
private:
    char arr[1000];
    int vsize;

public:
    VectorChar() {
        vsize = 0;
    }

    void push_back(char val) {
        if (vsize < 1000) {
            arr[vsize] = val;
            vsize++;
        }
    }

    void pop_back() {
        if (vsize > 0) vsize--;
    }

    int size() {
        return vsize;
    }

    char at(int index) {
        if (index < 0 || index >= vsize) return '\0';
        return arr[index];
    }

    void set(int index, char val) {
        if (index < 0 || index >= vsize) return;
        arr[index] = val;
    }

    void clear() {
        vsize = 0;
    }

    bool empty() {
        return (vsize == 0);
    }

    void print() {
        int i;
        for (i = 0; i < vsize; i++) {
            sys_print_char(arr[i]);
            sys_print_char(' ');
        }
        sys_print_char('\n');
    }
};
