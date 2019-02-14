import Piece from "./piece";

class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
    this.drawBoard = this.drawBoard.bind(this);
    this.bindControls = this.bindControls.bind(this);
  }

  drawBoard(canvas) {
    this.game.draw(canvas);
  }

  update(time = 0) {
    this.game.autoDrop(time);
    this.drawBoard(this.canvas);
    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37:
        case 65:
          this.game.player.position.x--;
          break;
        case 39:
        case 68:
          this.game.player.position.x++;
          break;
        case 40:
        case 83:
          this.game.manualDrop();
          break;
        case 16:
        case 38:
        case 87:
          // up for rotate
          break;
        case 32:
          // space for hard drop
          break;
        default:
          break;
      }
    });
  }
}

export default GameView;