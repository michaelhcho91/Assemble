import Piece from "./piece";
import Player from "./player";

class Game {
  constructor(player, context) {
    this.player = player;
    this.context = context;

    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;

    this.drop = this.drop.bind(this);
    this.draw = this.draw.bind(this);
  }

  draw(canvas) {
    const piece = new Piece();
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    piece.drawPiece(
      this.player.matrix, this.player.position, this.context
    );
  }

  drop(time) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.player.position.y++;
      this.dropCounter = 0;
    }
  }
}

export default Game;