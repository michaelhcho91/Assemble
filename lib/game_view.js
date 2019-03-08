class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
  }

  bindControls() {
    const game = this.game;
    
    document.addEventListener("keydown", (e) => {
      switch (e.which) {
        case 13: // enter to start
          e.preventDefault();
          if (!game.isPlaying && !game.gameOver) {
            game.gameOver = false;
            game.start(this);
          } else if (game.gameOver) {
            game.gameOver = false;
            game.restart(this);
          }
          break;
          
        case 80: // p for pause
          e.preventDefault();
          if (game.paused) {
            game.paused = false;
            game.start(this);
          } else {
            game.paused = true;
          }
          break;

        case 77: // m for mute
          e.preventDefault();
          if (game.musicPlaying) {
            game.pauseMusic();
          } else {
            game.playMusic();
          }
          break;
        
        case 37: // left
        case 65: // A
          e.preventDefault();
          if (!game.paused && !game.gameOver) {
            game.moveLat(-1);
          }
          break;

        case 39: // right
        case 68: // D
          e.preventDefault();
          if (!game.paused && !game.gameOver) {
            game.moveLat(1);
          }
          break;

        case 40: // down
        case 83: // S
          e.preventDefault();
          if (!game.paused && !game.gameOver) {
            game.manualDrop();
          }
          break;

        case 16: // SHIFT
        case 38: // up
          e.preventDefault();
          if (!game.paused && !game.gameOver) {
            game.rotate(1);
          }
          break;

        case 87: // W
        case 90: // Z
          e.preventDefault();
          if (!game.paused && !game.gameOver) {
            game.rotate(-1);
          }
          break;

        case 32: // space for hard drop
          e.preventDefault();
          if (!game.paused && game.isPlaying) {
            game.hardDrop();
          }
          break;

        case 9: // tab for shadow
          e.preventDefault();
          if (game.wantShadow && game.isPlaying) {
            game.wantShadow = false;
          } else {
            game.wantShadow = true;
          }
          break;

        default:
          break;
      }
    });
  }

  update(time) {
    const game = this.game;

    if (!game.gameOver) {
      game.draw(this.canvas);
      game.autoDrop(time);

      if (game.paused) return;

      game.increaseDifficulty();
    } else {
      game.draw(this.canvas);
      game.context.font = "1.5px Arial, Helvetica, sans-serif";
      game.context.strokeStyle = "#142143";
      game.context.lineWidth = 0.2;
      game.context.strokeText("Game Over!", 1, 6);
      game.context.font = "1.5px Arial, Helvetica, sans-serif";
      game.context.fillText("Game Over!", 1, 6);

      game.context.font = "0.8px Arial, Helvetica, sans-serif";
      game.context.strokeStyle = "#142143";
      game.context.lineWidth = 0.2;
      game.context.strokeText("ENTER to play again", 1.25, 8);
      game.context.font = "0.8px Arial, Helvetica, sans-serif";
      game.context.fillText("ENTER to play again", 1.25, 8);

      game.gameOver = true;
      game.isPlaying = false;
    }

    requestAnimationFrame(this.update);
  }
}

export default GameView;