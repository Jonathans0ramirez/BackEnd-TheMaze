// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
var jugadores = [];

function Jugador(id, x, y, R, G, B, tamano, relleno, puedeJugar, youWin){
  this.id = id;
  this.x = x;
  this.y = y;
  this.R = R;
  this.G = G;
  this.B = B;
  this.tamano = tamano;
  this.relleno = relleno;
  this.puedeJugar = puedeJugar;
  this.youWin = youWin;
}

// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');

// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(3000);

console.log('Server started on port 3000');

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

setInterval(heartbeat, 20);
function heartbeat() {
  io.sockets.emit('heartbeat', jugadores);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('start',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.tamano + " "+ data.R);
        var jugador = new Jugador(socket.id, data.x, data.y, data.R, data.G, data.B, data.tamano, data.relleno, data.puedeJugar, data.youWin);
        jugadores.push(jugador);

        // Send it to all other clients
        //socket.broadcast.emit('mouse', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

    socket.on('update',
      function(data) {
        // Data comes in as whatever was sent, including objects
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.tamano + " " + data.R);
        var jugador = {};
        for(var i = 0; i < jugadores.length; i++){
          if(socket.id == jugadores[i].id) {
            jugador = jugadores[i];
          }
        }

        jugador.x = data.x;
        jugador.y = data.y;
        jugador.tamano = data.tamano;
        jugador.R = data.R;
        jugador.G = data.G;
        jugador.B = data.B;
        jugador.relleno = data.relleno;
        jugador.puedeJugar = data.puedeJugar;
        jugador.youWin = data.youWin;
        }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
