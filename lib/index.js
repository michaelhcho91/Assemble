import Player from "./player";
import Game from "./game";
import GameView from "./game_view";
import Piece from "./piece";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 600;
const START_X_POS = 3;
const START_Y_POS = 0;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  context.scale(30, 30);

  const player = new Player(
    { x: START_X_POS, y: START_Y_POS },
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