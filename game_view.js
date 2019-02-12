class GameView {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  createBoard(width, height) {
    const matrix = [];

    // while `height` is truthy, decrement
    // create each row (array) filled with zeroes
    while (height--) {
      matrix.push(new Array(width).fill(0));
    }

    return matrix;
  }
}

export default GameView;