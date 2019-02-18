import Piece from "./piece";

const SHAPES = "IJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOT123";

class Game {
  constructor(player, context, previewCtx) {
    this.player = player;
    this.context = context;
    this.previewCtx = previewCtx;

    this.board = this.createBoard(10, 20);
    this.dropCounter = 0;
    this.dropInterval = 700;
    this.gameOver = false;
    this.isPlaying = false;
    this.lastTime = 0;
    this.music = "paused";
    this.nextPiece = [new Piece().createPiece(
      SHAPES[Math.floor(Math.random() * SHAPES.length)]
    )];
    this.paused = false;
  }

  autoDrop(time = 0) {
    const ctx = this.context;

    if (this.paused) {
      ctx.font = "1.5px Arial, Helvetica, sans-serif";
      ctx.strokeStyle = "#142143";
      ctx.lineWidth = 0.2;
      ctx.strokeText("Paused", 2.5, 6);

      ctx.font = "1.5px Arial, Helvetica, sans-serif";
      // ctx.fillStyle = "white";
      ctx.fillText("Paused", 2.5, 6);
      return;
    }
    
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
    const ctx = this.context;
    const previewCtx = this.previewCtx;
    const nextPiece = this.nextPiece[0];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    previewCtx.clearRect(0, 0, 120, 120);
    
    this.player.drawMatrix( // board
      this.board, {x: 0, y: 0}, ctx
    );
    
    this.player.drawMatrix( // current piece
      this.player.matrix, this.player.position, ctx
    );
    
    this.player.drawMatrix( // preview
      this.createBoard(12, 12), {x: 0, y: 0}, previewCtx
    );

    this.player.drawMatrix( // next piece
      nextPiece, {x: 0, y: 0}, previewCtx
    );
  }

  generateNext() {
    const piece = new Piece();
    const shape = SHAPES[
      Math.floor(SHAPES.length * Math.random())
    ];

    this.nextPiece.push(piece.createPiece(shape)); // generate new nextPiece

    this.player.matrix = this.nextPiece.shift(); // set currentPiece to nextPiece
    this.player.position.x = 3; // back to start position
    this.player.position.y = 0;
    
    if (this.isCollided(this.board, this.player)) {
      this.gameOver = true;
      this.isPlaying = false;
      this.playMusic();
      // this.board.forEach(row => row.fill(0));
    }
  }
  
  hardDrop() {
    while (!this.isCollided(this.board, this.player)) {
      // this.manualDrop();
      this.player.position.y++;
    }
    this.player.position.y--;
    this.dropCounter = 1000;
  }
  
  isCollided(board, player) {
    const [matrix, position] = [player.matrix, player.position];

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const pieceEdge = matrix[y][x];
        const boardEdge = (board[y + position.y] && board[y + position.y][x + position.x]);
        // let boardEdge;
        // if ((board[y + position.y] === 0) && board[y + position.y][x + position.x] === 0) {
        //     boardEdge = 0;
        //   } else boardEdge = 1;

        if (pieceEdge !== 0 && boardEdge !== 0) { // collision means non-zero on top of each other
          return true;
        }
      }
    }

    return false;
  }

  manualDrop() {
    if (this.paused) return;
    
    this.player.position.y++;

    if (this.isCollided(this.board, this.player)) {
      this.player.position.y--; // move up one row to pre-collided position
      this.setPiece(this.board, this.player);
      this.generateNext();
    }

    this.dropCounter = 0;
  }

  setPiece(board, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y + player.position.y][x + player.position.x] = value; // set piece value to board grid
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

  playMusic() {
    const audio = document.getElementById("bg-music");

    if (this.music === "paused") {
      audio.play();
      this.music = "playing";
    } else {
      audio.pause();
      this.music = "paused";
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

    // if (direction > 0) { // option to rotate other direction
      // matrix.forEach(row => row.reverse());
    // } else {
      matrix.reverse();
    // }
  }

  start(gameView) {
    if (!this.gameOver && !this.paused) {
      this.board = this.createBoard(10, 20);
      
      this.gameOver = false;
      this.isPlaying = true;
      this.dropCounter = 0;

      gameView.update();
    } else if (this.paused) {
      this.paused = false;
      gameView.update();
    }

    // if (this.player.score >= 200) { // increase difficulty
    //   this.dropInterval -= 100;
    // }
  }
}

export default Game;