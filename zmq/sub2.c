#include <czmq.h>

int main(int argc, char const *argv[])
{
    zsock_t *socket = zsock_new_sub("ipc://example.sock", "TOPIC");
    // zsock_t *socket = zsock_new_sub("tcp://127.0.0.1:8889",  "");
    assert(socket);

    unsigned char *frame;
    char *topic;
    char *msg;
    int count;
    int size;

    long i = 0;
    while (true) {
        //int rc = zsock_recv(socket, "ssb", &topic, &msg, &frame, &size);
        int rc = zsock_recv(socket, "sib", &topic, &count, &frame, &size);
        assert(rc == 0);

        zsys_info("recv on %s:%d:%d:%x", topic, count, size, frame[4]);

        free(topic);
        free(frame);
        //free(size);
        //free(count);
    }

    zsock_destroy(&socket);

    return 0;
}
