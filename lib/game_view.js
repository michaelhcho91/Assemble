class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
  }

  update(time = 0) {
    this.game.draw(this.canvas);
    this.game.autoDrop(time);
    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37: // left
        case 65: // A
          e.preventDefault();
          this.game.moveLat(-1);
          break;
        case 39: // right
        case 68: // D
          e.preventDefault();
          this.game.moveLat(1);
          break;
        case 40: // down
        case 83: // S
          e.preventDefault();
          this.game.manualDrop();
          break;
        case 16: // SHIFT
        case 38: // up
        case 87: // W
          e.preventDefault();
          this.game.playerRotate(-1);
          break;
        case 32: // space
          e.preventDefault();
          // this.game.hardDrop();
          // space for hard drop
          break;
        default:
          break;
      }
    });
  }
}

export default GameView;