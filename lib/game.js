import Piece from "./piece";

class Game {
  constructor(player, context) {
    this.player = player;
    this.context = context;

    this.board = this.createBoard(10, 20);
    this.dropCounter = 0;
    this.dropInterval = 700;
    this.gameOver = false;
    this.lastTime = 0;
    this.paused = false;
  }

  autoDrop(time) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.manualDrop();
    }
  }

  createBoard(width, height) {
    const board = [];

    while (height--) { // while truthy, decrement
      board.push(
        new Array(width).fill(0)
      );
    }

    return board;
  }

  draw(canvas) {
    const c = this.context;
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    this.player.drawMatrix( // board
      this.board, {x: 0, y: 0}, c
    );
    
    this.player.drawMatrix( // player (piece)
      this.player.matrix, this.player.position, c
    );
  }

  generateNext() {
    const piece = new Piece();
    const SHAPES = "IJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOT123";
    const shape = SHAPES[
      Math.floor(SHAPES.length * Math.random())
    ];

    this.player.matrix = piece.createPiece(shape);
    this.player.position.y = 0;
    this.player.position.x = 3;

    if (this.isCollided(this.board, this.player)) {
      this.gameOver = true;
      this.board.forEach(row => row.fill(0));
      // render game over screen
    }
  }
  
  // hardDrop() {
  //   while (!this.isCollided(this.board, this.player)) {
  //     this.manualDrop();
  //   }
  // }
  
  isCollided(board, player) {
    const [matrix, position] = [player.matrix, player.position];

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const pieceEdge = matrix[y][x];
        const boardEdge = (board[y + position.y] && board[y + position.y][x + position.x]);

        if (pieceEdge !== 0 && boardEdge !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  manualDrop() {
    this.player.position.y++;

    if (this.isCollided(this.board, this.player)) {
      this.player.position.y--;
      this.mergeMatrix(this.board, this.player);
      this.generateNext();
    }

    this.dropCounter = 0;
  }

  mergeMatrix(board, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y + player.position.y][x + player.position.x] = value;
        }
      });
    });
  }

  moveLat(direction) {
    this.player.position.x += direction;

    if (this.isCollided(this.board, this.player)) { // check wall collision
      this.player.position.x -= direction;
    }
  }

  playerRotate(direction) {
    this.rotate(this.player.matrix, direction);
    const currentPosition = this.player.position.x;
    let position = 1;

    while (this.isCollided(this.board, this.player)) {
      this.player.position.x += position;

      if (position > 0) {
        position = -position + 1;
      } else {
        position = -position + -1;
      }

      if (position > this.player.matrix[0].length) {
        this.rotate(this.player.matrix, -direction);
        this.player.position.x = currentPosition;
        return;
      }
    }
  }
  
  rotate(matrix, direction) {
    for(let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; // transpose
      }
    }

    if (direction > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  start(gameView) {
    gameView.bindControls();
    gameView.update();

    // if (this.player.score >= 200) { // increase difficulty
    //   this.dropInterval -= 100;
    // }
  }
}

export default Game;