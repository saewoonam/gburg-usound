#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

void filter_nader(int32_t *data, double *P, int L);
void filter_nader2(int32_t *data, float *P, int L);
void filter_saewoo(int32_t *data, double *P, int L);

int main() {
    int fd;
    int N = 1280000;
    int32_t data[N];
    double *P;
    P = (double *) malloc(N<<3);
    fd = open("single_tone_v2.dat", O_RDONLY);
    read(fd, data, N<<2);
    printf("Read data\r\n");
    close(fd);
    for (int idx=0; idx < N; idx++) {
        data[idx] >>= 14;
    }
    printf("Calculate goertzel\r\n");
    filter_saewoo(data, P, N);
    printf("write to file\r\n");
    fd = open("saewoo.out", O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);
    write(fd, (unsigned char *)P, N<<3);
    close(fd);
    printf("Calculate nader\r\n");
    filter_nader(data, P, N);
    printf("write to file\r\n");
    fd = open("nader.out", O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);
    write(fd, (unsigned char *)P, N<<3);
    close(fd);
    printf("Calculate nader float\r\n");
    filter_nader2(data, (float *)P, N);
    printf("write to file\r\n");
    fd = open("nader2.out", O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);
    write(fd, (unsigned char *)P, N<<2);
    close(fd);
    exit(0);
}
