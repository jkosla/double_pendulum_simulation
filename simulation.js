let sliders = [];
const dt = 0.001; // krok całkowania
const STEPS_PER_FRAME = 100; // liczba kroków całkowania na klatkę

let g = 9.81
let m1 = 10;
let m2 = 50;

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
  

let pendulum1 = new Pendulum(250, 50, 5*Math.PI/4, 0, m1, 200)
let pendulum2 = new Pendulum(pendulum1.x2, pendulum1.y2, -Math.PI/4, 0, m2, 200)

let pendulum = new DoublePendulum(
    pendulum1,
    pendulum2
)

function setup() {
  createCanvas(500, 500);
  console.log(JSON.stringify(pendulum, null, 2))
  console.log(pendulum)

  let slider1 = createSlider(0.2, 20.2, 0);
  slider1.position(10, 10); 
  slider1.size(80);

  let slider2 = createSlider(0.2, 20.2, 0);
  slider2.position(10, 30);
  slider2.size(80);  
  
  let slider3 = createSlider(0.1, 10.1, 0);
  slider3.position(10, 50);
  slider3.size(80);

  let slider4 = createSlider(0.1, 10.1, 0);
  slider4.position(10, 70)
  slider4.size(80);



  
}


function forces()
{
  
}


// function mouseDragged(){
//   particles[N-1].x = mouseY - height / 2;
// }


function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);
  circle(pendulum.top.x2, pendulum.top.y2, 20);
  circle(pendulum.bottom.x2, pendulum.bottom.y2, 20);
  line(pendulum.top.x1, pendulum.top.y1, pendulum.top.x2, pendulum.top.y2);
  line(pendulum.bottom.x1, pendulum.bottom.y1, pendulum.bottom.x2, pendulum.bottom.y2);


  for (let step=0; step<STEPS_PER_FRAME; ++step){

    pendulum.update();

    
    

  }
 

}