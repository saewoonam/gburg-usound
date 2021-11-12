#include <stdio.h>
#include <assert.h>
#include <string.h>

#include <unistd.h> // write
#include <fcntl.h>  // open

#include <zmq.h>

#include <math.h>

int main (int argc, char *argv[]) {
    if (argc != 3) {
        printf("Not the right number of arguments\r\n");
        return 1;
    }
    void *context = zmq_ctx_new();
    void *subscriber = zmq_socket(context, ZMQ_SUB);
    // int rc = zmq_connect(subscriber, "ipc://mic.zmq");
    int rc = zmq_connect(subscriber, argv[1]);
    assert(rc == 0);
    rc = zmq_setsockopt(subscriber, ZMQ_SUBSCRIBE, "", 0);
    assert(rc == 0);

    unsigned char packet[1024];
    int *header;
    header = (int *)packet;

    char *filename="out.dat";

    int fd = open(argv[2], O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);

    int prev_count = -1;
    while(1)
    {
        rc = zmq_recv(subscriber, packet, 1024, 0);
        assert(rc != -1);
        /*  print status and count once every 256 packets */
        if ((header[1] & 0xFF) == 0) {
            printf("%d %d\r\n", header[0], header[1]);
        }
        /*  exit if status is < 0 */
        if (header[0]<0) {
            break;
        }
        /* check if missing packets */
        if (prev_count + 1 != header[1]) {
            printf("prev: %d, curr: %d\r\n", prev_count, header[1]);
        }
        prev_count = header[1];
        /* write packet to file without header info */
        rc = (rc-16) ;  // subtract 8 bytes for status, count, and ts
        write(fd, packet+16, rc);
    }
    close(fd);
    zmq_close(subscriber);
    zmq_ctx_destroy(context);

    return 0;
}
