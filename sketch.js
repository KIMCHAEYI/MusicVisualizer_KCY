let song;
let amp;
let fft;
let isPlaying = false;
let smoothLevel = 0;

function preload() {
  song = loadSound('music.mp3');
}

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  amp = new p5.Amplitude();
  fft = new p5.FFT(0.8, 1024);
}

function draw() {
  const level = amp.getLevel();
  smoothLevel = lerp(smoothLevel, level, 0.12);

  const spectrum = fft.analyze();

  drawBackground();
  drawCircularSpectrum(spectrum);
  drawCenterCircle();

  fill(255);
  noStroke();
  textSize(18);
  text("Click to play / pause", width / 2, height - 30);
}

function drawBackground() {
  noFill();
  for (let y = 0; y < height; y++) {
    const t = y / height;
    const r = lerp(5, 15, t);
    const g = lerp(10, 35, t);
    const b = lerp(30, 70, t);
    stroke(r, g, b);
    line(0, y, width, y);
  }
}

function drawCircularSpectrum(spectrum) {
  push();
  translate(width / 2, height / 2);

  const barCount = 96;
  const innerRadius = 130;
  const maxBarLen = 90;
  const angleStep = 360 / barCount;

  for (let i = 0; i < barCount; i++) {
    const a = i * angleStep;

    const idx = floor(map(i, 0, barCount, 0, spectrum.length - 1));
    const energy = spectrum[idx];

    const barLen = map(energy, 0, 255, 10, maxBarLen);

    const r1 = innerRadius;
    const r2 = innerRadius + barLen;

    const x1 = cos(a) * r1;
    const y1 = sin(a) * r1;
    const x2 = cos(a) * r2;
    const y2 = sin(a) * r2;

    stroke(210, 140, 255);
    strokeWeight(4);
    line(x1, y1, x2, y2);
  }

  pop();
}

function drawCenterCircle() {
  const baseRadius = 90;
  const r = baseRadius + smoothLevel * 120;

  noFill();
  stroke(255);
  strokeWeight(3);
  ellipse(width / 2, height / 2, r, r);
}

function mousePressed() {
  if (!song.isLoaded()) return;

  if (!isPlaying) {
    song.loop();
    isPlaying = true;
  } else {
    song.pause();
    isPlaying = false;
  }
}
