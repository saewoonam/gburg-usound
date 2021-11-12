# quick instructions
## Requirements
Must have libzmq installed.
## use make to compile the code
# To run:
##  Must remember that subscribers always miss the first published message.  So, all the subscribers must be run in the correct order.  In this case run each of these commands in a separate terminal and in this order:

1.  ./sub_file ipc://filter.zmq filter.out.zmq
2.  ./sub_filter
3.  ./pub_file


## sub_file will subscribe to a channel and write the output to a file
## sub_filter will subscribe to the microphone channel and filter the microcphone data and publish it on the ipc://filter.zmq channel
## pub_file will publish data from a file like it is coming from the microphone.  It will send 64 samples every millisecond.

