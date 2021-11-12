#include <zmq.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>
#include <assert.h>

struct packet_struct {
    int32_t status;
    int32_t count;
    int64_t timestamp;
    int32_t data[64];
};

int main(int argc, char ** argv) {
    /*  Read file with data */
    char filename[1024];
    int fd;
    int N = 1280000;
    int32_t data[N];
    if (argc != 2) {
        sprintf(filename, "single_tone_v2.dat");
    }
    if (argc == 2) {
        sprintf(filename, "%s", argv[1]);
    }
    fd = open(filename, O_RDONLY);
    read(fd, data, N<<2);
    printf("fd: %d\r\n", fd);
    close(fd);

    struct packet_struct packet;

    void *context = zmq_ctx_new();
    void *publisher = zmq_socket(context, ZMQ_PUB);
    int rc = zmq_bind(publisher, "ipc://mic.zmq");
    assert(rc == 0);

    packet.status = 0;
    packet.count = -1;
    memset(packet.data, 0, 256);
    /*  pub message...  missed by sub */
    rc = zmq_send(publisher, "First", 5, 0);
    assert(rc == 5);
    sleep(1);

    int count=0;
    // while (count < (1<<11)) {
    while (count < N/64) {
        packet.count = count;
        memcpy(packet.data, data + count*64, 256);
        packet.timestamp = clock();
        // printf("Pub packet: %d %d %x %x\r\n",
        //         count, count*64, data[count*64], packet.data[0]);
        rc = zmq_send(publisher, &packet, sizeof(packet), 0);
        assert(rc == sizeof(packet));
        count++;
        usleep(1000);
    }
    packet.status = -1;
    packet.count = -1;
    rc = zmq_send(publisher, &packet, sizeof(packet), 0);
    zmq_close(publisher);
    zmq_ctx_destroy(context);

    return 0;
}
