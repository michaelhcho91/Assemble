/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _piece__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece */ "./lib/piece.js");


const SHAPES = "IJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOT123"; // lower chance for 123

class Game {
  constructor(player, context, previewCtx) {
    this.player = player;
    this.context = context;
    this.preview = previewCtx;

    this.board = this.createBoard(10, 20);
    this.startTime = 0;
    this.dropInterval = 700;
    this.gameOver = false;
    this.isPlaying = false;
    this.lastTime = 0;
    this.musicPlaying = false;
    this.nextPieceArray = [
      new _piece__WEBPACK_IMPORTED_MODULE_0__["default"]().createPiece(
        SHAPES[Math.floor(Math.random() * SHAPES.length)]
      )
    ];
    this.paused = false;
    this.wantShadow = false;
  }

  autoDrop(time = 0) {
    const ctx = this.context;

    if (this.paused) {
      ctx.font = "1.5px Arial, Helvetica, sans-serif";
      ctx.strokeStyle = "#142143";
      ctx.lineWidth = 0.2;
      ctx.strokeText("Paused", 2.5, 6);
      ctx.font = "1.5px Arial, Helvetica, sans-serif";
      ctx.fillText("Paused", 2.5, 6);
    }
    
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.startTime += deltaTime;

    if (this.startTime > this.dropInterval) {
      this.manualDrop();
    }
  }

  clearRows() {
    let rowsCleared = 0;
    const board = this.board;

    for (let y = board.length - 1; y > 0; y--) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y].every(el => el !== 0)) {
          board.splice(y, 1); // clear row
          board.unshift(new Array(10).fill(0)); // add new empty row

          rowsCleared += 1;
        }
      }
    }

    this.player.score += rowsCleared;
  }

  createBoard(width, height) {
    const board = [];

    for (let i = 0; i < height; i++) {
      board.push(
        new Array(width).fill(0)
      );
    }

    return board;
  }

  draw(canvas) {
    const ctx = this.context;
    const preview = this.preview;
    const nextPiece = this.nextPieceArray[0];
    const player = this.player;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    preview.clearRect(0, 0, 120, 120);
    
    player.drawMatrix( // board
      this.board, {x: 0, y: 0}, ctx
    );

    this.drawShadow(); // shadow
    
    player.drawMatrix( // current piece
      player.matrix, player.position, ctx
    );

    player.drawMatrix( // next piece
      nextPiece, {x: 1, y: 1}, preview
    );
    
    player.drawMatrix( // preview
      this.createBoard(14, 14), {x: 0, y: 0}, preview
    );
  }

  drawShadow() {
    if (!this.wantShadow) return;
    
    const shadow = this.player.matrix;
    const position = this.player.position;
    const ctx = this.context;

    let i = 0;
    while (i < this.board.length) {
      const shadowPosition = {
        x: position.x,
        y: i
      };
      
      if (i > position.y && this.isCollided(shadow, shadowPosition)) {
        
        for (let y = 0; y < shadow.length; y++) {
          for (let x = 0; x < shadow[0].length; x++) {
            if (shadow[y][x] !== 0) {
              ctx.fillStyle = "#BECEEF";
              ctx.fillRect(x + position.x + 0.2, y + i - 0.8, 0.6, 0.6);
            }
          }
        }
        
        break;
      }
      i++;
    }
  }

  generateNextPiece() {
    const player = this.player;
    const piece = new _piece__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const queue = this.nextPieceArray;

    for (let i = 0; queue.length <= 4; i++) {
      const shape = SHAPES[
        Math.floor(SHAPES.length * Math.random())
      ];
      const newPiece = piece.createPiece(shape);

      if (this.isUnique(newPiece)) {
        queue.push(newPiece);
      }
    }
    
    player.matrix = queue.shift(); // set currentPiece to nextPiece
    player.position.x = 3; // back to start position
    player.position.y = 0;
    
    if (this.isCollided(player.matrix, player.position)) {
      this.gameOver = true;
      this.isPlaying = false;
      this.playMusic();
      const gameover = document.getElementById("gameover");
      gameover.volume = 0.1;
      gameover.play();
    }
  }

  hardDrop() {
    const player = this.player;
    
    while (!this.isCollided(player.matrix, player.position)) {
      player.position.y++;
    }

    player.position.y--;
    this.startTime = 9999;
  }
  
  isCollided(piece, position) {
    // const piece = this.player.matrix;
    // const position = player.position;

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[0].length; x++) {
        if (piece[y][x] !== 0) {
          const xOffset = x + position.x;
          const yOffset = y + position.y;

          if (this.isOutOfBounds(xOffset, yOffset) || this.board[yOffset][xOffset] !== 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  isOutOfBounds(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 19) {
      return true;
    }

    return false;
  }

  isUnique(piece) {
    const queue = this.nextPieceArray;

    let result;
    for (let i = 0; i < queue.length; i++) {
      if (JSON.stringify(piece) === JSON.stringify(queue[i])) {
        result = false;
      } else {
        result = true;
      }
    }

    return result;
  }
  
  manualDrop() {
    const player = this.player;
    if (this.paused) return;
    
    player.position.y++;

    if (this.isCollided(player.matrix, player.position)) {
      player.position.y--;

      this.setPiece(this.board, player);
      this.clearRows();
      this.generateNextPiece();
      player.drawPoints();
    }

    this.startTime = 0;
  }

  moveLat(direction) {
    const player = this.player;
    
    player.position.x += direction;

    if (this.isCollided(player.matrix, player.position)) {
      player.position.x -= direction;
    }
  }

  playMusic() {
    const audio = document.getElementById("bg-music");

    if (this.musicPlaying) {
      audio.pause();
      this.musicPlaying = false;
    } else {
      audio.volume = 0.3;
      audio.play();
      this.musicPlaying = true;
    }
  }

  reset() {
    this.gameOver = false;
    this.startTime = 0;
    this.dropInterval = 700;
    this.player.resetScore();
  }
  
  rotate(direction) {
    const player = this.player;
    const matrix = this.player.matrix;
    const position = this.player.position;

    player.transpose(matrix, direction);
    
    let offset = 1;
    while (this.isCollided(player.matrix, player.position)) {
      position.x += offset;

      if (offset > 0) {
        offset = -offset + 1;
      } else {
        offset = -offset + -1;
      }
    }
  }

  setPiece(board, player) {
    const position = player.position;
    const piece = player.matrix;
    
    piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y + position.y][x + position.x] = value; // set piece value to board grid
        }
      });
    });
  }

  start(gameView) {
    if (!this.gameOver && !this.paused) {
      this.board = this.createBoard(10, 20);
      this.reset();
      this.isPlaying = true;
      this.playMusic();
      gameView.update();
    } else if (this.paused) {
      this.paused = false;
      gameView.update();
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Game);

/***/ }),

/***/ "./lib/game_view.js":
/*!**************************!*\
  !*** ./lib/game_view.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
  }

  bindControls() {
    const game = this.game;
    
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 13: // enter to start
          e.preventDefault();

          if (!game.isPlaying || game.gameOver) {
            game.gameOver = false;
            game.start(this);
          }
          break;
          
        case 80: // p for pause
          e.preventDefault();
          
          if (game.paused) {
            game.start(this);
            game.paused = false;
          } else {
            game.paused = true;
          }
          break;

        case 77: // m for mute
          e.preventDefault();

          game.playMusic();
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
        case 90: // Z for other direction
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

      switch (game.player.score) {
        case 8:
          game.dropInterval = 500;
          break;

        case 20:
          game.dropInterval = 300;
          break;

        case 40:
          game.dropInterval = 150;
          break;

        default:
          break;
      }
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
      return;
    }

    requestAnimationFrame(this.update);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (GameView);

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./lib/player.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./lib/game.js");
/* harmony import */ var _game_view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game_view */ "./lib/game_view.js");
/* harmony import */ var _piece__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./piece */ "./lib/piece.js");





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

  const player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"](
    { x: START_X_POS, y: START_Y_POS },
    new _piece__WEBPACK_IMPORTED_MODULE_3__["default"]().createPiece(shape)
  );
  const game = new _game__WEBPACK_IMPORTED_MODULE_1__["default"](
    player,
    context,
    previewCtx
  );
  const gameView = new _game_view__WEBPACK_IMPORTED_MODULE_2__["default"](
    game,
    canvas
  );

  context.font = "1px Arial, Helvetica, sans-serif";
  context.strokeStyle = "#142143";
  context.lineWidth = 0.2;
  context.strokeText("ENTER to play!", 1.6, 6);
  context.strokeText("TAB: toggle shadow", 0.6, 8);
  context.font = "1px Arial, Helvetica, sans-serif";
  context.fillStyle = "#F6F8F8";
  context.fillText("ENTER to play!", 1.6, 6);
  context.fillText("TAB: toggle shadow", 0.6, 8);


  gameView.bindControls();
});

/***/ }),

/***/ "./lib/piece.js":
/*!**********************!*\
  !*** ./lib/piece.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Piece {
  constructor() {
  }
  
  createPiece(shape) {
    switch (shape) {
      case "T":
        return [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ];
      case "O":
        return [
          [2, 2],
          [2, 2]
        ];
      case "L":
        return [
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 3]
        ];
      case "J":
        return [
          [0, 4, 0],
          [0, 4, 0],
          [4, 4, 0]
        ];
      case "I":
        return [
          [0, 5, 0, 0],
          [0, 5, 0, 0],
          [0, 5, 0, 0],
          [0, 5, 0, 0]
        ];
      case "S":
        return [
          [0, 6, 6],
          [6, 6, 0],
          [0, 0, 0]
        ];
      case "Z":
        return [
          [7, 7, 0],
          [0, 7, 7],
          [0, 0, 0]
        ];
      case "1":
        return [
          [0, 0, 0],
          [0, 8, 0],
          [0, 0, 0]
        ];
      case "2":
        return [
          [9, 0],
          [0, 9]
        ];
      case "3":
        return [
          [10, 0, 0],
          [0, 10, 0],
          [0, 0, 10]
        ];
      default:
        break;
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Piece);

/***/ }),

/***/ "./lib/player.js":
/*!***********************!*\
  !*** ./lib/player.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const COLORS = [
  null,
  "red", // T
  "green", // O
  "purple", // L
  "blue", // J
  "yellow", // I
  "orange", // S
  "pink", // Z
  "black", // 1
  "white", // 2
  "silver" // 3
];

class Player {
  constructor(position, matrix) {
    this.position = position;
    this.matrix = matrix;
    this.score = 0;
  }

  drawPoints() {
    const score = document.getElementById("score");
    score.innerText = this.score;
  }
  
  drawMatrix(matrix, position, context) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) { // color pieces
          context.strokeStyle = "#BECEEF";
          context.lineWidth = 0.08;
          context.strokeRect(x + position.x, y + position.y, 1, 1);
          context.fillStyle = COLORS[value];
          context.fillRect(x + position.x, y + position.y, 1, 1);
        } else if (value === 0) { // draw board grid
          context.strokeStyle = "#BECEEF";
          context.lineWidth = 0.04;
          context.strokeRect(x + position.x, y + position.y, 1, 1);
        }
      });
    });
  }

  resetScore() {
    const gamestart = document.getElementById("gamestart");
    gamestart.volume = 0.3;
    gamestart.play();
    
    this.score = 0;
    this.drawPoints();
  }

  transpose(matrix, direction) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; // transpose
      }
    }

    if (direction > 0) { // rotate other direction
      matrix.forEach(row => {
        row.reverse();
      });
    } else {
      matrix.reverse();
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map