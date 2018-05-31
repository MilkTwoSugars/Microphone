var t = 0;
var numLines = 10;
var speed = 1;
var sound;
var amplitude;
var fft;
var min;;
var max;
var res;
var squares = [];


// function preload() {
//     sound = loadSound('song2.wav');
// }

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(50);
    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    res = width / 32;
    colorMode(HSB);
    angleMode(DEGREES);

    matrix = new Array(32);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(32);
    }

    for (var i = 0; i < 1024; i++){
        let x = map(i, 0, 1024, 0, width);
        squares[i] = new Square(x, height / 2, 10);
    }

    mic = new p5.AudioIn();
    mic.amp(1.0);

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.connect();
  mic.start();

  min = 0;
  max = 0;

}

function draw() {
    background(255);
    // if (!sound.isPlaying()) {
    //     sound.play();
    // }

    var vol = mic.getLevel();

    if (vol > max) {
        max = vol;
    }
    if (vol < min) {
        min = vol;
    }

    console.log(vol);
    console.log(min + " " + max);

    drawExampleOne();

    fill(vol * 10000);
    
    ellipse(width /2, height - vol * 1000, vol * 100, vol * 100);

    

}

function drawExampleOne() {
    var a = amplitude.getLevel();

    var spectrum = fft.analyze();

    noStroke();

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            fill(spectrum[i * matrix.length + j], a * 100, 50);
            var s = map(spectrum[i * matrix.length + j], 0, 255, 10, res);
            ellipse(j * res + (res / 2), i * res + (res / 2), s, s);
        }
    }
}

function drawExampleTwo() {
    var a = amplitude.getLevel();
    var s = fft.analyze();

    translate(width /2, height /2);
    for (var i = 0; i < s.length; i++) {
        var angle = map(i, 0, s.length, 0, 360)
        let amp = s[i];
        let r = map(amp, 0, 255, 40, 400);
        let x = r * sin(angle);
        let y = r * cos(angle);
        stroke(s[i], 255, 255)
        line(0,0,x,y)
    }
}

function drawExampleThree () {
    rectMode(CENTER);
    noStroke();

    for (var i = 0; i < squares.length; i++){
        fill(spectrum[i], 255, 255, 50);
        squares[i].height = spectrum[i];
        squares[i].speed = spectrum[i] / 4;
        squares[i].update();
        squares[i].draw();
    }
}

function drawExampleFour () {
    var a = amplitude.getLevel();
    var spectrum = fft.analyze();
    
    rectMode(CENTER);

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            push();
            var s = map(spectrum[i * matrix.length + j], 0, 255, 10, res);
            fill(spectrum[i * matrix.length + j], a * 100, 50);
            let v = createVector(width / 2, height / 2);
            translate(i * res, j * res);
            rotate(radians(Math.pow(spectrum[i * matrix.length + j], 2)));
            rect(0, 0, s, s);
            pop();
        }
    }
}

function drawExampleFive () {
    for (var i = 0; i < spectrum.length; i++){
        stroke(spectrum[i], 255, 255);
        let x = map(i, 0, spectrum.length, width / 2, 0);
        line (x, 0, x, height);
    }

    for (var i = 0; i < spectrum.length; i++){
        stroke(spectrum[i], 255, 255);
        let x = map(i, 0, spectrum.length, width / 2, width);
        line (x, 0, x, height);
    }
}

class Square {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.height = size;
        this.width = size;
        this.speed = 0;
    }

    update(speed) {
        this.x += this.speed;
        this.speed = 0;
        if (this.x > width){
            this.x = 0;
        }
    }

    draw () {
        ellipse(this.x, this.y, this.height, this.height);
    }
}
