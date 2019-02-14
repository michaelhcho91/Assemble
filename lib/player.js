const COLORS = [
  null,
  "#5E0000",
  "#275610",
  "#1436BE",
  "#E4D94C",
  "#640063",
  "#79191A",
  "#5B3216",
  "#E5DA4D",
  "#E3E3E3",
  "#685326"
];

class Player {
  constructor(position, matrix) {
    this.position = position;
    this.matrix = matrix;

    this.drawMatrix = this.drawMatrix.bind(this);
  }

  drawMatrix(matrix, offset, context) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = COLORS[value];
          context.strokeRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }
}

export default Player;