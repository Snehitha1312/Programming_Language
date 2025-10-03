class Vector {
private:
    int arr[1000];   // fixed size array for simplicity
    int vsize;       // current number of elements

public:
    Vector() {
        vsize = 0;
    }

    // push_back
    void push_back(INT val) {
        if (vsize < 1000) {
            arr[vsize] = val;
            vsize++;
        }
    }

    // pop_back
    void pop_back() {
        if (vsize > 0) {
            vsize--;
        }
    }

    // size
    int size() {
        return vsize;
    }

    // get element
    int at(INT index) {
        if (index < 0 || index >= vsize) return -1; // error value
        return arr[index];
    }

    // set element
    void set(INT index, INT val) {
        if (index < 0 || index >= vsize) return;
        arr[index] = val;
    }

    // clear vector
    void clear() {
        vsize = 0;
    }

    // check if empty
    bool empty() {
        return (vsize == 0);
    }

    // print all elements (for testing)
    void print() {
        INT i;
        for (i = 0; i < vsize; i++) {
            sys_print_int(arr[i]);  // assuming sys call for printing int
            sys_print_char(' ');
        }
        sys_print_char('\n');
    }
};
