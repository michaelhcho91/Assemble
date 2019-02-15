import Player from "./player";
import Game from "./game";
import GameView from "./game_view";
import Piece from "./piece";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 300;
  canvas.height = 600;
  context.scale(30, 30);

  const player = new Player(
    { x: 3, y: 0 },
    new Piece().createPiece("L")
  );
  const game = new Game(
    player,
    context
  );
  const gameView = new GameView(
    game,
    canvas
  );

  document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 32: // space to start
        e.preventDefault();
        game.start(gameView);
        break;
      case 80:
        // p for pause
        break;
      case 77:
        // m for mute, maybe
        break;
      default:
        break;
    }
  });
});