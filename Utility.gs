class Utility {
public:
    // swap
    template <typename T>
    void swap(T &a, T &b) {
        T temp = a;
        a = b;
        b = temp;
    }
};


class Algorithms {
private:
    Utility util;

public:
    // Insertion 
    void insert(int arr[], int &n, int pos, int value) {
        if (pos < 0 || pos > n) return;

        for (int i = n; i > pos; i--) {
            arr[i] = arr[i - 1];
        }
        arr[pos] = value;
        n++;
    }

    // sort
    void sort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    util.swap(arr[j], arr[j + 1]);
                }
            }
        }
    }

    // Reverse 
    void reverse(int arr[], int n) {
        int start = 0, end = n - 1;
        while (start < end) {
            util.swap(arr[start], arr[end]);
            start++;
            end--;
        }
    }
};
