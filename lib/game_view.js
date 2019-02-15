import Piece from "./piece";

class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.bindControls = this.bindControls.bind(this);
    this.drawBoard = this.drawBoard.bind(this);
    this.update = this.update.bind(this);
  }

  drawBoard(canvas) {
    this.game.draw(canvas);
  }

  update(time = 0) {
    this.drawBoard(this.canvas);
    this.game.autoDrop(time);
    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37: // left
        case 65: // A
          this.game.moveLat(-1);
          break;
        case 39: // right
        case 68: // D
          this.game.moveLat(1);
          break;
        case 40: // down
        case 83: // S
          this.game.manualDrop();
          break;
        case 16: // SHIFT
        case 38: // up
        case 87: // W
          this.game.playerRotate(-1);
          break;
        case 32: // space
          // space for hard drop
          break;
        default:
          break;
      }
    });
  }
}

export default GameView;