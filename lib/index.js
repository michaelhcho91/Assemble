import Player from "./player";
import Game from "./game";
import GameView from "./game_view";
import Piece from "./piece";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 600;
const PREVIEW_WIDTH = 150;
const PREVIEW_HEIGHT = 150;
const START_X_POS = 3;
const START_Y_POS = -1;
const SHAPES = "IJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOT123";
const shape = SHAPES[
  Math.floor(SHAPES.length * Math.random())
];

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const preview = document.getElementById("next-piece");
  const previewCtx = preview.getContext("2d");

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  context.scale(30, 30);
  preview.width = PREVIEW_WIDTH;
  preview.height = PREVIEW_HEIGHT;
  previewCtx.scale(30, 30);

  const player = new Player(
    { x: START_X_POS, y: START_Y_POS },
    new Piece().createPiece(shape)
  );
  const game = new Game(
    player,
    context,
    previewCtx
  );
  const gameView = new GameView(
    game,
    canvas
  );

  context.font = "1px Arial, Helvetica, sans-serif";
  context.strokeStyle = "#142143";
  context.lineWidth = 0.2;
  context.strokeText("ENTER to play!", 1.6, 6);
  context.font = "1px Arial, Helvetica, sans-serif";
  context.fillStyle = "#F6F8F8";
  context.fillText("ENTER to play!", 1.6, 6);

  gameView.bindControls();
});