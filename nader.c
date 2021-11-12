#include <math.h>
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>

#define L 1280000 /* Number of microphone data samples */

/* Each line of the data file starts with a 7-hexadecimal-digit count number,
*
*    followed by up to four data samples.  Each sample is stored in the form of
*
*       eight hexadecimal digits in four groups of two digits.  There are a number
*
*          of single blanks separating various data fields on each line.             */

int main(int argc,char *argv[]) {
int i, fd ;
void exit() ;
int raw_data[L] ;
int *ptr ;
printf("sizeof int: %ld\r\n", sizeof(int));
printf("sizeof raw_data: %ld\r\n", sizeof(raw_data));
if ( ( fd = open(argv[1],0) )  ==  -1 ) {
    printf("Error in opening the microphone data file.\n") ;
    exit(1) ;
}
if ( ( i = read(fd,raw_data,L<<2) )  !=  L<<2 ) {
    printf("Error in reading the microphone data.\n") ;
    exit(1) ;
}
close(fd) ;
ptr = &raw_data[0] ;
for ( i = 0; i < L; ++i,++ptr ) {
    if ( (*ptr % 16384) != 0 ) {
        printf("Microphone Data Format Violation Error\n") ;
        printf("Sample # %d = %d\n",i,*ptr) ;
        // exit(1) ;
        }
    }
    ptr = &raw_data[0] ;
    for ( i = 0; i < 20; ++i,++ptr )
    printf("%d\n",*ptr/16384) ;
}

