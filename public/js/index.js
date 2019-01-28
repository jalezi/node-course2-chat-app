// request from client to server to open a websocket and keep connection open
var socket = io();

// listen on event connect
socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'Jaka',
    text: 'Hey, that is from me'
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
})
