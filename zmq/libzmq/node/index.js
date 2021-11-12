// subber.js
const zmq = require('jszmq'); // OR import * as zmq form 'jszmq'
const sock = zmq.socket('sub'); // OR const sock = new zmq.Sub();

sock.connect('tcp://127.0.0.1:8000');
sock.subscribe('');
console.log('Subscriber connected to port 8000');

sock.on('message', function(topic, message) {
  console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
});
