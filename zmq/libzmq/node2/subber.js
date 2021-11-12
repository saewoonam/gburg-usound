// subber.js
const zmq = require('jszmq'); // OR import * as zmq form 'jszmq'
const sock = zmq.socket('sub'); // OR const sock = new zmq.Sub();
global.zmq = zmq;

// sock.connect('ws://127.0.0.1:3000');
// sock.subscribe('kitty cats');
// console.log('Subscriber connected to port 3000');
sock.connect('ws://127.0.0.1:8000');
sock.subscribe('');
console.log('Subscriber connected to port 8000');

// sock.on('message', function(topic, message) {
//   console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
// });
sock.on('message', function(message) {
  console.log('received a message:', message.toString());
});
