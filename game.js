class Game {
  constructor() {

  }

  createBoard(width, height) {
    const matrix = [];

    while (height--) {
      matrix.push(new Array(width).fill(0));
    }

    return matrix;
  }
}