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
  "silver" // 3
];

class Player {
  constructor(position, matrix) {
    this.position = position;
    this.matrix = matrix;
    this.score = 0;
  }

  drawMatrix(matrix, position, context) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) { // color pieces
          context.strokeStyle = "white";
          context.lineWidth = 0.04;
          context.strokeRect(x + position.x, y + position.y, 1, 1);
          context.fillStyle = COLORS[value];
          context.fillRect(x + position.x, y + position.y, 1, 1);
        } else if (value === 0) { // draw board grid
          context.strokeStyle = "white";
          context.lineWidth = 0.04;
          context.strokeRect(x + position.x, y + position.y, 1, 1);
        }
      });
    });
  }
}

export default Player;