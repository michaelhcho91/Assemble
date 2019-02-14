const COLORS = [
  null,
  "#167F39",
  "#DE264C",
  "#0074D9",
  "#FA5B0F",
  "#FFDC00",
  "#D40D12",
  "#25064C",
  "#63A69F",
  "#F2E1AC",
  "#F2836B"
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
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }
}

export default Player;