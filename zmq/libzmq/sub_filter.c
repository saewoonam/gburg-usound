#include <stdio.h>
#include <assert.h>
#include <string.h>

#include <unistd.h> // write
#include <fcntl.h>  // open

#include <zmq.h>

#include <math.h>

#define bf_sz_mask ( (1<<16) - 1)

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

int main()
{
    void *context = zmq_ctx_new();
    void *subscriber = zmq_socket(context, ZMQ_SUB);
    int rc = zmq_connect(subscriber, "ipc://mic.zmq");
    assert(rc == 0);
    rc = zmq_setsockopt(subscriber, ZMQ_SUBSCRIBE, "", 0);
    assert(rc == 0);
    /* setup publisher for filtered data */
    void *publisher = zmq_socket(context, ZMQ_PUB);
    rc = zmq_bind(publisher, "ipc://filter.zmq");
    assert(rc == 0);
    /*  pub message...  missed by sub */
    rc = zmq_send(publisher, "First", 5, 0);
    assert(rc == 5);
    sleep(1);

    unsigned char packet[1024];
    int *msg;
    msg = (int *)packet;
    int buffer[65536];
    int write_addr = 0;
    unsigned char *tmp;

    char *filename="out.dat";
    int fd2 = open("filter.out", O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);

    /* filter parameters */
    int k = 100;
    int pulse_width = 256;  // pulse_width in sampling time units
    double w = 2 * M_PI * k / pulse_width;
    double c = 2*cos(w);
    double delays[] = {0, 0};
    // double Pxx[pulse_width>>2];
    double *Pxx;
    Pxx = (double *)(packet+16);
    int prev_count = -1;
    memset(buffer, 0, 65536<<2);
    while(1)
    {
        rc = zmq_recv(subscriber, packet, 512, 0);
        assert(rc != -1);
        if ((msg[1] & 0xFF) == 0) {
            printf("%d %d %x %x\r\n", msg[0], msg[1], msg[2], msg[3]);
        }
        if (msg[0]<0) {
            zmq_send(publisher, packet, rc, 0);
            break;
        }
        if (prev_count + 1 != msg[1]) {
            printf("prev: %d, curr: %d\r\n", prev_count, msg[1]);
        }
        prev_count = msg[1];
        rc = (rc-16) ;  // subtract 16 bytes for status, count, and ts
        // copy data from packet into a ring buffer
        memcpy(buffer+write_addr, (msg+4), (size_t) rc);
        // compute filter and put result back in packet
        filter(buffer, write_addr, c, rc>>2, pulse_width, Pxx, delays);
        zmq_send(publisher, packet, (rc<<1) + 16, 0);
        write(fd2, Pxx, rc<<1);

        write_addr += rc>>2;  // divide by 4 because int is 4 bytes
        write_addr %= 65536;
        // usleep(1000); 
    }
    close(fd2);
    zmq_close(publisher);
    zmq_close(subscriber);
    zmq_ctx_destroy(context);

    return 0;
}
