#include <czmq.h>
#include <unistd.h> // write
#include <fcntl.h>  // open
#include <stdio.h>
#include <math.h>

double c;

void slide_goertzel(int32_t *x, double c,
        int32_t block_size, int32_t N, double *P, double *delays) {
    double z0, z1, z2;

    z1 = delays[0];
    z2 = delays[1];
    for (int idx = 0; idx < block_size; idx++) {
        z0 = x[idx] - x[idx-N] + c * z1 - z2;
        z2 = z1;
        z1 = z0;
        P[idx] = z2 * z2 + z1 * z1 - c * z1 * z2;
    }
    delays[0] = z1;
    delays[1] = z2;
}

int main(int argc, char const *argv[]) {
    c = cos(1);
    int buffer[(1<<16)];
    int write_addr = 0;
    memset(buffer, 0, (1<<18));
    unsigned char *ring;
    ring = (unsigned char *) buffer;
    printf("buffer size: %lu\r\n", sizeof(buffer));
    printf("ring size: %lu\r\n", sizeof(ring));
    zsock_t *socket = zsock_new_sub("ipc://example.sock", "TOPIC");
    zsock_t *filter_socket = zsock_new_sub("ipc://filter.sock", "FILTER");
    // zsock_t *socket = zsock_new_sub("tcp://127.0.0.1:8889",  "");
    assert(socket);

    unsigned char *frame;
    char *topic;
    int count;
    int size;
    int fd = open("out.bin", O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);
    while (true) {
        int rc = zsock_recv(socket, "sib", &topic, &count, &frame, &size);
        assert(rc == 0);
        zsys_info("recv on %s:%d:%d:%d:%08x", topic, count, size,
                  write_addr, ((int32_t *)frame)[0]);
        printf("cos: %lf\r\n", c);
        if ((count) & (1<<31)) {
            free(topic);
            free(frame);
            break;
        }
        ring = (unsigned char *) buffer;
        ring += write_addr;
        memcpy(ring, frame, (unsigned long) size);
        write_addr = (write_addr + size) & (0xFFFF);
        // write(fd, frame, (unsigned long) size);
        // fsync(fd);
        free(topic);
        free(frame);
    }
    close(fd);
    zsock_destroy(&socket);

    return 0;
}
