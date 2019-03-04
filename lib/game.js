import Piece from "./piece";

const SHAPES = "IJLSZOTNIJLTIJLSZOTIJLTIJLSZOTIJLTN123";

class Game {
  constructor(player, context, previewCtx) {
    this.player = player;
    this.context = context;
    this.preview = previewCtx;

    this.board = this.createBoard(10, 20);
    this.startTime = 0;
    this.dropInterval = 800;
    this.gameOver = false;
    this.isPlaying = false;
    this.lastTime = 0;
    this.musicPlaying = false;
    this.nextPieceArray = [
      new Piece().createPiece(
        SHAPES[Math.floor(Math.random() * SHAPES.length)]
      )
    ];
    this.nextScore = 100000;
    this.paused = false;
    this.wantShadow = true;
  }

  addRow() {
    const board = this.board;
    const newRow = new Array(10).fill(8);

    setTimeout(() => {
      board.shift();
      newRow[
        Math.floor(Math.random() * 10)
      ] = 0;
      board.push(newRow);
    }, 2000);
  }

  autoDrop(time = 0) {
    const ctx = this.context;

    if (this.paused) {
      ctx.font = "1.5px Arial, Helvetica, sans-serif";
      ctx.strokeStyle = "#142143";
      ctx.lineWidth = 0.2;
      ctx.strokeText("Paused", 2.5, 6);
      ctx.font = "1.5px Arial, Helvetica, sans-serif";
      ctx.fillText("Paused", 2.5, 6);
    }
    
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.startTime += deltaTime;

    if (this.startTime > this.dropInterval) {
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

    if (board.forEach(row => row.every(el => el == 0))) {
      rowsCleared *= 100;
    }

    if (this.wantShadow) {
      this.player.score += Math.pow(rowsCleared, 2) * (rowsCleared * 1000);
    } else {
      this.player.score += Math.pow(rowsCleared, 2) * (rowsCleared * 2000);
    }
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

    this.drawShadow(); // shadow
    
    player.drawMatrix( // current piece
      player.matrix, player.position, ctx
    );

    player.drawMatrix( // next piece
      nextPiece, {x: 1, y: 1}, preview
    );
    
    player.drawMatrix( // preview
      this.createBoard(14, 14), {x: 0, y: 0}, preview
    );
  }

  drawShadow() {
    if (!this.wantShadow) return;
    
    const shadow = this.player.matrix;
    const position = this.player.position;
    const ctx = this.context;

    let i = 0;
    while (i < this.board.length) {
      const shadowPosition = {
        x: position.x,
        y: i
      };
      
      if (i > position.y && this.isCollided(shadow, shadowPosition)) {
        
        for (let y = 0; y < shadow.length; y++) {
          for (let x = 0; x < shadow[0].length; x++) {
            if (shadow[y][x] !== 0) {
              ctx.fillStyle = "#BECEEF";
              ctx.fillRect(x + position.x + 0.3, y + i - 0.7, 0.4, 0.4);
            }
          }
        }
        
        break;
      }
      i++;
    }
  }

  generateNextPiece() {
    const player = this.player;
    const piece = new Piece();
    const queue = this.nextPieceArray;

    for (let i = 0; queue.length <= 4; i++) {
      const shape = SHAPES[
        Math.floor(SHAPES.length * Math.random())
      ];
      const newPiece = piece.createPiece(shape);

      if (this.isUnique(newPiece)) {
        queue.push(newPiece);
      }
    }
    
    player.matrix = queue.shift(); // set currentPiece to nextPiece
    player.position.x = 3; // back to start position
    player.position.y = 0;
    
    if (this.isCollided(player.matrix, player.position)) {
      this.gameOver = true;
      this.isPlaying = false;
      if (this.musicPlaying) {
        this.playMusic();
      }
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
    this.startTime = 9999;
  }

  increaseDifficulty() {
    const player = this.player;
    const interval = this.dropInterval - 50;

    if (player.score >= this.nextScore) {
      if (this.dropInterval !== interval && this.dropInterval > 100) {
        this.dropInterval -= 50;
        this.addRow();
        this.nextScore += 100000;
      }
    }
  }
  
  isCollided(piece, position) {
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

  isOutOfBounds(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 19) {
      return true;
    }

    return false;
  }

  isUnique(piece) {
    const queue = this.nextPieceArray;

    let result;
    if (queue.some(el => JSON.stringify(el) === JSON.stringify(piece))) {
      result = false;
    } else {
      result = true;
    }
    
    return result;
  }
  
  manualDrop() {
    if (this.paused) return;
    const player = this.player;
    
    player.position.y++;

    if (this.isCollided(player.matrix, player.position)) {
      player.position.y--;

      this.setPiece(this.board, player);
      this.clearRows();
      this.generateNextPiece();
      player.drawPoints();
    }

    this.startTime = 0;
  }

  moveLat(direction) {
    const player = this.player;
    
    player.position.x += direction;

    if (this.isCollided(player.matrix, player.position)) {
      player.position.x -= direction;
    }
  }

  pauseMusic() {
    const audio = document.getElementById("bg-music");

    audio.pause();
    this.musicPlaying = false;
  }
  
  playMusic() {
    const audio = document.getElementById("bg-music");

    audio.volume = 0.3;
    audio.play();
    this.musicPlaying = true;
  }

  reset() {
    this.gameOver = false;
    this.startTime = 0;
    this.dropInterval = 800;
    this.player.resetScore();
    this.nextScore = 100000;
  }

  restart(gameView) {
    this.reset();
    this.board = this.createBoard(10, 20);
    this.paused = false;
    this.isPlaying = true;
    gameView.update();
  }
  
  rotate(direction) {
    const player = this.player;
    const matrix = this.player.matrix;
    const position = this.player.position;

    player.transpose(matrix, direction);
    
    let offset = 1;
    while (this.isCollided(matrix, position)) {
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
    this.isPlaying = true;
    this.playMusic();
    gameView.update();
  }
}

export default Game;