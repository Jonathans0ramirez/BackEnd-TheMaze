var socket;

let size = 5;
let canPlay = false;
let ganaste = false;
const red = getcolorAleatorio();
const green = getcolorAleatorio();
const blue = getcolorAleatorio();
let jugador = {
  x: 0,
  y: 0,
  color : {
    R: red,
    G: green,
    B: blue,
  },
  tamano: 5,
  relleno: 1,
  puedeJugar: false,
  youWin: false
}
var jugadores = [];

function setup(){
    createCanvas(398,398);
    background(51);
    socket = io.connect('http://localhost:3000');

    var data = {
      x: jugador.x,
      y: jugador.y,
      tamano: jugador.tamano,
      R: jugador.color.R,
      G: jugador.color.G,
      B: jugador.color.B,
      relleno: jugador.relleno,
      puedeJugar: jugador.puedeJugar,
      youWin: jugador.youWin
    };
    socket.emit('start', data);

    socket.on('heartbeat',
      function(data) {
        jugadores = data;
      }
  );
}

function draw(){
  noCursor();
  if(!ganaste){
  createWorld();
  fill(jugador.color.R,jugador.color.G,jugador.color.B);
  stroke(jugador.relleno);
  jugador['puedeJugar'] = canPlay;
  jugador['x'] = mouseX;
  jugador['y'] = mouseY;
  if(esValido()){
    if(aumentarsize()){
      size = size+0.2;
    }
    if(aumentarsize2()){
      size = size+0.4;
    }
    jugador['tamano'] = size;
    jugador['youWin'] = ganaste;
    ellipse(jugador.x, jugador.y, jugador.tamano*2, jugador.tamano*2);
    gano();

  } else {
    size = 5;
    jugador['x'] = -10;
    jugador['y'] = -10;
    jugador['tamano'] = size;
  }
} else{
  console.log(ganaste)
  createCanvas(398,398);
  background(51);
  size = 5;
  jugador['x'] = -10;
  jugador['y'] = -10;
  jugador['tamano'] = size;
  textFont('Arial',70);
  textAlign(CENTER, BASELINE);
  text('¡Ganaste!', 190, 200);
  noLoop();
}
for(var i = jugadores.length - 1; i >= 0; i--) {
  var id = jugadores[i].id;
  if (id !== socket.id){
    fill(182, 208, 239);
    stroke(1);
    ellipse(jugadores[i].x, jugadores[i].y, jugadores[i].tamano*2, jugadores[i].tamano*2);
  }
}
var data = {
    x: jugador.x,
    y: jugador.y,
    tamano: jugador.tamano,
    R: jugador.color.R,
    G: jugador.color.G,
    B: jugador.color.B,
    relleno: jugador.relleno,
    puedeJugar: jugador.puedeJugar,
    youWin: jugador.youWin
  };
socket.emit('update', data);
}

function getAleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getcolorAleatorio(){
  const UP = 255;
  const DOWN = 0;
  return self.getAleatorioEntre(DOWN, UP);
}

function gano(){
  if(jugador.x>40*8-2 && jugador.x<40*9-2 && jugador.y>40*0-2 && jugador.y<40*1-2){
    ganaste = true;
    jugador['youWin'] = ganaste;
    return ganaste;
  }
}

function estaEnElInicio(){
    if(jugador.x>40*3-2 && jugador.x<40*5-2 && jugador.y>40*9-2 && jugador.y<40*10-2){
      canPlay = true;
      return canPlay;
    } else if(canPlay === true){
      return canPlay;
    }
 canPlay = false;
 return canPlay;
}

function esValido(){
  if(ganaste === false){
  if(estaEnElInicio()){
  if(jugador.x-jugador.tamano>40*3-2 && jugador.x+jugador.tamano<40*5-2 && jugador.y-jugador.tamano>40*8-2 &&jugador.y+jugador.tamano<40*10-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*1-2 && jugador.x+jugador.tamano<40*5-2 && jugador.y-jugador.tamano>40*8-2 && jugador.y+jugador.tamano<40*9-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*1-2 && jugador.x+jugador.tamano<40*2-2 && jugador.y-jugador.tamano>40*5-2 && jugador.y+jugador.tamano<40*9-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*1-2 && jugador.x+jugador.tamano<40*5-2 && jugador.y-jugador.tamano>40*5-2 && jugador.y+jugador.tamano<=40*6-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*3-2 && jugador.x+jugador.tamano<40*5-2 && jugador.y-jugador.tamano>40*5-2 && jugador.y+jugador.tamano<40*7-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*3-2 && jugador.x+jugador.tamano<40*7-2 && jugador.y-jugador.tamano>40*6-2 && jugador.y+jugador.tamano<=40*7-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*6-2 && jugador.x+jugador.tamano<40*7-2 && jugador.y-jugador.tamano>40*6-2 && jugador.y+jugador.tamano<40*9-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*6-2 && jugador.x+jugador.tamano<40*9-2 && jugador.y-jugador.tamano>40*8-2 && jugador.y+jugador.tamano<40*9-2){
    return true;
  }
  if(jugador.x-jugador.tamano>=40*8-2 && jugador.x+jugador.tamano<=40*9-2 && jugador.y-jugador.tamano>=40*4-2 && jugador.y+jugador.tamano<=40*9-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*5-2 && jugador.x+jugador.tamano<=40*9-2 && jugador.y-jugador.tamano>=40*4-2 && jugador.y+jugador.tamano<40*5-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*5-2 && jugador.x+jugador.tamano<40*6-2 && jugador.y-jugador.tamano>40*3-2 && jugador.y+jugador.tamano<40*5-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*1-2 && jugador.x+jugador.tamano<40*6-2 && jugador.y-jugador.tamano>40*3-2 && jugador.y+jugador.tamano<=40*4-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*1-2 && jugador.x+jugador.tamano<40*2-2 && jugador.y-jugador.tamano>40*1-2 && jugador.y+jugador.tamano<=40*4-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*1-2 && jugador.x+jugador.tamano<=40*9-2 && jugador.y-jugador.tamano>=40*1-2 && jugador.y+jugador.tamano<=40*2-2){
    return true;
  }
  if(jugador.x-jugador.tamano>40*8-2 && jugador.x+jugador.tamano<40*9-2 && jugador.y-jugador.tamano>40*0-2 && jugador.y+jugador.tamano<40*2-2){
    return true;
  }

}
  canPlay = false;
  return canPlay;
  }
  canPlay = false;
  return canPlay;
}

function aumentarsize() {
  if(jugador.x>40*5-2 && jugador.x<40*6-2 && jugador.y>40*6-2 && jugador.y<40*7-2){
    return true;
  }
  return false;

}

function aumentarsize2() {
  if (jugador.x>40*1-2 && jugador.x<40*2-2 && jugador.y>40*2-2 && jugador.y<40*3-2){
    return true;
  }
  return false;

}

function createWorld(){
  noStroke();
  fill(0,0,0);
  rect(-2,-2,400,400);
  noStroke();
  fill(0,255,0);
  rect(-2+40*3,-2+40*9,40,40);
  rect(-2+40*4,-2+40*9,40,40);
  fill(255,204,0);
  rect(-2+40*3,-2+40*8,40,40);
  rect(-2+40*4,-2+40*8,40,40);
  rect(-2+40*2,-2+40*8,40,40);
  rect(-2+40*1,-2+40*8,40,40);
  rect(-2+40*1,-2+40*7,40,40);
  rect(-2+40*1,-2+40*6,40,40);
  rect(-2+40*1,-2+40*5,40,40);
  rect(-2+40*2,-2+40*5,40,40);
  rect(-2+40*3,-2+40*5,40,40);
  rect(-2+40*3,-2+40*6,40,40);
  rect(-2+40*4,-2+40*5,40,40);
  rect(-2+40*4,-2+40*6,40,40);
  fill(0,0,255);
  rect(-2+40*5,-2+40*6,40,40); //Cuadrito de aumento de tamaño
  fill(255,204,0)
  rect(-2+40*6,-2+40*6,40,40);
  rect(-2+40*6,-2+40*7,40,40);
  rect(-2+40*6,-2+40*8,40,40);
  rect(-2+40*7,-2+40*8,40,40);
  rect(-2+40*8,-2+40*8,40,40);
  rect(-2+40*8,-2+40*7,40,40);
  rect(-2+40*8,-2+40*6,40,40);
  rect(-2+40*8,-2+40*5,40,40);
  rect(-2+40*8,-2+40*4,40,40);
  rect(-2+40*7,-2+40*4,40,40);
  rect(-2+40*6,-2+40*4,40,40);
  rect(-2+40*5,-2+40*4,40,40);
  rect(-2+40*5,-2+40*3,40,40);
  rect(-2+40*4,-2+40*3,40,40);
  rect(-2+40*3,-2+40*3,40,40);
  rect(-2+40*2,-2+40*3,40,40);
  rect(-2+40*1,-2+40*3,40,40);
  fill(0,0,255);
  rect(-2+40*1,-2+40*2,40,40); //Cuadritos de aumento de tamaño
  fill(255,204,0);
  rect(-2+40*1,-2+40*1,40,40);
  rect(-2+40*2,-2+40*1,40,40);
  rect(-2+40*3,-2+40*1,40,40);
  rect(-2+40*4,-2+40*1,40,40);
  rect(-2+40*5,-2+40*1,40,40);
  rect(-2+40*6,-2+40*1,40,40);
  rect(-2+40*7,-2+40*1,40,40);
  rect(-2+40*8,-2+40*1,40,40);
  fill(255,0,0)
  rect(-2+40*8,-2+40*0,40,40);
}
