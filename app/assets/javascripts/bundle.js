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


const SHAPES = "IJLSZOTIJLSZOTIJLSZOTIJLSZOTIJLSZOT123";

class Game {
  constructor(player, context, previewCtx) {
    this.player = player;
    this.context = context;
    this.previewCtx = previewCtx;

    this.board = this.createBoard(10, 20);
    this.dropCounter = 0;
    this.dropInterval = 700;
    this.gameOver = false;
    this.isPlaying = false;
    this.lastTime = 0;
    this.nextPiece = [new _piece__WEBPACK_IMPORTED_MODULE_0__["default"]().createPiece(
      SHAPES[Math.floor(Math.random() * SHAPES.length)]
    )];
    this.paused = false;
  }

  autoDrop(time = 0) {
    const ctx = this.context;

    if (this.paused) {
      // ctx.font = "1.5px Georgia";
      // ctx.strokeStyle = "black";
      // ctx.lineWidth = 0.2;
      // ctx.strokeText("Paused", 1, 6);

      // ctx.font = "1.5px Georgia";
      // ctx.fillStyle = 0.2;
      // ctx.fillText("Paused", 1, 6);
      return;
    }
    
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.manualDrop();
    }
  }

  createBoard(width, height) {
    const board = [];

    while (height--) { // while truthy, decrement
      board.push(
        new Array(width).fill(0)
      );
    }

    return board;
  }

  draw(canvas) {
    const ctx = this.context;
    const previewCtx = this.previewCtx;
    const nextPiece = this.nextPiece[0];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    previewCtx.clearRect(0, 0, 120, 120);
    
    this.player.drawMatrix( // board
      this.board, {x: 0, y: 0}, ctx
    );
    
    this.player.drawMatrix( // current piece
      this.player.matrix, this.player.position, ctx
    );
    
    this.player.drawMatrix( // preview
      this.createBoard(12, 12), {x: 0, y: 0}, previewCtx
    );

    this.player.drawMatrix( // next piece
      nextPiece, {x: 0, y: 0}, previewCtx
    );
  }

  generateNext() {
    const piece = new _piece__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const shape = SHAPES[
      Math.floor(SHAPES.length * Math.random())
    ];

    this.nextPiece.push(piece.createPiece(shape)); // generate new nextPiece

    this.player.matrix = this.nextPiece.shift(); // set currentPiece to nextPiece
    this.player.position.x = 3; // back to start position
    this.player.position.y = 0;
    
    if (this.isCollided(this.board, this.player)) {
      this.gameOver = true;
      this.isPlaying = false;
      // this.board.forEach(row => row.fill(0));
      // render game over screen
    }
  }
  
  // hardDrop() {
  //   while (!this.isCollided(this.board, this.player)) {
  //     this.manualDrop();
  //   }
  // }
  
  isCollided(board, player) {
    const [matrix, position] = [player.matrix, player.position];

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const pieceEdge = matrix[y][x];
        const boardEdge = (board[y + position.y] && board[y + position.y][x + position.x]);

        if (pieceEdge !== 0 && boardEdge !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  manualDrop() {
    if (this.paused) return;
    
    this.player.position.y++;

    if (this.isCollided(this.board, this.player)) {
      this.player.position.y--;
      this.setPiece(this.board, this.player);
      this.generateNext();
    }

    this.dropCounter = 0;
  }

  setPiece(board, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y + player.position.y][x + player.position.x] = value;
        }
      });
    });
  }

  moveLat(direction) {
    this.player.position.x += direction;

    if (this.isCollided(this.board, this.player)) { // check wall collision
      this.player.position.x -= direction;
    }
  }

  playerRotate(direction) {
    this.rotate(this.player.matrix, direction);
    const currentPosition = this.player.position.x;
    let position = 1;

    while (this.isCollided(this.board, this.player)) {
      this.player.position.x += position;

      if (position > 0) {
        position = -position + 1;
      } else {
        position = -position + -1;
      }

      if (position > this.player.matrix[0].length) {
        this.rotate(this.player.matrix, -direction);
        this.player.position.x = currentPosition;
        return;
      }
    }
  }
  
  rotate(matrix, direction) {
    for(let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; // transpose
      }
    }

    if (direction > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  start(gameView) {
    if (!this.gameOver && !this.paused) {
      this.board = this.createBoard(10, 20);
      
      this.gameOver = false;
      this.isPlaying = true;
      this.dropCounter = 0;

      gameView.update();
    } else if (this.paused) {
      this.paused = false;
      gameView.update();
    }

    // if (this.player.score >= 200) { // increase difficulty
    //   this.dropInterval -= 100;
    // }
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

  drawBoard() {
    this.game.draw(this.canvas);
  }

  update(time) {
    const g = this.game;

    if (g.paused) return;

    if (!g.gameOver) {
      g.context.clearRect(0, 0, canvas.width, canvas.height);

      this.drawBoard();
      g.autoDrop(time);
    } else {
      g.context.font = "1.5px Georgia";
      g.context.strokeStyle = "#142143";
      g.context.lineWidth = 0.2;
      g.context.strokeText("Game Over!", 1, 6);
      
      g.context.font = "1.5px Georgia";
      g.context.fillStyle = "white";
      g.context.fillText("Game Over!", 1, 6);

      g.gameOver = true;
      g.isPlaying = false;
      return;
    }

    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 13: // enter to start
          e.preventDefault();
          if (!this.game.isPlaying) {
            this.game.gameOver = false;
            this.game.start(this);
          }
          break;
          
        case 80: // p for pause
          if (this.game.paused) {
            this.game.start(this);
          } else {
            this.game.paused = true;
          }
          break;

        case 77:
          // m for mute, maybe
          break;
        
        case 37: // left
        case 65: // A
          e.preventDefault();
          if (!this.game.paused) {
            this.game.moveLat(-1);
          }
          break;

        case 39: // right
        case 68: // D
          e.preventDefault();
          if (!this.game.paused) {
            this.game.moveLat(1);
          }
          break;

        case 40: // down
        case 83: // S
          e.preventDefault();
          if (!this.game.paused) {
            this.game.manualDrop();
          }
          break;

        case 16: // SHIFT
        case 38: // up
        case 87: // W
          e.preventDefault();
          if (!this.game.paused) {
            this.game.playerRotate(-1);
          }
          break;

        case 32: // space
          e.preventDefault();
          if (!this.game.paused) {
            // this.game.hardDrop();
            // space for hard drop
          }
          break;

        default:
          break;
      }
    });
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
const PREVIEW_WIDTH = 120;
const PREVIEW_HEIGHT = 120;
const START_X_POS = 3;
const START_Y_POS = 0;
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
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0]
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
          [8]
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

  drawMatrix(matrix, position, context) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) { // color pieces
          context.strokeStyle = "#BECEEF";
          context.lineWidth = 0.04;
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
}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map