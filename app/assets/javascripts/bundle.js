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
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./lib/player.js");



class Game {
  constructor(player, context) {
    this.player = player;
    this.context = context;

    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;

    this.drop = this.drop.bind(this);
    this.draw = this.draw.bind(this);
    this.playerDrop = this.playerDrop.bind(this);
  }

  draw(canvas) {
    const piece = new _piece__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const c = this.context;
    c.clearRect(0, 0, canvas.width, canvas.height);
    // c.fillStyle = "#000";
    // c.fillRect(0, 0, canvas.width, canvas.height);
    
    piece.drawPiece(
      this.player.matrix, this.player.position, c
    );
  }

  playerDrop() {
    this.player.position.y++;
    this.dropCounter = 0;
  }

  drop(time) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.playerDrop();
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
/* harmony import */ var _piece__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece */ "./lib/piece.js");


class GameView {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.update = this.update.bind(this);
    this.drawBoard = this.drawBoard.bind(this);
    this.bindControls = this.bindControls.bind(this);
  }

  drawBoard(canvas) {
    this.game.draw(canvas);
  }

  update(time = 0) {
    this.game.drop(time);
    this.drawBoard(this.canvas);
    requestAnimationFrame(this.update);
  }

  bindControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 37:
          this.game.player.position.x--;
          break;
        case 39:
          this.game.player.position.x++;
          break;
        case 40:
          this.game.playerDrop();
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





document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 360;
  canvas.height = 600;

  context.scale(30, 30);

  const matrix = new _piece__WEBPACK_IMPORTED_MODULE_3__["default"]().createPiece("L");
  const player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"](
    { x: 3, y: 3 },
    matrix
  );
  const game = new _game__WEBPACK_IMPORTED_MODULE_1__["default"](
    player,
    context
  );
  const gameView = new _game_view__WEBPACK_IMPORTED_MODULE_2__["default"](game, canvas);

  gameView.bindControls();
  gameView.update();
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
const COLORS = [
  null,
  "#167F39",
  "#DE264C",
  "#0074D9",
  "#FA5B0F",
  "#FFDC00",
  "#D40D12",
  "#25064C",
  "#63A69F",
  "#F2E1AC",
  "#F2836B"
];

class Piece {
  constructor() {
    this.createPiece = this.createPiece.bind(this);
    this.drawPiece = this.drawPiece.bind(this);
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

  drawPiece(matrix, offset, context) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = COLORS[value];
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
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
class Player {
  constructor(position, matrix) {
    this.position = position;
    this.matrix = matrix;
  }


}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map