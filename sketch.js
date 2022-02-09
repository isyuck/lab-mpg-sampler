// GUI variables.
var logoFont;
var readableFont;
var buttons = [];
var sliders = [];

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
var hpf, lpf;

// Main output volume control.
var mainOut;

// all the tracks
var tracks;

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

// Load images and fonts here.
function preload() {
  logoFont = loadFont("assets/spaceage.otf");
  readableFont = loadFont("assets/hack.ttf");
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
          400 + x * 240, // x position
          200 + y * 240, // y position
          200 // size
        )
      );
    }
  }

  // Create sliders
  for (let i = 0; i < 3; i++) {
    sliders.push(new VSlider(60 + i * 60, 250, 30, 200));
  }

  // Set slider default values and callback functions.
  sliders[0].value = 1;
  sliders[0].onSlide = slider_0_Moved;
  sliders[1].value = 1;
  sliders[1].onSlide = slider_1_Moved;
  sliders[2].value = 1;
  sliders[2].onSlide = slider_2_Moved;

  // create each track
  // constructor args are
  // name
  // button ref
  // sample src
  // starting pattern
  tracks.push(
    new StepSeqTrack(
      "click",
      buttons[0],
      "assets/click.mp3",
      'struct "1 1" + speed "1 0.5"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "beep",
      buttons[1],
      "assets/beep.mp3",
      'struct "1 1 1 0 1 1 1 0 1 1 1 0 1 1 1 0 " + speed "0.5 0.55 0.45 0.5" + hpf "3000"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "amen00",
      buttons[2],
      "assets/amen/amen00.wav",
      'struct "1 1 1 1" + hpf "0 500 1000 1500" + speed "1 0.5 2 1.5"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "amen01",
      buttons[3],
      "assets/amen/amen01.wav",
      'struct "0 1 0 0" + lpf "1000"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "amen02",
      buttons[4],
      "assets/amen/amen02.wav",
      'struct "0 0 1 0 0" + speed "0.5"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "amen03",
      buttons[5],
      "assets/amen/amen03.wav",
      'struct "0 0 0 0 1 1 0 1" + speed "2" + hpf "5000"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "hat",
      buttons[6],
      "assets/hihat.mp3",
      'struct "1 1 1 1 0 0 0 0 1 1 1 1 0 0 0 0" + hpf "5000 8000 10000 13000"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "808bd",
      buttons[7],
      "assets/808bd.wav",
      'struct "1 1 0 1 0 0 1 0"'
    )
  );

  tracks.push(
    new StepSeqTrack(
      "show",
      buttons[8],
      "assets/show.wav",
      'struct "0 1 0 0 1 1 0 0" + speed "1 1.5" + hpf "500 1000"'
    )
  );
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
  hpf = new Tone.Filter(0, "highpass");
  lpf = new Tone.Filter(40000, "lowpass");
  mainOut.chain(hpf, lpf, Tone.Destination);

  // Create our own sequencer.
  // We will use this clock, which runs in the audio thread, as a
  // very accurate metronome. It will call the `play()` function at
  // regular intervals (specified in Hz) passing the argument
  // `time`, which is the precise time that can be used for sample
  // accurate scheduling.
  clock = new Tone.Clock(play, (bpm / 60) * 4);
  clock.start();

  // initialise each track
  for (var track of tracks) {
    await track.init(mainOut);
  }
  // connect mainout

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

  // run each tracks play function
  for (var track of tracks) {
    track.play(time, playhead);
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
  textFont(readableFont);
  textSize(20);
  text("with patterns", 13, 150);
  textFont(logoFont);

  // draw all of the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
  textFont(readableFont);
  textSize(20);
  push();
  translate(80, 500);
  rotate(radians(270));
  text("vol", 0, 0);
  text("lpf", 0, 60);
  text("hpf", 0, 120);
  pop();

  // draw the main sliders
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].draw();
  }

  // Visualise playback position.
  translate(40, 810);
  for (var i = 0; i < numSteps; i++) {
    var x = i * 40;
    // fill current step green, others white
    fill(i == playhead ? color(0, 255, 0) : color(255));
    x *= 1.2; // pad
    rect(x, 0, 40, 40); // draw step
    text(i + 1, x + 20, 60); // draw step number
  }
}

// -----------------------------------------------------------------------------
// Slider callback functions
// -----------------------------------------------------------------------------

function slider_0_Moved() {
  mainOut.volume.value = ampToDb(sliders[0].value);
}
function slider_1_Moved() {
  lpf.frequency.rampTo(sliders[1].value * 10000, 0);
}
function slider_2_Moved() {
  hpf.frequency.rampTo((1 - sliders[2].value) * 20000, 0);
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

function mouseDragged() {
  if (!audioInitialised) {
    // Disable mouse controls until audio samples are loaded.
    return;
  }

  // slide individual volume sliders in each track, if necessary
  for (var track of tracks) {
    if (track.button.slider.isInside(mouseX, mouseY)) {
      track.button.slider.slide(mouseY);
      break;
    }
  }

  // Work out if a slider has been moved.
  for (let i = 0; i < sliders.length; i++) {
    if (sliders[i].isInside(mouseX, mouseY)) {
      sliders[i].slide(mouseY);
      break;
    }
  }
}
