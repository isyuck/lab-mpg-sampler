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
        this.label = '';
        this.isActive = false;
        this.onPressed = undefined;
    }

    draw() {
        stroke(255);

        if (this.isActive) {
            if (frameCount % 10 > 5) {
                fill(255, 0, 0);
            }
            else {
                fill(100, 0, 0);
            }
        }
        else {
            fill(0, 255, 0);
        }

        rect(this.topLeft.x, this.topLeft.y, this.width, this.height);

        fill(0);
        stroke(0, 0, 0, 0);
        textAlign(CENTER);
        textSize(16);
        text(this.label, this.centre.x, this.centre.y);
    }

    isInside(x, y) {
        if (x > this.topLeft.x && x < this.bottomRight.x) {
            if (y > this.topLeft.y && y < this.bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    press() {
        this.isActive = !this.isActive;
        if (this.onPressed != undefined)
            this.onPressed(this.isActive);
    }
}
