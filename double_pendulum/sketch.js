
let dz; // odstęp między cząsteczkami
const diameter = 50;  // średnica cząsteczki
let circles = [];
let lines = [];
const N = 2; // liczba cząsteczek
const dt = 0.01; // krok całkowania
const STEPS_PER_FRAME = 100; // liczba kroków całkowania na klatkę
const k = 0.05; // wsp. sprężystości
const alpha = 0.01; // tłumienie
let omega = 6.28; // częstość własna
let length = 200;

let phi1 = 0;
let phi2 = 0;

class Circle {
  constructor(x = 50, y = 50) {
    this.x = x;
    this.y = y;
  }

  update(){
    // this.v += this.a * dt
    // this.x += this.v * dt
    this.x = lines[0].x2
    this.y = lines[0].y2
  }

}

class Line {
  constructor(x1 = 50, y1 = 50, x2 = 150, y2 = 50) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  update(){
    this.x2 = this.x1 + length * sin(radians(slider.value()))
    this.y2 = this.y1 + length * cos(radians(slider.value()))
  }
}

function setup() {
  createCanvas(500, 500);
  lines.push(new Line(width/2, 0, width/2, length-diameter/2));
  circles.push(new Circle(width/2, length));
  lines.push(new Line(width/2, length+diameter/2, width/2, 2*length-diameter/2));
  circles.push(new Circle(width/2, 2*length));
  slider = createSlider(-180, 180, 0);
  slider.position(10, 10);
  slider.size(80);
}


function forces()
{
 
}


function mouseDragged(){
  particles[N-1].x = mouseY - height / 2;
}


function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  // circle(50, 50, diameter);
  // circle(150, 50, diameter);
  // line(width/2, 0, x1, length);
  // particles[N-1].x = 50 * sin(omega*frameCount / 60 * 0.95) + 25*sin(omega*frameCount / 60 * 0.95 * 2);

  for (let step=0; step<STEPS_PER_FRAME; ++step){
   
    lines[0].update();
    circles[0].update();
    
    

  }
 

  for (let i = 0; i < N; ++i) {
    circle(circles[i].x, circles[i].y, diameter);
    line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
  }
}

// masa = 1
// -kv