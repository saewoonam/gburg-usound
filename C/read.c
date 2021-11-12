#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    int fd;
    int N = 1280000;
    int32_t data[N];
    fd = open("single_tone_v2.dat", O_RDONLY);
    read(fd, data, N<<2);
    printf("fd: %d\r\n", fd);
    close(fd);
    printf("Print first 10\r\n");
    for (int i=0; i<10; i++) {
        printf("%d: %08x\r\n", i, data[i]);
    }
    printf("Print last 10\r\n");
    for (int i=0; i<10; i++) {
        printf("%d: %08x\r\n", N-10+i, data[N-10+i]);
    }
    printf("Print invalid data\r\n");
    for (int i=0; i<N; i++) {
        // if (data[i] % (1<<14))
        if (data[i] & 0x3FFF)
        printf("%d: %x\r\n", i, data[i]);
    }
    exit(0);
}
