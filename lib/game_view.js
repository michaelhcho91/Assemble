import Piece from "./piece";

class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
    this.drawBoard = this.drawBoard.bind(this);
  }

  drawBoard(canvas) {
    this.game.draw(canvas);
  }

  update(time = 0) {
    this.game.drop(time);
    this.drawBoard(this.canvas);
    requestAnimationFrame(this.update);
  }
}

export default GameView;