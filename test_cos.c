#include <stdio.h>
#include <math.h>

float test_cos(float num) {
        return cos(num);
}

int main() {
        printf("%1.16e\r\n", test_cos(1.0));
        printf("%1.16e\r\n", cos(1.0));
}
