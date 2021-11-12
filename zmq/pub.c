#include <czmq.h>

int main(int argc, char ** argv) {

  unsigned char bytes[] = {0x00, 0x11, 0x22, 0x33, 0xFF};
  zsock_t *socket = zsock_new_pub("ipc://example.sock");
  assert(socket);
  zsys_info("sizeof(bytes): %d", sizeof(bytes));
  int count=0; 
  while(!zsys_interrupted) {
    zsys_info("Publishing");
    zsock_send(socket, "sib", "TOPIC", count++, bytes, sizeof(bytes));
    zclock_sleep(1);
  }

  zsock_destroy(&socket);
  return 0;
}
