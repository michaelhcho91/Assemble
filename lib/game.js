import Piece from "./piece";
import Player from "./player";

class Game {
  constructor(player, context) {
    this.player = player;
    this.context = context;

    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.board = this.createBoard(12, 20);

    this.autoDrop = this.autoDrop.bind(this);
    this.draw = this.draw.bind(this);
    this.manualDrop = this.manualDrop.bind(this);
    this.moveLat = this.moveLat.bind(this);
    this.playerRotate = this.playerRotate.bind(this);
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
    
    this.player.drawMatrix( // player (piece)
      this.player.matrix, this.player.position, c
    );

    this.player.drawMatrix( // board
      this.board, {x: 0, y: 0}, c
    );
  }

  isCollided(board, player) {
    const [matrix, offset] = [player.matrix, player.position];

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== 0 && (board[y + offset.y] && board[y + offset.y][x + offset.x]) !== 0) {
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
      this.player.position.y = 0;
      this.player.position.x = 4;
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

    if (this.isCollided(this.board, this.player)) {
      this.player.position.x -= direction;
    }
  }

  playerRotate(direction) {
    this.rotate(this.player.matrix, direction);
    
    const currentPosition = this.player.position.x;
    let offset = 1;
    while (this.isCollided(this.board, this.player)) {
      this.player.position.x += offset;

      if (offset > 0) {
        offset = -offset + 1;
      } else {
        offset = -offset + -1;
      }

      if (offset > this.player.matrix[0].length) {
        this.rotate(this.player.matrix, -direction);
        this.player.position.x = currentPosition;
        return;
      }
    }
  }
  
  rotate(matrix, direction) {
    for(let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
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
  }
}

export default Game;