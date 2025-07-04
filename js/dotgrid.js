// Dot Grid by Erik Friberg https://codepen.io/efriberg
class dotGrid {
  constructor(container = "sketch", onMobile = false) {
    this.canvasElement = document.getElementById(container);
    this.onMobile = onMobile

    // Get the device pixel ratio, falling back to 1.
    this.dpr = window.devicePixelRatio || 1;

    this.drawable = this.canvasElement.getBoundingClientRect();
    this.drawable.width *= 1.4;
    this.drawable.height *= 1.4;

    this.canvasWidth = this.drawable.width * this.dpr;
    this.canvasHeight = this.drawable.height * this.dpr;

    this.canvasElement.width = this.canvasWidth;
    this.canvasElement.height = this.canvasHeight;

    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;

    // controls oscillation
    this.time = 0;
    this.speed = 0.01;

    // Setup Canvas
    this.canvas = this.canvasElement.getContext("2d");
    this.canvas.scale(this.dpr, this.dpr);
    this.animate();
  }

  onMouseUpdate(e) {
    if (this.onMobile) {return;}
    this.mouseX = (e.pageX - this.drawable.left) * 1.4;
    this.mouseY = (e.pageY - this.scrollY - this.drawable.top) * 1.4;
  }

  OnScrollUpdate() {
    if (this.onMobile) {return;}
    this.scrollY = window.scrollY;
  }

  animate() {
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    window.requestAnimationFrame(this.draw.bind(this));
    // Listen for scroll updates
    window.addEventListener('scroll',this.OnScrollUpdate.bind(this));
    // Listen for Mouse updates
    document.body.addEventListener(
      "mousemove",
      this.onMouseUpdate.bind(this),
      false
    );
  }

  // Draws the background and calls the function for drawing the dots
  draw() {
    this.time += this.speed;
    this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawDots();
  }

  // i and j function as x and y when drawing the dot grid.
  drawDots() {
    let size = 2;
    let gridSize = 50;
    for (var i = 2; i < this.canvasWidth / this.dpr / gridSize - 1; i++) {
      for (var j = 2; j < this.canvasHeight / this.dpr / gridSize - 1; j++) {
        let x = i * gridSize;
        let y = j * gridSize;
        let oscillation = Math.sin(this.time + (x + y) * 0.003)*25;
        let sizeoscill = Math.cos(this.time*0.1)*10+13;
        let dist = 0.2*(this.pythag(x, y, this.mouseX, this.mouseY)**1.5);
        this.canvas.beginPath();
        this.canvas.arc(
          x + (x - this.mouseX) / dist * gridSize - oscillation,
          y + (y - this.mouseY) / dist * gridSize - oscillation,
          Math.max(0,size + oscillation/(sizeoscill)),0,2*Math.PI,true
        );
        this.canvas.fillStyle = "white";
        this.canvas.fill();
      }
    }
  }

  // Grabs mouse position, checks if the mouse is off the screen (NaN) and calculates the distance from the mouse pointer and each dot using the pythagorean theorem.
  pythag(ellipseX, ellipseY, mouseX, mouseY) {
    let x = mouseX;
    let y = mouseY;

    if (Number.isNaN(x)) {
      return 1;
    } else {
      let leg1 = Math.abs(x - ellipseX);
      let leg2 = Math.abs(y - ellipseY);
      let pyth = Math.pow(leg1, 2) + Math.pow(leg2, 2);
      return Math.sqrt(pyth);
    }
  }
}

const grid = new dotGrid("sketch",window.matchMedia("(any-hover:none)").matches);
grid.init();