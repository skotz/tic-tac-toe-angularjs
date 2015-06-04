// Scott Clayton 2015
(function(){
	var app = angular.module('tictactoe', [ ]);
	
	app.controller('GameController', function () {
		this.startNewGame = function () {
			this.player = 'X';
			this.board = copyBoard(initialBoard);
			this.status = 'Ready to play!';
			this.eval = 0;
			this.nodes = 0;
			this.newGame = true;
		};
		this.startNewGame();
		
		this.makeMove = function (row, column, allowComputer) { 
			this.newGame = false;
			allowComputer = typeof allowComputer !== 'undefined' ? allowComputer : true;
			var winner = getWinner(this.board);
			if (this.board.rows[row].squares[column] == emptySquare && winner == emptySquare) {
				this.board.rows[row].squares[column] = this.player;
				this.player = this.player == 'X' ? 'O' : 'X';
				
				if ((winner = getWinner(this.board)) != emptySquare) {
					this.status = winner + ' wins!';
				} else if (!isFull(this.board)) {
					if (allowComputer) {
						nodes = 0;
						var best = getBestMove(this.board, this.player);
						this.eval = best.eval;
						this.nodes = nodes;
						this.makeMove(best.row, best.col, false);
					}
				} else {
					this.status =  'It\'s a draw!';
				}
			}
		};
		
		this.makeComputerPlay = function () {
			if (isEmpty(this.board) && this.player == 'X') {
				// The corner is known to be the best opening move
				this.makeMove(2, 2, false);
			} else if (!isFull(this.board)) {
				nodes = 0;
				var best = getBestMove(this.board, this.player);
				this.eval = best.eval;
				this.nodes = nodes;
				this.makeMove(best.row, best.col, false);
			}
		};
	});
	
	var nodes;
	
	var getBestMove = function (board, sideToMove) {
		nodes++;
		var winner = getWinner(board);
		if (winner != emptySquare) {
			return { eval: winner == 'X' ? 100 : -100, row: -1, col: -1, depth: 0 };
		}

		if (isFull(board)) {
			return { eval: 0, row: -1, col: -1, depth: 0 }
		}

		var best = { eval: sideToMove == 'X' ? -1000000 : 1000000, row: -1, col: -1, depth: 0 };
		var test;

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (board.rows[i].squares[j] == emptySquare) {
					var copy = copyBoard(board);
					copy.rows[i].squares[j] = sideToMove;

					test = getBestMove(copy, sideToMove == 'X' ? 'O' : 'X');

					if (sideToMove == 'X') {
						if (test.eval - test.depth > best.eval) {
							best.row = i;
							best.col = j;
							best.eval = test.eval - test.depth;
							best.depth = test.depth + 1;
						}
					} else {
						if (test.eval + test.depth < best.eval) {
							best.row = i;
							best.col = j;
							best.eval = test.eval + test.depth;
							best.depth = test.depth + 1;
						}
					}
				}
			}
		}

		return best;
	};
	
	var copyBoard = function (board) {
		return {
			rows: [
				{ squares: { 0: board.rows[0].squares[0], 1: board.rows[0].squares[1], 2: board.rows[0].squares[2] } }, 
				{ squares: { 0: board.rows[1].squares[0], 1: board.rows[1].squares[1], 2: board.rows[1].squares[2] } }, 
				{ squares: { 0: board.rows[2].squares[0], 1: board.rows[2].squares[1], 2: board.rows[2].squares[2] } }]
		};
	};
	
	var isFull = function (board) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (board.rows[i].squares[j] == emptySquare) {
					return false;
				}
			}
		}

		return true;
	};	
	
	var isEmpty = function (board) {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				if (board.rows[i].squares[j] != emptySquare) {
					return false;
				}
			}
		}

		return true;
	};
	
	var getWinner = function (board) {
		// Horizontal
		if (board.rows[0].squares[0] != emptySquare && board.rows[0].squares[0] == board.rows[0].squares[1] && board.rows[0].squares[1] == board.rows[0].squares[2]) {
			return board.rows[0].squares[0];
		}
		if (board.rows[1].squares[0] != emptySquare && board.rows[1].squares[0] == board.rows[1].squares[1] && board.rows[1].squares[1] == board.rows[1].squares[2]) {
			return board.rows[1].squares[0];
		}
		if (board.rows[2].squares[0] != emptySquare && board.rows[2].squares[0] == board.rows[2].squares[1] && board.rows[2].squares[1] == board.rows[2].squares[2]) {
			return board.rows[2].squares[0];
		}
		
		// Vertical
		if (board.rows[0].squares[0] != emptySquare && board.rows[0].squares[0] == board.rows[1].squares[0] && board.rows[1].squares[0] == board.rows[2].squares[0]) {
			return board.rows[0].squares[0];
		}
		if (board.rows[0].squares[1] != emptySquare && board.rows[0].squares[1] == board.rows[1].squares[1] && board.rows[1].squares[1] == board.rows[2].squares[1]) {
			return board.rows[0].squares[1];
		}
		if (board.rows[0].squares[2] != emptySquare && board.rows[0].squares[2] == board.rows[1].squares[2] && board.rows[1].squares[2] == board.rows[2].squares[2]) {
			return board.rows[0].squares[2];
		}
		
		// Diagonal
		if (board.rows[0].squares[0] != emptySquare && board.rows[0].squares[0] == board.rows[1].squares[1] && board.rows[1].squares[1] == board.rows[2].squares[2]) {
			return board.rows[0].squares[0];
		}
		if (board.rows[2].squares[0] != emptySquare && board.rows[2].squares[0] == board.rows[1].squares[1] && board.rows[1].squares[1] == board.rows[0].squares[2]) {
			return board.rows[2].squares[0];
		}
		
		return emptySquare;
	};
	
	var emptySquare = ' ';
	
	var initialBoard = {
		rows: [
			{ squares: { 0: emptySquare, 1: emptySquare, 2: emptySquare } }, 
			{ squares: { 0: emptySquare, 1: emptySquare, 2: emptySquare } }, 
			{ squares: { 0: emptySquare, 1: emptySquare, 2: emptySquare } }]
	};
})();