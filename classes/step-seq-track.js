class StepSeqTrack {
  constructor(name, button) {
    this.name = name;
    this.button = button;
    this.isPlaying = false;

    // Set button label to this.name.
    this.button.label = this.name;

    // Set button callback to update this.isPlaying.
    this.button.onPressed = (playback) => {
      this.isPlaying = playback;
    };
  }
  updatePattern(p) {
    this.pattern = this.parsePattern(p);
  }

  parsePattern(p) {
    let pats = p.split("+");
    pats = pats.map((x) => x.split('"'));
    pats = pats.map((x) => ({
      type: x[0].replaceAll(" ", ""),
      pattern: x[1].split(" "),
    }));
    for (var pat of pats) {
      let out = new Array(16).fill(0);
      for (var [i, e] of pat.pattern.entries()) {
        out[round(map(i, 0, pat.pattern.length, 0, out.length))] = e;
      }
      pat.pattern = out;
    }
    return pats;
  }
}

// 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0
