#include <czmq.h>
#include <unistd.h> // write
#include <fcntl.h>  // open
#include <stdio.h>

int main(int argc, char const *argv[]) {
    char socket_name[255];
    char out_name[255];
    if (argc==1) {
        printf("no args\r\n");
        sprintf(socket_name, "ipc://mic.sock");
        printf("sprintf: %s\r\n", socket_name);
        sprintf(out_name, "sub.out");
    }
    if (argc==2) {
        sprintf(socket_name, "ipc://%s", argv[1]);
        sprintf(out_name, "sub.out");
    }
    if (argc==3) {
        sprintf(socket_name, "ipc://%s", argv[1]);
        sprintf(out_name, "%s", argv[2]);
    }
    printf("socket: %s\r\n", socket_name);
    printf("filename: %s\r\n", out_name);
    int ring[(1<<16)];
    int write_addr = 0;
    memset(ring, 0, (1<<18));
    printf("ring size: %lu\r\n", sizeof(ring));
    zsock_t *socket = zsock_new_sub(socket_name, "");
    // zsock_t *socket = zsock_new_sub("ipc://example.sock", "TOPIC");
    // zsock_t *socket = zsock_new_sub("tcp://127.0.0.1:8889",  "");
    assert(socket);

    unsigned char *frame;
    char *topic;
    int count;
    int size;
    int fd = open(out_name, O_CREAT | O_TRUNC | O_RDWR | O_SYNC, 0644);
    while (true) {
        int rc = zsock_recv(socket, "sib", &topic, &count, &frame, &size);
        assert(rc == 0);
        zsys_info("recv on %s:%d:%d:%08x", topic, count, size,
                  ((int32_t *)frame)[0]);
        if ((count) & (1<<31)) {
            free(topic);
            free(frame);
            break;
        }
        write(fd, frame, (unsigned long) size);
        fsync(fd);
        free(topic);
        free(frame);
        // printf("count: %d\r\n", (unsigned int) count);
        //free(size);
        //free(count);
    }
    close(fd);
    zsock_destroy(&socket);

    return 0;
}
