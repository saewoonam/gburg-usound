#include <stdio.h>
#include <assert.h>

#include <zmq.h>

int main()
{
    void *context = zmq_ctx_new();
    void *subscriber = zmq_socket(context, ZMQ_SUB);
    // int rc = zmq_connect(subscriber, "ipc://example.out");
    // int rc = zmq_connect(subscriber, "tcp://localhost:8000");
    int rc = zmq_connect(subscriber, "ws://localhost:8000");
    assert(rc == 0);
    rc = zmq_setsockopt(subscriber, ZMQ_SUBSCRIBE, "", 0);
    assert(rc == 0);

    char message[1024];

    while(1)
    {
        rc = zmq_recv(subscriber, message, 1024, 0);
        assert(rc != -1);
        printf("%s\r\n", message);
    }

    zmq_close(subscriber);
    zmq_ctx_destroy(context);

    return 0;
}
