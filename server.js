'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Path = require('path');

server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

const commands = [];
const io = require('socket.io')(server.listener);

io.on('connection', function (socket) {

  socket.emit('commands', commands);

});

server.register(require('inert'), function () {});

server.route({
    method:'POST',
    path: '/webhook',
    handler: function(request, reply){
      const payload = request.payload;
      const slashCommand = payload.command.substr('1');

      commands.push(slashCommand);
      io.sockets.emit(slashCommand);
      //io.sockets.emit('commands', commands);

      reply();
    }
  });


server.start(() => {
  console.log('Server running at:', server.info.uri);
});
