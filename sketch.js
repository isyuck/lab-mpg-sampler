// GUI variables.
var logoFont;
var buttons = [];
var sliders = [];
var inputs;

// Sound variables.
var bpm = 137;
var minBpm = 30;
var maxBpm = 200;
var numSteps = 16;

// Audio context variables.
var audioStarting = false;
var audioInitialised = false;

// Sequencer variables.
var clock;
var playhead = -1;

// Global effects.

// Main output volume control.
var mainOut;

// Tracks variables.
var click;
var beep;
var amen00;
var amen01;
var amen02;
var amen03;
var hat;

var tracks;

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// Load images and fonts here.
function preload() {
  logoFont = loadFont("assets/spaceage.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight - 4);
  tracks = new Array();

  // Create the GUI controls.
  // Create buttons
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      buttons.push(
        new Button(
          300 + x * 120, // x position
          200 + y * 120, // y position
          100
        ) // button size
      );
    }
  }

  inputs = new Array();
  push();
  translate(600, 75);
  for (let i = 0; i < 9; i++) {
    let input = createInput();
    var x = 0;
    var y = i * 25;
    input.position(x, y);
    input.size(200);
    input.elt.addEventListener("input", function () {
      updatePattern(input.value(), i);
    });
  }
  pop();

  // Create sliders
  for (let i = 0; i < 3; i++) {
    sliders.push(new VSlider(60 + i * 60, 250, 30, 200));
  }

  // Set slider default values and callback functions.
  sliders[0].value = 1;
  sliders[0].onSlide = slider_0_Moved;

  // Create tracks. Each track contains a pattern array, which by
  // default contains 16 values between 0 and 1. Each value or
  // 'tick' is 1/16th of a bar, 4 ticks make a beat.

  click = new StepSeqTrack("click", buttons[0]);
  beep = new StepSeqTrack("beep", buttons[1]);
  amen00 = new StepSeqTrack("amen00", buttons[2]);
  amen01 = new StepSeqTrack("amen01", buttons[3]);
  amen02 = new StepSeqTrack("amen02", buttons[4]);
  amen03 = new StepSeqTrack("amen03", buttons[5]);
  hat = new StepSeqTrack("hat", buttons[6]);

  tracks.push(click);
  tracks.push(beep);
  tracks.push(amen00);
  tracks.push(amen01);
  tracks.push(amen02);
  tracks.push(amen03);
  tracks.push(hat);
}

async function startAudio() {
  // Start initialisation.
  audioStarting = true;
  console.log("Audio starting");

  // We can only initialise the audio context in response to a user
  // event (e.g. mouse or key press).
  await Tone.start();
  console.log("Audio has started.");

  mainOut = new Tone.Volume(0);

  // Create our own sequencer.
  // We will use this clock, which runs in the audio thread, as a
  // very accurate metronome. It will call the `play()` function at
  // regular intervals (specified in Hz) passing the argument
  // `time`, which is the precise time that can be used for sample
  // accurate scheduling.
  clock = new Tone.Clock(play, (bpm / 60) * 4);
  clock.start();

  // Create audio sample players and load audio samples.
  click.player = new Tone.Player("assets/click.mp3");
  beep.player = new Tone.Player("assets/beep.mp3");
  amen00.player = new Tone.Player("assets/amen/amen00.wav");
  amen01.player = new Tone.Player("assets/amen/amen01.wav");
  amen02.player = new Tone.Player("assets/amen/amen02.wav");
  amen03.player = new Tone.Player("assets/amen/amen03.wav");
  hat.player = new Tone.Player("assets/hihat.mp3");
  click.player.connect(mainOut);
  beep.player.connect(mainOut);
  amen00.player.connect(mainOut);
  amen01.player.connect(mainOut);
  amen02.player.connect(mainOut);
  amen03.player.connect(mainOut);
  hat.player.connect(mainOut);
  mainOut.toDestination();

  // Wait until all samples are loaded.
  await Tone.loaded();
  console.log("All samples loaded");

  audioInitialised = true;
  audioStarting = false;
}

function play(time) {
  // Move the playhead to the next position.
  playhead++;
  if (playhead >= numSteps) {
    // Set playhead back to zero to create a cycle of numSteps.
    playhead = 0;
  }

  for (var track of tracks) {
    if (track.isPlaying) {
      console.log(track.pattern[0].type);
      if (track.pattern[0].pattern[playhead] > 0) {
        // track.player.stop(time); //legato
        for (pattern of track.pattern) {
          switch (pattern.type) {
            case "speed":
              if (
                pattern.pattern[playhead] != null &&
                pattern.pattern[playhead] != 0
              ) {
                track.player.playbackRate = pattern.pattern[playhead];
              }
              break;
            default:
              break;
          }
        }
        track.player.start(time);
      }
    }
  }
}

function ampToDb(amp, dBRange = -30) {
  // Map amplitude values between 0 and 1 to volume in decibels
  // between 0 and dBRange.
  if (dBRange >= 0) {
    console.error("dBRange should be negative!");
  }
  return map(amp, 0, 1, dBRange, 0);
}

// -----------------------------------------------------------------------------
// Draw
// -----------------------------------------------------------------------------

function draw() {
  background(0);

  if (!audioInitialised) {
    push();
    textAlign(CENTER);
    textFont("Arial");
    stroke(0);
    fill(255);
    textSize(32);
    text("Press any key to begin", width / 2, height / 2);
    pop();

    return;
  }

  textAlign(LEFT);
  stroke(0);
  fill("#ED225D");
  textFont(logoFont);
  textSize(70);
  text("MPG", 10, 80);

  // Visualise playback position.

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }

  for (let i = 0; i < sliders.length; i++) {
    sliders[i].draw();
  }

  translate(40, 600);
  for (var i = 0; i < numSteps; i++) {
    var x = i * 40;
    var c = i == playhead ? color(0, 255, 0) : color(255);
    fill(c);
    x *= 1.2;
    rect(x, 0, 40, 40);
    text(i + 1, x + 20, 60);
  }
}

// -----------------------------------------------------------------------------
// Slider callback functions
// -----------------------------------------------------------------------------

function slider_0_Moved() {
  mainOut.volume.value = ampToDb(sliders[0].value);
}

// -----------------------------------------------------------------------------
// UI events
// -----------------------------------------------------------------------------

// Key events

function keyPressed() {
  if (!(audioInitialised || audioStarting)) {
    startAudio();
  }
}

// Mouse events

function mousePressed() {
  if (!audioInitialised) {
    // Disable mouse controls until audio samples are loaded.
    return;
  }

  // Work out if a button has been pressed.
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].isInside(mouseX, mouseY)) {
      buttons[i].press();
      break;
    }
  }
}

function mouseDragged() {
  if (!audioInitialised) {
    // Disable mouse controls until audio samples are loaded.
    return;
  }

  // Work out if a slider has been moved.
  for (let i = 0; i < sliders.length; i++) {
    if (sliders[i].isInside(mouseX, mouseY)) {
      sliders[i].slide(mouseY);
      break;
    }
  }
}

function updatePattern(v, i) {
  console.log(v, `i: ${i}`);
  tracks[i].updatePattern(v);
}
