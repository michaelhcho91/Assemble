import Player from "./player";
import Game from "./game";
import GameView from "./game_view";
import Piece from "./piece";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 360;
  canvas.height = 600;

  context.scale(30, 30);

  const matrix = new Piece().createPiece();
  const player = new Player(
    { x: 4, y: 0 },
    matrix
  );
  const game = new Game(
    player,
    context
  );
  const gameView = new GameView(game, canvas);

  document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 32:
        game.start(gameView);
        break;
      case 80:
        // p for pause
        break;
      case 77:
        // m for mute
        break;
      default:
        break;
    }
  });
});