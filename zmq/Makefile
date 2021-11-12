CC = gcc
CFLAGS = -lczmq -lm -O1

all: sub_filter pub_file sub_file2

sub_file2: sub_file2.c
	$(CC) $(CFLAGS) -o sub_file2 sub_file2.c
sub_mem: sub_mem.c
	$(CC) $(CFLAGS) -o sub_mem sub_mem.c
sub_filter: sub_filter.c
	$(CC) $(CFLAGS) -o sub_filter sub_filter.c
pub_file: pub_file.c
	$(CC) -lczmq -lm -O1 -o pub_file pub_file.c

