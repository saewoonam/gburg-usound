#include <czmq.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>


int main(int argc, char ** argv) {
    int fd;
    int N = 1280000;
    int32_t data[N];
    fd = open("../single_tone_v2.dat", O_RDONLY);
    read(fd, data, N<<2);
    printf("fd: %d\r\n", fd);
    close(fd);

    int block_size = 256;
    unsigned char *temp;
    temp = (unsigned char *) data;
    /*
    for (int i=0; i<16; i++) {
        printf("%d: %08x\r\n", i, data[i]);
    }
    for (int i=0; i<65; i++) {
        printf("%d: %02x\r\n", i, temp[i]);
    }
    exit(1);
    */
    unsigned char bytes[] = {0x00, 0x11, 0x22, 0x33, 0xFF};
    zsock_t *socket = zsock_new_pub("ipc://mic.sock");
    assert(socket);
    zsys_info("Send empty packet");
    zsock_send(socket, "sib", "TOPIC", -1, temp, block_size);
    zclock_sleep(1000);
    int count=0;
    while(count < (N<<2)) {
    // while(count < (1<<19)) {
        zsys_info("Publishing %d: %02x", count, ((int32_t *)temp)[0]);
        zsock_send(socket, "sib", "TOPIC", count, temp, block_size);
        temp += block_size;
        count += block_size;
        zclock_sleep(1);
    }
    zsock_send(socket, "sib", "TOPIC", -1, temp, block_size);

    zsock_destroy(&socket);
    return 0;
}
