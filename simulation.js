let slider1, slider2, slider3, slider4, slider5, slider6, slider7, slider8;
const dt = 0.001; // krok całkowania
const STEPS_PER_FRAME = 100; // liczba kroków całkowania na klatkę
let isRunning = false
let button;
let g = 9.81
let m1 = 10;
let m2 = 50;
let l1 = 200;
let l2 = 200;
let m1_2 = 10;
let m2_2 = 50;
let l1_2 = 200;
let l2_2 = 200;

let theta1 = 0;
let theta2 = 0;

const eps = 1e-6

class DoublePendulum {
  constructor(top, bottom) {
    this.top = top
    this.bottom = bottom
  }

  update() {
    let k11_theta = this.top.omega * dt
    let k11_omega = this.calcDomega1(
      this.top.theta,
      this.bottom.theta,
      this.top.omega,
      this.bottom.omega,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k21_theta = this.bottom.omega * dt
    let k21_omega = this.calcDomega2(
      this.top.theta,
      this.bottom.theta,
      this.top.omega,
      this.bottom.omega,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k12_theta = (this.top.omega + k11_omega / 2) * dt
    let k12_omega = this.calcDomega1(
      this.top.theta + k11_theta / 2,
      this.bottom.theta + k21_theta / 2,
      this.top.omega + k11_omega / 2,
      this.bottom.omega + k21_omega / 2,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k22_theta = (this.bottom.omega + k21_omega / 2) * dt
    let k22_omega = this.calcDomega2(
      this.top.theta + k11_theta / 2,
      this.bottom.theta + k21_theta / 2,
      this.top.omega + k11_omega / 2,
      this.bottom.omega + k21_omega / 2,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k13_theta = (this.top.omega + k12_omega / 2) * dt
    let k13_omega = this.calcDomega1(
      this.top.theta + k12_theta / 2,
      this.bottom.theta + k22_theta / 2,
      this.top.omega + k12_omega / 2,
      this.bottom.omega + k22_omega / 2,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k23_theta = (this.bottom.omega + k22_omega / 2) * dt
    let k23_omega = this.calcDomega2(
      this.top.theta + k12_theta / 2,
      this.bottom.theta + k22_theta / 2,
      this.top.omega + k12_omega / 2,
      this.bottom.omega + k22_omega / 2,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k14_theta = (this.top.omega + k13_omega) * dt
    let k14_omega = this.calcDomega1(
      this.top.theta + k13_theta,
      this.bottom.theta + k23_theta,
      this.top.omega + k13_omega,
      this.bottom.omega + k23_omega,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    let k24_theta = (this.bottom.omega + k23_omega) * dt
    let k24_omega = this.calcDomega2(
      this.top.theta + k13_theta,
      this.bottom.theta + k23_theta,
      this.top.omega + k13_omega,
      this.bottom.omega + k23_omega,
      this.top.m,
      this.bottom.m,
      this.top.length,
      this.bottom.length
    ) * dt

    this.top.theta += (k11_theta + 2 * k12_theta + 2 * k13_theta + k14_theta) / 6
    this.top.omega += (k11_omega + 2 * k12_omega + 2 * k13_omega + k14_omega) / 6

    this.bottom.theta += (k21_theta + 2 * k22_theta + 2 * k23_theta + k24_theta) / 6
    this.bottom.omega += (k21_omega + 2 * k22_omega + 2 * k23_omega + k24_omega) / 6


    this.top.x2 = this.top.x1 + this.top.length * Math.sin(this.top.theta)
    this.top.y2 = this.top.y1 + this.top.length * Math.cos(this.top.theta)

    this.bottom.x1 = this.top.x2
    this.bottom.y1 = this.top.y2
    this.bottom.x2 = this.bottom.x1 + this.bottom.length * Math.sin(this.bottom.theta)
    this.bottom.y2 = this.bottom.y1 + this.bottom.length * Math.cos(this.bottom.theta)
  }

  calcDomega1(theta1, theta2, omega, omega2, m1, m2, length1, length2) {
    return (-g*(2*m1 + m2)*Math.sin(theta1) - m2 * g * Math.sin(theta1 - 2*theta2)- 2 * Math.sin(theta1 - theta2) * m2 * (omega2*omega2*length2 + omega*omega*length1*Math.cos(theta1 - theta2))) / (length1 * (2*m1 + m2 - m2*Math.cos(2*(theta1 - theta2))));
  }

  calcDomega2(theta1, theta2, omega, omega2, m1, m2, length1, length2) {
    return (2 * Math.sin(theta1 - theta2) * (omega*omega*length1*(m1 + m2) + g*(m1 + m2)*Math.cos(theta1) + omega2*omega2*length2*m2*Math.cos(theta1 - theta2))) / (length2 * (2*m1 + m2 - m2*Math.cos(2*(theta1 - theta2))));
  }
}

class Pendulum {
constructor(x1, y1, theta, omega, mass, length) {
  this.x1 = x1;
  this.x2 = x1 + length * Math.sin(theta)
  this.y1 = y1
  this.y2 = y1 + length * Math.cos(theta)
  this.theta = theta
  this.omega = omega;
  this.m = mass;
  this.length = length;
}
}


let pendulumTop1 = new Pendulum(600, 100, 5*Math.PI/4, 0, m1, l1)
let pendulumBottom1 = new Pendulum(pendulumTop1.x2, pendulumTop1.y2, -Math.PI/4, 0, m2, l2)

let pendulum1 = new DoublePendulum(
    pendulumTop1,
    pendulumBottom1
)

let pendulumTop2 = new Pendulum(600, 100, 5*Math.PI/4, 0, m1_2, l1_2)
let pendulumBottom2 = new Pendulum(pendulumTop2.x2, pendulumTop2.y2, -Math.PI/4, 0, m2_2, l2_2)

let pendulum2 = new DoublePendulum(
    pendulumTop2,
    pendulumBottom2
)

function changeRunning() {
  isRunning = !isRunning;
}

function setup() {
  createCanvas(1200, 700);
  button = createButton('Pause/Resume');
  button.position(20, 300);
  button.mousePressed(changeRunning);

  slider1 = createSlider(1, 100, m1, 0.1);
  slider1.position(20, 20);
  slider1.size(150);

  slider2 = createSlider(1, 100, m2, 0.1);
  slider2.position(20, 50);
  slider2.size(150);

  slider3 = createSlider(50, 300, l1, 1);
  slider3.position(20, 80);
  slider3.size(150);

  slider4 = createSlider(50, 300, l2, 1);
  slider4.position(20, 110)
  slider4.size(150);

  slider5 = createSlider(1, 100, m1_2, 0.1);
  slider5.position(20, 160);
  slider5.size(150);

  slider6 = createSlider(1, 100, m2_2, 0.1);
  slider6.position(20, 190);
  slider6.size(150);

  slider7 = createSlider(50, 300, l1_2, 1);
  slider7.position(20, 220);
  slider7.size(150);

  slider8 = createSlider(50, 300, l2_2, 1);
  slider8.position(20, 250)
  slider8.size(150);
}

function draw() {
  background(245, 245, 250);

  m1 = slider1.value();
  m2 = slider2.value();
  l1 = slider3.value();
  l2 = slider4.value();

  pendulum1.top.m = m1;
  pendulum1.bottom.m = m2;
  pendulum1.top.length = l1;
  pendulum1.bottom.length = l2;

  m1_2 = slider5.value();
  m2_2 = slider6.value();
  l1_2 = slider7.value();
  l2_2 = slider8.value();

  pendulum2.top.m = m1_2;
  pendulum2.bottom.m = m2_2;
  pendulum2.top.length = l1_2;
  pendulum2.bottom.length = l2_2;


  textSize(14);
  textAlign(LEFT);

  stroke(220, 80, 80);
  strokeWeight(1);
  fill(220, 80, 80);
  text('m1_1: ' + m1.toFixed(1) + ' kg', 185, 30);

  stroke(80, 140, 220);
  fill(80, 140, 220);
  text('m2_1: ' + m2.toFixed(1) + ' kg', 185, 60);

  stroke(50);
  fill(50);
  text('L1_1: ' + l1.toFixed(0), 185, 90);
  text('L2_1: ' + l2.toFixed(0), 185, 120);

  stroke(80, 200, 80);
  strokeWeight(1);
  fill(80, 200, 80);
  text('m1_2: ' + m1_2.toFixed(1) + ' kg', 185, 170);

  stroke(200, 180, 80);
  fill(200, 180, 80);
  text('m2_2: ' + m2_2.toFixed(1) + ' kg', 185, 200);

  stroke(50);
  fill(50);
  text('L1_2: ' + l1_2.toFixed(0), 185, 230);
  text('L2_2: ' + l2_2.toFixed(0), 185, 260);

  fill(80);
  noStroke();
  circle(pendulum1.top.x1, pendulum1.top.y1, 12);

  stroke(60);
  strokeWeight(3);
  line(pendulum1.top.x1, pendulum1.top.y1, pendulum1.top.x2, pendulum1.top.y2);
  line(pendulum1.bottom.x1, pendulum1.bottom.y1, pendulum1.bottom.x2, pendulum1.bottom.y2);

  strokeWeight(2);
  stroke(180, 50, 50);
  fill(220, 80, 80);
  circle(pendulum1.top.x2, pendulum1.top.y2, 30);

  stroke(50, 100, 200);
  fill(80, 140, 220);
  circle(pendulum1.bottom.x2, pendulum1.bottom.y2, 30);

  fill(80);
  noStroke();
  circle(pendulum2.top.x1, pendulum2.top.y1, 12);

  stroke(60);
  strokeWeight(3);
  line(pendulum2.top.x1, pendulum2.top.y1, pendulum2.top.x2, pendulum2.top.y2);
  line(pendulum2.bottom.x1, pendulum2.bottom.y1, pendulum2.bottom.x2, pendulum2.bottom.y2);

  strokeWeight(2);
  stroke(50, 180, 50);
  fill(80, 200, 80);
  circle(pendulum2.top.x2, pendulum2.top.y2, 30);

  stroke(180, 160, 50);
  fill(200, 180, 80);
  circle(pendulum2.bottom.x2, pendulum2.bottom.y2, 30);

  if (!isRunning) return;

  for (let step=0; step<STEPS_PER_FRAME; ++step){
    pendulum1.update();
    pendulum2.update();

    if (!isFinite(pendulum1.top.theta) || !isFinite(pendulum1.bottom.theta) ||
        !isFinite(pendulum1.top.omega) || !isFinite(pendulum1.bottom.omega) ||
        Math.abs(pendulum1.top.omega) > 1000 || Math.abs(pendulum1.bottom.omega) > 1000) {

      noStroke();
      fill(220, 50, 50);
      textSize(20);
      textAlign(CENTER);
      text('SIMULATION UNSTABLE!', width/2, height/2);
      textAlign(LEFT);
      break;
    }

    if (!isFinite(pendulum2.top.theta) || !isFinite(pendulum2.bottom.theta) ||
        !isFinite(pendulum2.top.omega) || !isFinite(pendulum2.bottom.omega) ||
        Math.abs(pendulum2.top.omega) > 1000 || Math.abs(pendulum2.bottom.omega) > 1000) {

      noStroke();
      fill(220, 50, 50);
      textSize(20);
      textAlign(CENTER);
      text('SIMULATION UNSTABLE!', width/2, height/2);
      textAlign(LEFT);
      break;
    }
  }
}
