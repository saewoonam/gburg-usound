#include <czmq.h>
#include <unistd.h> // write
#include <fcntl.h>  // open
#include <stdio.h>
#include <math.h>
// #include <stdint.h>  /int32_t

#define buffer_size  16  // buffer size is (1<< buffer_size)
#define bf_sz (1<<buffer_size)
#define bf_sz_mask (bf_sz-1)

void filter(int32_t *x, int32_t start, double c,
        int32_t block_size, int32_t N, double *P, double *delays) {
    double z0, z1, z2;

    int32_t addr; 
    z1 = delays[0];
    z2 = delays[1];
    for (int idx = 0; idx < block_size; idx++) {
        addr = start + idx;
        z0 = (x[addr]>>14) - (x[ (addr-N) & bf_sz_mask ] >> 14) + c * z1 - z2;
        z2 = z1;
        z1 = z0;
        P[idx] = z2 * z2 + z1 * z1 - c * z1 * z2;
    }
    delays[0] = z1;
    delays[1] = z2;
}

void print_vars(double * delays) {
    printf("delays: %lf %lf\r\n", delays[0], delays[1]);
    printf("bf_sz: %d\r\n", bf_sz);
    printf("bf_sz_mask: %d\r\n", bf_sz_mask);
}

int main(int argc, char const *argv[]) {
    int k = 100;  // frequency of tone in DFT units
    int pulse_width = 256;  // pulse_width in sampling time units
    double w = 2 * M_PI * k / pulse_width;
    double c = 2*cos(w);
    double delays[] = {0, 0};
    double Pxx[pulse_width>>2];
    int prev_count = 0;

    int buffer[bf_sz];
    int write_addr = 0; // index of integer array
    memset(buffer, 0, (bf_sz<<2));
    unsigned char *ring;
    ring = (unsigned char *) buffer;
    printf("buffer size: %lu\r\n", sizeof(buffer));
    printf("ring size: %lu\r\n", sizeof(ring));
    zsock_t *socket = zsock_new_sub("ipc://mic.sock", "TOPIC");
    zsock_t *filter_socket = zsock_new_pub("ipc://filter.sock");
    // zsock_t *socket = zsock_new_sub("tcp://127.0.0.1:8889",  "");

    assert(socket);

    zsys_info("Send empty packet");
    zsock_send(filter_socket, "sib", "FILTER", -1, Pxx, sizeof(Pxx));
    zclock_sleep(1000);

    unsigned char *frame;
    char *topic;
    int count;
    int size;

    int fd = open("out.bin", O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);
    while (true) {
        int rc = zsock_recv(socket, "sib", &topic, &count, &frame, &size);
        assert(rc == 0);
        /* zsys_info("recv on %s:%d:%d:%d:%08x", topic, count, size, */
        /*           write_addr, ((int32_t *)frame)[0]); */
        if ((count) & (1<<31)) {
            zsock_send(filter_socket, "sib", "FILTER", -1, Pxx, sizeof(Pxx));
            free(topic);
            free(frame);
            break;
        }
        zsys_info("count: %d", count);
        // zsys_info("count-prev_count: %d", count-prev_count);
        // prev_count = 1*count;
        ring = (unsigned char *) buffer;
        ring += (write_addr<<2);
        memcpy(ring, frame, (unsigned long) size);
        filter(buffer, write_addr, c, size>>2, pulse_width, Pxx, delays);
        zsock_send(filter_socket, "sib", "FILTER", count, Pxx, sizeof(Pxx));
        write_addr = (write_addr + (size>>2)) & (0xFFFF);
        free(topic);
        free(frame);
    }
    close(fd);
    zsock_destroy(&socket);
    zsock_destroy(&filter_socket);

    return 0;
}
