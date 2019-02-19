import Piece from "./piece";

const SHAPES = "IJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOT123"; // lower chance for 123

class Game {
  constructor(player, context, previewCtx) {
    this.player = player;
    this.context = context;
    this.preview = previewCtx;

    this.board = this.createBoard(10, 20);
    this.dropCounter = 0;
    this.dropInterval = 800;
    this.gameOver = false;
    this.isPlaying = false;
    this.lastTime = 0;
    this.music = "paused";
    this.nextPiece = [
      new Piece().createPiece(
        SHAPES[Math.floor(Math.random() * SHAPES.length)]
      )
    ];
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

  clearRows() {
    let rowsCleared = 0;
    const board = this.board;

    for (let y = board.length - 1; y > 0; y--) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y].every(el => el !== 0)) {
          board.splice(y, 1);
          rowsCleared += 1;
          board.unshift(new Array(10).fill(0));
        }
      }
    }

    this.player.score += rowsCleared;
  }

  createBoard(width, height) {
    const board = [];

    for (let i = 0; i < height; i++) {
      board.push(
        new Array(width).fill(0)
      );
    }

    return board;
  }

  draw(canvas) {
    const ctx = this.context;
    const preview = this.preview;
    const nextPiece = this.nextPiece[0];
    const player = this.player;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    preview.clearRect(0, 0, 120, 120);
    
    player.drawMatrix( // board
      this.board, {x: 0, y: 0}, ctx
    );
    
    player.drawMatrix( // current piece
      player.matrix, player.position, ctx
    );

    player.drawMatrix( // preview
      this.createBoard(12, 12), {x: 0, y: 0}, preview
    );

    player.drawMatrix( // next piece
      nextPiece, {x: 0, y: 0}, preview
    );
  }

  generateNextPiece() {
    const player = this.player;
    const piece = new Piece();
    const shape = SHAPES[
      Math.floor(SHAPES.length * Math.random())
    ];

    this.nextPiece.push(piece.createPiece(shape)); // generate new nextPiece

    player.matrix = this.nextPiece.shift(); // set currentPiece to nextPiece
    player.position.x = 3; // back to start position
    player.position.y = 0;
    
    if (this.isCollided(this.board, player)) {
      this.gameOver = true;
      this.isPlaying = false;
      this.playMusic();
      const gameover = document.getElementById("gameover");
      gameover.play();
    }
  }
  
  hardDrop() {
    const player = this.player;
    
    while (!this.isCollided(this.board, player)) {
      player.position.y++;
    }

    player.position.y--;
    this.dropCounter = 9999;
  }
  
  isCollided(board, player) {
    const matrix = player.matrix;
    const position = player.position;

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
    const player = this.player;
    if (this.paused) return;
    
    player.position.y++;

    if (this.isCollided(this.board, player)) {
      player.position.y--; // move up one row to pre-collided position
      this.setPiece(this.board, player);
      this.clearRows();
      this.generateNextPiece();
      player.addPoints();
    }

    this.dropCounter = 0;
  }

  moveLat(direction) {
    const player = this.player;
    
    player.position.x += direction;

    if (this.isCollided(this.board, player)) { // check wall collision
      player.position.x -= direction;
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

  rotate(direction) {
    const player = this.player;
    const matrix = this.player.matrix;
    const position = this.player.position;

    player.transpose(matrix, direction);
    const currentPosition = position.x;
    let offset = 1;

    while (this.isCollided(this.board, player)) {
      position.x += offset;

      if (offset > 0) {
        offset = -offset + 1;
      } else {
        offset = -offset + -1;
      }

      if (offset > matrix[0].length) {
        player.transpose(matrix, -direction);
        position.x = currentPosition;

        return;
      }
    }
  }

  setPiece(board, player) {
    const position = player.position;
    const matrix = player.matrix;
    
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y + position.y][x + position.x] = value; // set piece value to board grid
        }
      });
    });
  }

  start(gameView) {
    if (!this.gameOver && !this.paused) {
      this.board = this.createBoard(10, 20);
      
      this.gameOver = false;
      this.isPlaying = true;
      this.dropCounter = 0;
      this.dropInterval = 800;
      this.player.resetScore();

      gameView.update();
    } else if (this.paused) {
      this.paused = false;
      gameView.update();
    }
  }
}

export default Game;