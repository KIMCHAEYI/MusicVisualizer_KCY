let song;
let amp;        // amplitude analyzer
let fft;        // frequency analyzer
let isPlaying = false;
let smoothLevel = 0;

let snowflakes = [];
let stars = [];
let snowstorm = true;

let palettePos = 2.0;
let targetPalettePos = 2.0;

const palettes = [
  [
    { r: 230, g: 80,  b: 90 },
    { r: 250, g: 180, b: 80 },
    { r: 80,  g: 190, b: 110 },
    { r: 200, g: 40,  b: 70 },
    { r: 250, g: 230, b: 130 },
    { r: 130, g: 220, b: 150 }
  ],
  [
    { r: 255, g: 170, b: 190 },
    { r: 190, g: 200, b: 255 },
    { r: 200, g: 255, b: 200 },
    { r: 255, g: 210, b: 160 },
    { r: 210, g: 190, b: 255 },
    { r: 255, g: 240, b: 200 }
  ],
  [
    { r: 170, g: 210, b: 255 },
    { r: 230, g: 240, b: 255 },
    { r: 180, g: 220, b: 255 },
    { r: 220, g: 230, b: 255 },
    { r: 200, g: 220, b: 255 },
    { r: 240, g: 245, b: 255 }
  ]
];

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

  for (let i = 0; i < 180; i++) {
    snowflakes.push(makeSnowflake());
  }

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.55),
      size: random(1, 2.5),
      twinkleSpeed: random(0.4, 1.5),
      phase: random(360)
    });
  }
}

function draw() {
  const level = amp.getLevel();
  smoothLevel = lerp(smoothLevel, level, 0.12);

  const spectrum = fft.analyze();

  updateTargetPalette(smoothLevel);
  palettePos = lerp(palettePos, targetPalettePos, 0.03);

  drawGradientBackground();
  drawStars(spectrum);
  drawCircularSpectrumBehindTree(spectrum);
  drawChristmasTree(smoothLevel, spectrum);
  drawSnow();
  drawUI();
}

/* palette */

function updateTargetPalette(level) {
  if (level < 0.10) {
    targetPalettePos = 2.0;
  } else if (level < 0.22) {
    targetPalettePos = 1.0;
  } else {
    targetPalettePos = 0.0;
  }
}

function getPaletteColor(index) {
  const i = index % 6;

  let base = floor(palettePos);
  let next = ceil(palettePos);
  base = constrain(base, 0, 2);
  next = constrain(next, 0, 2);
  const t = palettePos - base;

  const c1 = palettes[base][i];
  const c2 = palettes[next][i];

  const r = lerp(c1.r, c2.r, t);
  const g = lerp(c1.g, c2.g, t);
  const b = lerp(c1.b, c2.b, t);

  return { r, g, b };
}

/* background & stars */

function drawGradientBackground() {
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

function drawStars(spectrum) {
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];

    const idx = floor(map(i, 0, stars.length - 1, 0, spectrum.length - 1));
    const energy = spectrum[idx];

    const twinkle = sin(frameCount * s.twinkleSpeed + s.phase) * 0.5 + 0.5;
    const baseAlpha = map(energy, 0, 255, 30, 100);
    const alpha = baseAlpha * (0.5 + twinkle * 0.5);

    fill(255, 255, 220, alpha);
    ellipse(s.x, s.y, s.size + twinkle * 1.5);
  }
}

/* circular FFT ring */

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

    const col = getPaletteColor(i);

    stroke(col.r, col.g, col.b, 210);
    strokeWeight(4);
    line(x1, y1, x2, y2);
  }

  pop();
}

/* tree & decorations */

function drawChristmasTree(level, spectrum) {
  const centerX    = width * 0.5;
  const baseY      = height * 0.735;
  const treeHeight = 350;
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

  drawGarlands(centerX, baseY, treeHeight, treeWidth, level, spectrum);
  drawOrnaments(centerX, baseY, treeHeight, treeWidth, level, spectrum);
  drawStarTop(centerX, baseY - treeHeight * 0.75, level, spectrum);

  noStroke();
  fill(245);
  rect(centerX, height - 10, width + 40, 80);
}

function drawGarlands(cx, baseY, treeH, treeW, level, spectrum) {
  treeH = 380;
  treeW = 300;

  const garlandRows = 3;
  for (let r = 0; r < garlandRows; r++) {
    const y = baseY - treeH * 0.38 + r * 70;
    const widthFactor = lerp(0.38, 0.88, r / (garlandRows - 1));
    const halfWidth = (treeW * widthFactor) / 2;

    noFill();
    stroke(200, 200, 200, 120);
    strokeWeight(2);

    beginShape();
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const x = cx - halfWidth + t * (2 * halfWidth);
      const curve = sin(t * 180) * 15;
      const yOffset = curve + sin(frameCount * 1.0 + r * 40 + t * 360) * level * 20;
      vertex(x, y + yOffset);
    }
    endShape();

    const bulbCount = 7;
    for (let i = 0; i < bulbCount; i++) {
      const t = i / (bulbCount - 1);
      const x = cx - halfWidth + t * (2 * halfWidth);
      const curve = sin(t * 180) * 15;
      const yOffset = curve + sin(frameCount * 1.0 + r * 40 + t * 360) * level * 20;
      const by = y + yOffset;

      const idx = floor(map(i + r * 3, 0, bulbCount + garlandRows * 3, 0, spectrum.length - 1));
      const energy = spectrum[idx];

      const glowSize = 7 + level * 30 + map(energy, 0, 255, 0, 18);
      const alpha = 130 + level * 90;

      const col = getPaletteColor(i + r * 7);

      noStroke();
      fill(col.r, col.g, col.b, alpha * 0.3);
      ellipse(x, by, glowSize * 1.7);
      fill(col.r, col.g, col.b, alpha);
      ellipse(x, by, glowSize * 0.6);
    }
  }
}

function drawOrnaments(cx, baseY, treeH, treeW, level, spectrum) {
  treeH = 380;
  treeW = 300;

  const ringCount = 3;
  const ringOrnamentCounts = [4, 5, 6];

  for (let ring = 0; ring < ringCount; ring++) {
    const ornamentsInRing = ringOrnamentCounts[ring];
    const y = baseY - treeH * 0.28 + ring * 75;
    const widthFactor = lerp(0.35, 0.85, ring / (ringCount - 1));
    const halfWidth = (treeW * widthFactor) / 2;

    for (let i = 0; i < ornamentsInRing; i++) {
      const t = ornamentsInRing <= 1 ? 0.5 : i / (ornamentsInRing - 1);
      const xBase = cx - halfWidth + t * (2 * halfWidth);

      const swing = sin(frameCount * (0.8 + ring * 0.1) + i * 25) * level * 15;

      const x = xBase + swing;
      const yTop = y - 12;
      const yBall = y + 8;

      stroke(220);
      strokeWeight(1);
      line(x, yTop - 18, x, yBall - 12);

      const idx = floor(map(ring * 10 + i, 0, ringCount * 10 + ornamentsInRing, 0, spectrum.length - 1));
      const energy = spectrum[idx];

      const size = 14 + level * 45 + map(energy, 0, 255, 0, 6);
      const col = getPaletteColor(i + ring * 10);

      noStroke();
      fill(col.r, col.g, col.b, 35 + level * 130);
      ellipse(x, yBall, size * 1.7);

      fill(col.r, col.g, col.b, 230);
      ellipse(x, yBall, size);

      fill(255, 255, 255, 170);
      ellipse(x - size * 0.22, yBall - size * 0.22, size * 0.35, size * 0.35);
    }
  }
}

function drawStarTop(x, y, level, spectrum) {
  const idx = 10;
  const energy = spectrum[idx];
  const size = 22 + level * 55 + map(energy, 0, 255, 0, 15);

  push();
  translate(x, y);
  rotate(frameCount * 0.7);

  blendMode(ADD);

  noStroke();
  fill(255, 230, 150, 80);
  ellipse(0, 0, size * 1.6);

  fill(255, 250, 220, 210);
  drawStarShape(0, 0, size);

  stroke(255, 240, 200, 140);
  strokeWeight(1.3);
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    const len = size * 1.0;
    line(
      cos(a) * (size * 0.32),
      sin(a) * (size * 0.32),
      cos(a) * len,
      sin(a) * len
    );
  }

  blendMode(BLEND);
  pop();
}

function drawStarShape(x, y, size) {
  beginShape();
  for (let i = 0; i < 10; i++) {
    const angle = 36 * i;
    const r = (i % 2 === 0) ? size : size * 0.4;
    const sx = x + cos(angle) * r;
    const sy = y + sin(angle) * r;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

/* snow */

function makeSnowflake() {
  return {
    x: random(width),
    y: random(-height, height),
    r: random(2, 5),
    speed: random(0.5, 1.4),
    driftOffset: random(360)
  };
}

function drawSnow() {
  for (let i = 0; i < snowflakes.length; i++) {
    const s = snowflakes[i];

    const fallBoost = snowstorm ? 2.2 : 1.0;

    s.y += s.speed * fallBoost;
    s.x += sin(frameCount * 0.5 + s.driftOffset) * 0.2;

    if (s.y > height + s.r) {
      s.y = random(-height, 0);
      s.x = random(width);
    }

    noStroke();
    fill(255, 255, 255, 160);
    ellipse(s.x, s.y, s.r);
  }

  const frontCount = snowstorm ? 40 : 20;
  const baseSpeed  = snowstorm ? 3 : 1.8;

  for (let i = 0; i < frontCount; i++) {
    const x = (i * 45 + frameCount * baseSpeed) % (width + 100) - 50;
    const y = (height + 80 - (frameCount * (snowstorm ? 2.5 : 1.5) + i * 15)) % (height + 80) - 40;

    const size = 6 + sin(frameCount * 2 + i * 20) * 2;

    noStroke();
    fill(255, 255, 255, 180);
    ellipse(x, y, size);
  }
}

/* UI & interaction */

function drawUI() {
  noStroke();
  fill(255, 230);
  rect(width / 2, height - 25, width, 50);

  fill(20);
  textSize(14);
  text("화면을 클릭 시, 음악이 재생됩니다.\n음악 재생을 멈추고 싶다면, 다시 한번 화면을 클릭해 주세요.", width / 2, height - 25);
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

function keyPressed() {
  if (key === 'S' || key === 's') {
    snowstorm = !snowstorm;
  }
}
