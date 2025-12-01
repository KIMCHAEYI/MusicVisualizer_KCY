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
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  amp = new p5.Amplitude();
  fft = new p5.FFT(0.8, 1024);
}

function draw() {
  const level = amp.getLevel();
  smoothLevel = lerp(smoothLevel, level, 0.12);

  const spectrum = fft.analyze();

  drawBackground();
  drawCircularSpectrumBehindTree(spectrum);
  drawChristmasTree();

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

function drawCircularSpectrumBehindTree(spectrum) {
  push();
  translate(width / 2, height * 0.35);

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

function drawChristmasTree() {
  const centerX    = width * 0.5;
  const baseY      = height * 0.735;
  const treeHeight = 370;
  const treeWidth  = 410;

  fill(90, 60, 40);
  rect(centerX, baseY + 65, 50, 85, 10);

  const layers = 3;
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    const h = treeHeight * 0.45;
    const w = lerp(treeWidth * 0.5, treeWidth, t);

    const yTop = baseY - treeHeight * 0.7 + i * 85;
    const yBottom = yTop + h;

    noStroke();
    fill(10, 90 + i * 20, 40 + i * 10);
    triangle(
      centerX, yTop,
      centerX - w / 2, yBottom,
      centerX + w / 2, yBottom
    );
  }

  noStroke();
  fill(245);
  rect(centerX, height - 10, width + 40, 80);
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
