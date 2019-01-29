
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

// create websockets server for emiting/listening to events
var io = socketIO(server);

var users = new Users();

// configure express static middleware for serving up public folder
app.use(express.static(publicPath));

// register an event listener for a new connection
io.on('connection', (socket) => {
    console.log('New user connected.');



    socket.on('join', (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required.')
      }

      socket.join(params.room);
      // removes user from previous room
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      // socket.leave(params.room);

      // io.emit -> everyone connected -> io.to(params.room)
      // socket.broadcast.emiting -> everyone but current user -> socket.broadcast.to(params.room)
      // socket.emit -> specifically to one user

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app"));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

      callback();
    });

    socket.on('createMessage', (message, callback) => {
      console.log('Create message', message);
      io.emit('newMessage', generateMessage(message.from, message.text));
      callback();
    });

    socket.on('createLocationMessage', (coords) => {
      io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
      var user = users.removeUser(socket.id);
      if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
      };
      console.log('User disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}.`);
});
