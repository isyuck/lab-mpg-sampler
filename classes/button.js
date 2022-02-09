class Button {
  constructor(centreX, centreY, dim) {
    this.centre = createVector(centreX, centreY);
    this.width = dim;
    this.height = dim;
    this.topLeft = createVector(
      centreX - this.width / 2,
      centreY - this.height / 2
    );
    this.bottomRight = createVector(
      centreX + this.width / 2,
      centreY + this.height / 2
    );
    this.label = "";
    this.isActive = false;
    this.onPressed = undefined;
    this.brightness = 0;

    // input
    this.input = createInput('struct "1 1"');
    this.input.position(this.topLeft.x + 20, this.topLeft.y);
    this.input.size(this.width - 26);
    this.input.height = 100;

    this.slider = new VSlider(this.topLeft.x, this.topLeft.y, 20, this.height);
  }

  draw() {
    stroke(255);

    if (this.isActive) {
      this.brightness = 255;
    }
    fill(this.brightness);
    this.brightness -= 8;

    rect(this.topLeft.x, this.topLeft.y, this.width, this.height);

    fill(0);
    stroke(0, 0, 0, 0);
    textAlign(CENTER);
    textSize(16);
    text(this.label, this.centre.x, this.centre.y);

    this.slider.draw();
  }
}
