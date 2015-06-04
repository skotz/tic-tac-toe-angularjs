// Scott Clayton 2015
(function(){
	var app = angular.module('tictactoe', [ ]);
	
	app.controller('GameController', function () {
		this.startNewGame = function () {
			this.player = 'X';
			this.board = initialBoard;
			this.status = 'Ready to play!';
			this.eval = 0;
			this.nodes = 0;
			this.newGame = true;
		};
		this.startNewGame();
		
		this.makeMove = function (square, allowComputer) { 
			this.newGame = false;
			allowComputer = typeof allowComputer !== 'undefined' ? allowComputer : true;
			
			var winner = getWinner(this.board);
			if (getSquare(this.board, square) == emptySquare && winner == emptySquare) {
				this.board = setSquare(this.board, square, this.player);
				this.player = this.player == 'X' ? 'O' : 'X';
				
				if ((winner = getWinner(this.board)) != emptySquare) {
					this.status = winner + ' wins!';
				} else if (!isFull(this.board)) {
					if (allowComputer) {
						nodes = 0;
						var best = getBestMove(this.board, this.player);
						this.eval = best.eval;
						this.nodes = nodes;
						this.makeMove(best.square, false);
					}
				} else {
					this.status =  'It\'s a draw!';
				}
			}
		};
		
		this.makeComputerPlay = function () {
			if (isEmpty(this.board) && this.player == 'X') {
				// The corner is known to be the best opening move
				this.makeMove(8, false);
			} else if (!isFull(this.board)) {
				nodes = 0;
				var best = getBestMove(this.board, this.player);
				this.eval = best.eval;
				this.nodes = nodes;
				this.makeMove(best.square, false);
			}
		};
	});
	
	var nodes;
	
	var getBestMove = function (board, sideToMove) {
		nodes++;
		var winner = getWinner(board);
		if (winner != emptySquare) {
			return { eval: winner == 'X' ? 100 : -100, square: -1, depth: 0 };
		}

		if (isFull(board)) {
			return { eval: 0, square: -1, depth: 0 }
		}

		var best = { eval: sideToMove == 'X' ? -1000000 : 1000000, square: -1, depth: 0 };
		var test;

		for (var i = 0; i < 9; i++) {
			if (getSquare(board, i) == emptySquare) {
				var copy = board;
				copy = setSquare(copy, i, sideToMove);
				test = getBestMove(copy, sideToMove == 'X' ? 'O' : 'X');

				if (sideToMove == 'X') {
					if (test.eval - test.depth > best.eval) {
						best.square = i;
						best.eval = test.eval - test.depth;
						best.depth = test.depth + 1;
					}
				} else {
					if (test.eval + test.depth < best.eval) {
						best.square = i;
						best.eval = test.eval + test.depth;
						best.depth = test.depth + 1;
					}
				}
			}
		}

		return best;
	};
		
	var isFull = function (board) {
		return !board.match(new RegExp(emptySquare, 'gi'));
	};	
	
	var isEmpty = function (board) {
		return board == initialBoard;
	};
	
	var getWinner = function (board) {
		// Horizontal
		for (var i = 0; i < 3; i++) {
			if (isTriplet(board, i * 3 + 0, i * 3 + 1, i * 3 + 2)) {
				return getSquare(board, i * 3 + 0);
			}
		}
		
		// Vertical
		for (var i = 0; i < 3; i++) {
			if (isTriplet(board, i, i + 3, i + 6)) {
				return getSquare(board, i);
			}
		}
		
		// Diagonal
		if (isTriplet(board, 0, 4, 8) || isTriplet(board, 2, 4, 6)) {
			return getSquare(board, 4);
		}
		
		return emptySquare;
	};
	
	var isTriplet = function (board, square1, square2, square3) {
		return getSquare(board, square1) != emptySquare && getSquare(board, square1) == getSquare(board, square2) && getSquare(board, square2) == getSquare(board, square3);
	};
	
	var setSquare = function (board, square, player) {
		return board.substr(0, square) + player + board.substr(square + 1);
	};
	
	var getSquare = function (board, square) {
		return board.charAt(square);
	};
	
	var emptySquare = ' ';
	
	var initialBoard = emptySquare + emptySquare + emptySquare + emptySquare + emptySquare + emptySquare + emptySquare + emptySquare + emptySquare;
})();