class StepSeqTrack {
  name = "";
  eventPattern;
  controlPatterns;
  button;
  isPlaying = false;
  constructor(name, eventPattern, controlPatterns, button) {
    this.name = name;
    if (eventPattern.length === 0) {
      this.eventPattern = [0];
    } else {
      this.eventPattern = this.parseEventPattern(eventPattern);
    }

    if (controlPatterns.length === 0) {
      this.controlPatterns = [];
    } else {
      this.controlPatterns = this.parseControlPatterns(controlPatterns);
    }

    this.button = button;
    this.isPlaying = false;

    // Set button label to this.name.
    this.button.label = this.name;

    // Set button callback to update this.isPlaying.
    this.button.onPressed = (playback) => {
      this.isPlaying = playback;
    };
  }
  updateEventPattern(p) {
    this.eventPattern = this.parseGenericPattern(p[1]);
  }
  parseEventPattern(p) {
    console.log(p);
    return this.parseGenericPattern(p[1]);
  }
  parseControlPatterns(ps) {
    console.log(ps);
    return ps.map((p) => ({
      type: p[0],
      pattern: this.parseGenericPattern(p[1]),
    }));
  }
  parseGenericPattern(pat) {
    let inPat = pat.split(" ").map((x) => parseFloat(x));
    let outPat = new Array(16).fill(0);
    for (const [i, pat] of inPat.entries()) {
      outPat[round(map(i, 0, inPat.length, 0, 16))] = pat;
    }
    return outPat;
  }
}

// 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0
