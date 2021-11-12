#include <stdio.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>
#include <assert.h>

int main() {
    int fd = open("single_tone_v2.dat", O_RDONLY);
    int size;
    size = lseek(fd, 0, SEEK_END);
    printf("size: %d\r\n", size); 
}

