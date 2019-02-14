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
    this.game.drop(time);
    this.drawBoard(this.canvas);
    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37:
          this.game.player.position.x--;
          break;
        case 39:
          this.game.player.position.x++;
          break;
        case 40:
          this.game.playerDrop();
          break;
        
        default:
          break;
      }
    });
  }
}

export default GameView;