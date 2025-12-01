// 🌆 Style 4: City Skyline Visualizer
let song4;
let fft4;
let amp4;
let isPlaying4 = false;
let colorModeIndex4 = 0;

function preload() {
  song4 = loadSound("music.mp3");
}

function setup() {
  createCanvas(800, 600);
  fft4 = new p5.FFT(0.8, 64);
  amp4 = new p5.Amplitude();
  amp4.setInput(song4);
}

function draw() {
  background(5, 10, 25);

  let level = amp4.getLevel();
  let spectrum = fft4.analyze();

  // 하늘 그라데이션
  noStroke();
  for (let y = 0; y < height; y += 3) {
    let t = y / height;
    fill(10, 15 + t * 40, 60 + t * 120);
    rect(0, y, width, 3);
  }

  // 달 (ellipse)
  let moonSize = 60 + level * 80;
  fill(250, 245, 230, 220);
  ellipse(width * 0.8, height * 0.2, moonSize);

  // 달 주변 halo
  fill(250, 245, 230, 40);
  ellipse(width * 0.8, height * 0.2, moonSize * 2);

  // 빌딩 (rect) + 안테나(line)
  let barWidth = width / spectrum.length;
  let ground = height * 0.75;

  for (let i = 0; i < spectrum.length; i++) {
    let x = i * barWidth;
    let h = map(spectrum[i], 0, 255, 10, ground - 80); // 빌딩 높이

    // 색상 모드에 따른 빌딩 색
    let baseR, baseG, baseB;
    if (colorModeIndex4 === 0) {
      baseR = 30;
      baseG = 50;
      baseB = 90 + i * 2;
    } else if (colorModeIndex4 === 1) {
      baseR = 60 + i;
      baseG = 40;
      baseB = 80;
    } else {
      baseR = 20;
      baseG = 60 + i;
      baseB = 60 + i;
    }

    fill(baseR, baseG, baseB);
    rect(x, ground - h, barWidth, h);

    // 빌딩 위에 안테나
    stroke(200);
    strokeWeight(1);
    line(x + barWidth / 2, ground - h, x + barWidth / 2, ground - h - 10 - level * 40);

    // 창문 (작은 rect / ellipse)
    let windowRows = 4;
    let windowCols = 3;
    let wxSpacing = barWidth / (windowCols + 1);
    let wySpacing = h / (windowRows + 2);

    noStroke();
    for (let r = 0; r < windowRows; r++) {
      for (let c = 0; c < windowCols; c++) {
        let wx = x + (c + 1) * wxSpacing;
        let wy = ground - h + (r + 1) * wySpacing;

        // 음량이 클수록 창문 더 많이 켜짐
        let onChance = map(level, 0, 0.3, 0.1, 0.9);
        if (random(1) < onChance) {
          fill(255, 230, 150, 220);
        } else {
          fill(80, 80, 80, 150);
        }
        rect(wx - 3, wy - 4, 6, 8);
      }
    }
  }

  // 지면
  noStroke();
  fill(10, 10, 20);
  rect(0, ground, width, height - ground);

  // 텍스트
  fill(230);
  textAlign(CENTER, CENTER);
  text("Click: Play / Pause | C: Color Mode", width / 2, 30);
}

function mousePressed() {
  if (song4.isPlaying()) {
    song4.pause();
    isPlaying4 = false;
  } else {
    song4.loop();
    isPlaying4 = true;
  }
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    colorModeIndex4 = (colorModeIndex4 + 1) % 3;
  }
}
