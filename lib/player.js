const COLORS = [
  null,
  "red", // T
  "green", // O
  "purple", // L
  "blue", // J
  "yellow", // I
  "orange", // S
  "pink", // Z
  "black", // 1
  "white", // 2
  "silver", // 3
  "brown", // N
];

class Player {
  constructor(position, matrix) {
    this.position = position;
    this.matrix = matrix;
    this.score = 0;
  }

  drawPoints() {
    const score = document.getElementById("score");
    score.innerText = this.score;
  }
  
  drawMatrix(matrix, position, context) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) { // color pieces
          context.strokeStyle = "#BECEEF";
          context.lineWidth = 0.08;
          context.strokeRect(x + position.x, y + position.y, 1, 1);
          context.fillStyle = COLORS[value];
          context.fillRect(x + position.x, y + position.y, 1, 1);
        } else if (value === 0) { // draw board grid
          context.strokeStyle = "#BECEEF";
          context.lineWidth = 0.04;
          context.strokeRect(x + position.x, y + position.y, 1, 1);
        }
      });
    });
  }

  resetScore() {
    const gamestart = document.getElementById("gamestart");
    gamestart.volume = 0.3;
    gamestart.play();
    
    this.score = 0;
    this.drawPoints();
  }

  transpose(matrix, direction) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; // transpose
      }
    }

    if (direction > 0) { // rotate other direction
      matrix.forEach(row => {
        row.reverse();
      });
    } else {
      matrix.reverse();
    }
  }
}

export default Player;