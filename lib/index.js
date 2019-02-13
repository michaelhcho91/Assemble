import Player from "./player";
import Game from "./game";
import GameView from "./game_view";
import Piece from "./piece";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 600;

  context.scale(30, 30);

  const matrix = new Piece().createPiece("L");
  const player = new Player(
    { x: 3, y: 3 },
    matrix
  );
  const game = new Game(
    player,
    context
  );
  const gameView = new GameView(game, canvas);


  gameView.update();
});