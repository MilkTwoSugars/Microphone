var amplitude;
var fft;
var mic;

var rectangles = [];

var bands = 128;

var micAmp = 1;


function setup() {
    createCanvas(windowWidth, windowHeight);
    //background(255);
    colorMode(HSB);
    //blendMode(LIGHTEST)
    initialiseSound();

    for (var i = 0; i < bands; i++) {

        let position = createVector(random(width), random(height));

        let direction = createVector(random(-1, 1), random(-1, 1));

        let r = new Rectangle(position, 0, direction, random(50));

        rectangles.push(r);
    }



}

function draw() {
    background(255, 255, 10);

    mic.amp(micAmp);

    let a = mic.getLevel();

    let spectrum = fft.analyze();

    for (var i = 0; i < bands; i++) {
        rectangles[i].update(spectrum[i]);
        rectangles[i].render(spectrum[i]);
    }

}

function mousePressed () {
    micAmp = map(mouseX, 0, width, 0, 5);
}

class Rectangle {
    constructor(position, size, direction, startAngle) {
        this.pos = position;
        this.size = size;
        this.dir = direction;
        this.speed = 1;
        this.angle = startAngle;
    }

    update(a) {
        let m = map(a, 0, 255, -0.1, 0.1);
        this.angle += m;

        this.pos.add(this.dir);

        this.size = map(a, 0, 255, 0, 150);

        if (this.pos.x > width + this.size) { this.pos.x = 0 - this.size };
        if (this.pos.x < 0 - this.size) { this.pos.x = width + this.size };
        if (this.pos.y > height + this.size) { this.pos.y = 0 - this.size };
        if (this.pos.y < 0 - this.size) { this.pos.y = height + this.size };

    }

    render(a) {
            let b = a * (a / 75);
            push();
            noFill();
            fill(255 - b, 255, a);
            stroke(255 - b, 255, a);
            strokeWeight(2);
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);
            rectMode(CENTER);
            ellipse(0, 0, this.size, this.size);
            line(0, 0, this.size, this.size);
            ellipse(this.size, this.size, this.size / 2);

            push();
            translate(this.size, this.size);
            rotate(this.angle * 2);
            line(0, 0, this.size / 2, this.size / 2);
            ellipse(this.size / 2, this.size / 2, this.size / 4);
            pop();

            pop();
    }
}


function initialiseSound() {
    amplitude = new p5.Amplitude();
    fft = new p5.FFT(0.9, bands);
    mic = new p5.AudioIn();
    mic.amp(micAmp);
    mic.connect();
    mic.start();
}