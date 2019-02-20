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
    this.nextPieceArray = [
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
          board.splice(y, 1); // clear row
          board.unshift(new Array(10).fill(0)); // add new empty row

          rowsCleared += 1;
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
    const nextPiece = this.nextPieceArray[0];
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
      this.createBoard(14, 14), {x: 0, y: 0}, preview
    );

    player.drawMatrix( // next piece
      nextPiece, {x: 1, y: 1}, preview
    );

    // this.drawShadow();
  }

  drawShadow() {
    const matrix = this.player.matrix;
    const position = this.player.position;

    // const shadowPlayer = Object.assign({}, this.player);
    const shadowPlayer = JSON.parse(JSON.stringify(this.player));

    // return shadowPlayer;
    let set = false;
    while (!set) {
      shadowPlayer.position = position;
      shadowPlayer.position.y++;
      if (this.isCollided(matrix, position)) {
        set = true;
      }
    }

    shadowPlayer.position.y--;
  }

  generateNextPiece() {
    const player = this.player;
    const piece = new Piece();
    const shape = SHAPES[
      Math.floor(SHAPES.length * Math.random())
    ];

    // this.nextPieceArray.push(piece.createPiece(shape)); // generate new nextPiece

    let ready = false;
    while (!ready) {
      const newPiece = piece.createPiece(shape);

      if (!this.nextPieceArray.includes(newPiece)) {
        this.nextPieceArray.push(newPiece);
        ready = true;
      }
    }
    
    player.matrix = this.nextPieceArray.shift(); // set currentPiece to nextPiece
    player.position.x = 3; // back to start position
    player.position.y = 0;
    
    if (this.isCollided(player.matrix, player.position)) {
      this.gameOver = true;
      this.isPlaying = false;
      this.playMusic();
      const gameover = document.getElementById("gameover");
      gameover.volume = 0.1;
      gameover.play();
    }
  }
  
  hardDrop() {
    const player = this.player;
    
    while (!this.isCollided(player.matrix, player.position)) {
      player.position.y++;
    }

    player.position.y--;
    this.dropCounter = 9999;
  }
  
  isCollided(piece, position) {
    // const piece = this.player.matrix;
    // const position = player.position;

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[0].length; x++) {
        if (piece[y][x] !== 0) {
          const xOffset = x + position.x;
          const yOffset = y + position.y;

          if (this.isOutOfBounds(xOffset, yOffset) || this.board[yOffset][xOffset] !== 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  manualDrop() {
    const player = this.player;
    if (this.paused) return;
    
    player.position.y++;

    if (this.isCollided(player.matrix, player.position)) {
      player.position.y--;

      this.setPiece(this.board, player);
      this.clearRows();
      this.generateNextPiece();
      player.drawPoints();
    }

    this.dropCounter = 0;
  }

  moveLat(direction) {
    const player = this.player;
    
    player.position.x += direction;

    if (this.isCollided(player.matrix, player.position)) {
      player.position.x -= direction;
    }
  }

  isOutOfBounds(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 19) {
      return true;
    }

    return false;
  }
  
  playMusic() {
    const audio = document.getElementById("bg-music");

    if (this.music === "paused") {
      audio.volume = 0.3;
      audio.play();
      this.music = "playing";
    } else {
      audio.pause();
      this.music = "paused";
    }
  }

  reset() {
    this.gameOver = false;
    this.dropCounter = 0;
    this.dropInterval = 800;
    this.player.resetScore();
  }
  
  rotate(direction) {
    const player = this.player;
    const matrix = this.player.matrix;
    const position = this.player.position;

    player.transpose(matrix, direction);
    
    let offset = 1;
    while (this.isCollided(player.matrix, player.position)) {
      position.x += offset;

      if (offset > 0) {
        offset = -offset + 1;
      } else {
        offset = -offset + -1;
      }
    }
  }

  setPiece(board, player) {
    const position = player.position;
    const piece = player.matrix;
    
    piece.forEach((row, y) => {
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
      this.reset();
      this.isPlaying = true;
      this.playMusic();
      gameView.update();
    } else if (this.paused) {
      this.paused = false;
      gameView.update();
    }
  }
}

export default Game;