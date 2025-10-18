class Utility {

    // Swap for int
    public void swap(int &a, int &b) {
        int temp = a;
        a = b;
        b = temp;
    }

    // Swap for float
    public void swap(float &a, float &b) {
        float temp = a;
        a = b;
        b = temp;
    }

    // Swap for char
    public void swap(char &a, char &b) {
        char temp = a;
        a = b;
        b = temp;
    }
};


class Algorithms {
private
    Utility util;


    // Insertion 
    public void insert(int arr[], int &n, int pos, int value) {
        if (pos < 0 || pos > n) return;

        for (int i = n; i > pos; i--) {
            arr[i] = arr[i - 1];
        }
        arr[pos] = value;
        n++;
    }

    // Sort
    public void sort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    util.swap(arr[j], arr[j + 1]);
                }
            }
        }
    }

    // Reverse 
    public void reverse(int arr[], int n) {
        int start = 0, end = n - 1;
        while (start < end) {
            util.swap(arr[start], arr[end]);
            start++;
            end--;
        }
    }
};



