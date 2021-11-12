#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <zmq.h>

#include <unistd.h>

int main()
{
    void *context = zmq_ctx_new();
    void *publisher = zmq_socket(context, ZMQ_PUB);
    // int rc = zmq_bind(publisher, "ipc://example.out");
    // int rc = zmq_bind(publisher, "tcp://127.0.0.1:8000");
    int rc = zmq_bind(publisher, "ws://127.0.0.1:8000");
    assert(rc == 0);
    int count=0;
    char msg[1024];

    while(1)
    {
        printf("pub: %8d\r\n", count);
        sprintf(msg, "count: %8d", count++);
        rc = zmq_send(publisher, msg, strlen(msg), 0);
        assert(rc == strlen(msg));
        /* usleep(1000000); */
        sleep(1);
    }

    zmq_close(publisher);
    zmq_ctx_destroy(context);

    return 0;
}
