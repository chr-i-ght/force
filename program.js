/*
** 2023 February 15
** The author disclaims copyright to this source code.
*/

const OptionOfXAndOrY = 
  Object.freeze({
    NONE:  0,
    X:     1,
    Y:     2
  });

class Bounds {
  static notOut(a) { return a === OptionOfXAndOrY.NONE; }
  static outX(a) { return a & OptionOfXAndOrY.X; }
  static outY(a) { return a & OptionOfXAndOrY.Y; }
  static outXY(a) { return a & OptionOfXAndOrY.X && a & OptionOfXAndOrY.Y; }
}

class Force {
  constructor(domain, momentum) {
    this.domain = domain;
    this.momentum = momentum;
  }

  reconstruct() { 
    throw new TypeError("needs definition.");
  }
  
  advance() {
    this.domain.add(this.momentum);
  }

  changeDir(dir) {
    this.momentum.mult(dir);  
  }
  
  outOfBounds() {
    let x = false;
    let y = false;

    if (this.domain.x > width || this.domain.x < 0) {
      x = true;
    }
    
    if (this.domain.y > height || this.domain.y < 0) {
      y = true;
    }
    
    if (x && y)  {
      return OptionOfXAndOrY.X | OptionOfXAndOrY.Y;
    }
    else if (x && !y) {
      return OptionOfXAndOrY.X;
    }
    else if (y && !x) {
      return OptionOfXAndOrY.Y;
    } /*else {*/
      
    return OptionOfXAndOrY.NONE;
    
    /*}*/
  }
}

let DIR_CHANGES; 

class TwoDBouncyBall extends Force {

  constructor(domain, momentum, diameter) {
    super(domain, momentum);
    this.diameter = diameter;
  }

  reconstruct() {
    const mymy = this;
    mymy.advance();
    let xyOrNone = mymy.outOfBounds();

    if (Bounds.outXY(xyOrNone)) {
        console.log("XY");
        mymy.changeDir(
          DIR_CHANGES[OptionOfXAndOrY.X | OptionOfXAndOrY.Y]
        );  
    } else if (Bounds.outY(xyOrNone)) {
      mymy.changeDir(
          DIR_CHANGES[OptionOfXAndOrY.Y]
      );
    } else if (Bounds.outX(xyOrNone)) {
      mymy.changeDir(
          DIR_CHANGES[OptionOfXAndOrY.X]
      );
    }
    
    /*torus(mymy.domain.x, mymy.domain.y, mymy.domain.diameter);*/
    circle(
      mymy.domain.x,
      mymy.domain.y,
      mymy.diameter
    );
  }

}


function cV(x, y, z) {
  return createVector(x, y, z);
}

function constructSpeedyBouncyBall(domain) {
  const momentum =
    cV(
      PHI * 13, /*unlucky*/
      PHI * 9 /*lives*/
    );
  
  return new TwoDBouncyBall(
      domain,
      momentum,
      2.3 * 100
  );
}

const AMOUNT = 2;
const PHI = 1.618;
let bouncyBalls = [];


function setup() {
  DIR_CHANGES = 
    Object.freeze({
      [OptionOfXAndOrY.X]: cV(-1, 1),
      [OptionOfXAndOrY.Y]: cV(1, -1),
      [OptionOfXAndOrY.X | OptionOfXAndOrY.Y]: cV(-1, -1)
    });
    
  createCanvas(666 * PHI, 666, WEBGL);
  normalMaterial();
  debugMode();
  stroke(155, 38, 182);
  /*fill(155, 38, 182);*/

  for (let i = 0; i < AMOUNT; i++) {
    bouncyBalls.push(
      constructSpeedyBouncyBall(
        cV(i*100 * PHI, i*100 * PHI)
      )
    );
  }
}

function draw() {
  translate(-width/2,-height/2,0);
  orbitControl();
  background(0);
  for (let i = 0; i < AMOUNT; i++) {
    let bouncyBall = bouncyBalls[i]; 
    bouncyBall.reconstruct();
  }
}