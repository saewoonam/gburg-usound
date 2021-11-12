CC = gcc
CFLAGS = -lzmq -lm -O1

all: sub_filter pub_file sub_file

sub_file: sub_file.c
	$(CC) $(CFLAGS) -o sub_file sub_file.c
sub_filter: sub_filter.c
	$(CC) $(CFLAGS) -o sub_filter sub_filter.c
pub_file: pub_file.c
	$(CC) $(CFLAGS) -o pub_file pub_file.c

