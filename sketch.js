let song;
let isPlaying = false;

function preload() {
  song = loadSound('music.mp3');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(15, 20, 40);

  fill(255);
  textSize(18);
  text("Click to play / pause", width / 2, height / 2);
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
