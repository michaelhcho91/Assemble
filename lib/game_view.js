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

    if (g.paused) return;

    if (!g.gameOver) {
      g.context.clearRect(0, 0, canvas.width, canvas.height);

      this.drawBoard();
      g.autoDrop(time);
    } else {
      g.context.font = "1.5px Georgia";
      g.context.strokeStyle = "black";
      g.context.lineWidth = 0.2;
      g.context.strokeText("Game Over!", 1, 6);
      
      g.context.font = "1.5px Georgia";
      g.context.fillStyle = "white";
      g.context.fillText("Game Over!", 1, 6);

      g.gameOver = true;
      g.isPlaying = false;
      return;
    }

    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37: // left
        case 65: // A
          e.preventDefault();

          if (!this.game.paused) {
            this.game.moveLat(-1);
          }

          break;
        case 39: // right
        case 68: // D
          e.preventDefault();
          
          if (!this.game.paused) {
            this.game.moveLat(1);
          }

          break;
        case 40: // down
        case 83: // S
          e.preventDefault();

          if (!this.game.paused) {
            this.game.manualDrop();
          }
          
          break;
        case 16: // SHIFT
        case 38: // up
        case 87: // W
          e.preventDefault();

          if (!this.game.paused) {
            this.game.playerRotate(-1);
          }

          break;
        case 32: // space
          e.preventDefault();

          if (!this.game.paused) {
            // this.game.hardDrop();
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