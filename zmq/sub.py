# simple_sub.py
import zmq

# Creates a socket instance
context = zmq.Context()
socket = context.socket(zmq.SUB)

# Connects to a bound socket
socket.connect("ipc://example.sock");

# Subscribes to all topics
socket.subscribe("")

# Receives a string format message
while True:
    msg1 = socket.recv()
    msg2 = socket.recv()
    msg3 = socket.recv()
    print(msg1, msg2, len(msg3), hex(int.from_bytes(msg3[:4], 'little')), msg3[:4])
