CC = gcc
CFLAGS = -lczmq -lm -O1

all: compare

compare: compare.c filters.c
	$(CC) $(CFLAGS) -o compare compare.c filters.c

