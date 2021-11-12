#include <stdio.h>
#include <stdlib.h>
#define N (1<<22)
int main() {
    // int ints[N];
    // double dbl[N];
    double *dbl;
    dbl = (double *) malloc( N*sizeof(double));
    int *ints;
    ints = (int *) malloc( N*sizeof(int));
    printf("allocated memory\r\n");
    for (int i=0; i<N; i++) {
        ints[i] = i;
        dbl[i] = i;
    }
    printf("dbl[end]: %e\4\n", dbl[N-1]);
    printf("ints[end]: %d\4\n", ints[N-1]);
    return 0;
}
