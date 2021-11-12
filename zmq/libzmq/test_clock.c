#include <stdio.h>
#include <time.h>

int main(){
    clock_t t;
    int64_t x;

    t = clock();
    x = clock();
    printf("clock: %lu, %ld, %lld\r\n", sizeof(t), t, x);
    return 0;
}
