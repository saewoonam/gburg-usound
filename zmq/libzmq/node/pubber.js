// pubber.js
const zmq = require('jszmq'); // OR import * as zmq form 'jszmq'
const sock = zmq.socket('pub'); // OR const sock = new zmq.Pub(); 

sock.bind('tcp://127.0.0.1:3000');
console.log('Publisher bound to port 3000');

setInterval(function() {
  console.log('sending a multipart message envelope');
  sock.send(['kitty cats', 'meow!']);
}, 500);
