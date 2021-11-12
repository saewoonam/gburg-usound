#include <czmq.h>
#include <strings.h>

int main(int argc, char ** argv) {
  zsock_t *socket = zsock_new_sub("ipc://example.sock", "TOPIC");
  assert(socket);

  char *topic;
  char *frame;
  zmsg_t *msg;
  int rc = zsock_recv(socket, "sm", &topic, &msg);
  assert(rc == 0);

  zsys_info("Recv on %s", topic);
  zsys_info("len msg: %d", strlen(msg));
  while(frame == zmsg_popstr(msg)) {
    zsys_info("> %s", frame);
    free(frame);
  }
  free(topic);
  zmsg_destroy(&msg);

  zsock_destroy(&socket);
  return 0;
}
