class StepSeqTrack {
  constructor(name, button, sample, startingPattern) {
    this.name = name;
    this.button = button;
    this.isPlaying = false;
    this.sample = sample;

    // Set button label to this.name.
    this.button.label = this.name;
    this.initialised = false;

    var self = this; // to get around events overriding `this` in their scope

    // call `updatePattern` whenever the text input changes
    this.button.input.elt.addEventListener("input", function () {
      self.updatePattern(self.button.input.value());
    });

    // fill input with `startingPattern`
    this.button.input.value(startingPattern);
    // `updatePattern` once on construction
    this.updatePattern(self.button.input.value());

    // update this player's volume whenever it's volume slider is slid
    this.button.slider.onSlide = function () {
      if (self.initialised) {
        self.player.volume.value = self.ampToDb(self.button.slider.value);
      }
    };
    // hide input
    this.button.input.elt.style.opacity = "0";
  }

  ampToDb(amp, dBRange = -30) {
    // Map amplitude values between 0 and 1 to volume in decibels
    // between 0 and dBRange.
    if (dBRange >= 0) {
      console.error("dBRange should be negative!");
    }
    return map(amp, 0, 1, dBRange, 0);
  }

  // initialise this track
  // out = destination
  async init(out) {
    // create effects
    this.hpf = new Tone.Filter(0, "highpass");
    this.lpf = new Tone.Filter(40000, "lowpass");
    // create player
    this.player = new Tone.Player(this.sample);
    await Tone.loaded();
    console.log("loaded " + this.sample);

    // create chain
    await this.player.chain(this.hpf, this.lpf, out);
    this.initialised = true;
    // show input
    this.button.input.elt.style.opacity = "1";
  }

  // play this sample, if it's pattern matches the playhead position
  play(time, playhead) {
    if (this.initialised) {
      // apply effect patterns
      for (var pat of this.pattern) {
        // the value of the current step
        const current = pat.pattern[playhead];
        if (current != null && current != 0) {
          switch (pat.type) {
            case "speed":
              this.player.playbackRate = current;
              break;
            case "hpf":
              this.hpf.frequency.rampTo(current, 0);
              break;
            case "lpf":
              this.lpf.frequency.rampTo(current, 0);
              break;
            default:
              break;
          }
        }
      }
      // the pattern at [0] should always be `struct`, governs whether
      //  a sample will play this step
      if (this.pattern[0].pattern[playhead] != 0) {
        this.player.start(time);
        this.button.isActive = true; // notify UI
      } else {
        this.button.isActive = false;
      }
    }
  }

  // try to parse this pattern
  updatePattern(p) {
    try {
      this.pattern = this.parsePattern(p);
      this.isPlaying = true;
      // set text input background to white
      this.button.input.elt.style.backgroundColor = "#fff";
    } catch (e) {
      // there is an error, notify user by making text input
      // background red
      this.button.input.elt.style.backgroundColor = "#ff0000";
    }
  }

  // turns a string into an array of patterns
  //
  parsePattern(p) {
    // split on pattern composing `+` symbol
    let pats = p.split("+");
    // separate `type` (e.g. `speed`, `hpf`)
    // and `pattern` (e.g. `0 1 0.5 1`)
    pats = pats.map((x) => x.split('"'));
    pats = pats.map((x) => ({
      type: x[0].replaceAll(" ", ""),
      pattern: x[1].split(" "),
    }));
    for (var pat of pats) {
      // empty pattern of 16 empty steps
      let out = new Array(16).fill(0);
      for (var [i, e] of pat.pattern.entries()) {
        // stretch events to fill 16 steps
        // "1 1"     -> step 1, 8        (1 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0)
        // "1 1 1 1" -> step 1, 4, 8, 12 (1 0 0 0 1 0 0 0 1 0 0 1 0 0 0 0)
        out[round(map(i, 0, pat.pattern.length, 0, out.length))] = e;
      }
      pat.pattern = out;
    }
    return pats;
  }
}
