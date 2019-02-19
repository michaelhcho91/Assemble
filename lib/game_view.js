class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
  }

  drawBoard() {
    this.game.draw(this.canvas);
  }

  update(time) {
    const g = this.game;

    if (!g.gameOver) {
      this.drawBoard();
      g.autoDrop(time);
      if (g.paused) return;
    } else {
      this.drawBoard();
      g.context.font = "1.5px Arial, Helvetica, sans-serif";
      g.context.strokeStyle = "#142143";
      g.context.lineWidth = 0.2;
      g.context.strokeText("Game Over!", 1, 6);
      
      g.context.font = "1.5px Arial, Helvetica, sans-serif";
      g.context.fillText("Game Over!", 1, 6);

      g.context.font = "0.8px Arial, Helvetica, sans-serif";
      g.context.strokeStyle = "#142143";
      g.context.lineWidth = 0.2;
      g.context.strokeText("ENTER to play again", 1.25, 8);

      g.context.font = "0.8px Arial, Helvetica, sans-serif";
      g.context.fillText("ENTER to play again", 1.25, 8);

      g.gameOver = true;
      g.isPlaying = false;
      return;
    }

    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 13: // enter to start
          e.preventDefault();
          if (!this.game.isPlaying || this.game.gameOver) {
            this.game.gameOver = false;
            this.game.start(this);
            this.game.playMusic();
          }
          break;
          
        case 80: // p for pause
          if (this.game.paused) {
            this.game.start(this);
            this.game.playMusic();
          } else {
            this.game.paused = true;
            this.game.playMusic();
          }
          break;

        case 77: // m for mute
          this.game.playMusic();
          break;
        
        case 37: // left
        case 65: // A
          e.preventDefault();
          if (!this.game.paused && !this.game.gameOver) {
            this.game.moveLat(-1);
          }
          break;

        case 39: // right
        case 68: // D
          e.preventDefault();
          if (!this.game.paused && !this.game.gameOver) {
            this.game.moveLat(1);
          }
          break;

        case 40: // down
        case 83: // S
          e.preventDefault();
          if (!this.game.paused && !this.game.gameOver) {
            this.game.manualDrop();
          }
          break;

        case 16: // SHIFT
        case 38: // up
        case 87: // W
          e.preventDefault();
          if (!this.game.paused && !this.game.gameOver) {
            this.game.playerRotate(-1);
          }
          break;

        case 32: // space
          e.preventDefault();
          if (!this.game.paused && !this.game.gameOver) {
            this.game.hardDrop();
            // space for hard drop
          }
          break;

        default:
          break;
      }
    });
  }
}

export default GameView;