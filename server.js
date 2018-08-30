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

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(3000);

console.log('Server started on port 3000');

function handleRequest(req, res) {
  var pathname = req.url;
  if (pathname == '/') {
    pathname = '/index.html';
  }
  var ext = path.extname(pathname);
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };
  var contentType = typeExt[ext] || 'text/plain';
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

var io = require('socket.io').listen(server);
setInterval(heartbeat, 20);
function heartbeat() {
  io.sockets.emit('heartbeat', jugadores);
}

io.sockets.on('connection',
  function (socket) {
    console.log("We have a new client: " + socket.id);
    socket.on('start',
      function(data) {
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
