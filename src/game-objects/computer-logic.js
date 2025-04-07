// import { BoardState } from "./board-state";
// import { PieceCoordinates } from "./piece-coordinates";
import {
	PLAYER,
	COMPUTER,
	KING,
	QUEEN,
	BISHOP,
	KNIGHT,
	ROOK,
	PAWN,
	PAWN_VALUE,
	KNIGHT_VALUE,
	BISHOP_VALUE,
	ROOK_VALUE,
	QUEEN_VALUE,
	KING_VALUE,
	CAPTURE_WEIGHT,
	THREATEN_WEIGHT,
	DEPTH_LIMIT,
} from "./constants";
// LOSS_WEIGHT,
import {EventBus} from "../game/EventBus.js";
import {BoardStateLite} from "./board-mockups";

// const MIN = 0; // if level % 2 = 0, its a min level
// const MAX = 1; // if level % 2 = 1, its a max level
// const LIMIT = 4; // depth of search

export class ChessGameState {
	board;
	pieceCoordinates;

	constructor(BoardState) {
		if (BoardState) {
			this.boardState = BoardState;
			this.pieceCoordinates = BoardState.getPieceCoordinates();
		} else {
			this.pieceCoordinates;
		}
		// makes linter not complain about unused BoardStateLite import
		// Workaround oriented programming at its finest
		this.CreateAnotherBoardStateLite();
	}

	// Find the best move using min-max algorithm
	getBestMove() {
		let bestMove = [100000];
		let currentMove;

		// console.log(this.pieceCoordinates);
		console.log(this.boardState.getPieceCoordinates().getAllCoordinates(COMPUTER));
		// all computer coordinates
		const pieceDict = this.pieceCoordinates.getAllCoordinates(COMPUTER);
		// for each piece
		for (const piece in pieceDict) {
			// find all moves
			const moves = this.boardState.searchMoves(pieceDict[piece][0], pieceDict[piece][1]);
			// all possible moves for a piece
			for (const move in moves) {
				// console.log(pieceDict[piece], moves[move]);
				currentMove = this.computerMove(this.boardState.cloneBoardState(), pieceDict[piece], moves[move], 0); // get score for board
				if (currentMove[0] < bestMove[0]) {
					bestMove = currentMove;
				}
			}
		}
		// make chosen move
		console.log("The Move: ", bestMove[1], bestMove[2], bestMove[3]);
		this.sendMove(bestMove[1], bestMove[2], bestMove[3]);
	}
	// sends an event specifying the move as the computer's.
	// Event handle in ChessTiles is created to listen for the event
	// and make the move on the board
	sendMove(input, output, capture = false) {
		// console.log(input, output);
		EventBus.emit("ComputerMove", [input, output, capture]);
	}

	playerMove(boardState, input, move, depth) {
		// console.log("Move: ", input, move);
		if (move["isEnemy"] == true) {
			// if a capture, remove the piece that is captured
			boardState.destroyPiece(move["xy"][0], move["xy"][1]);
		}
		boardState.movePiece(input, move["xy"]); // make the move

		let bestMove = [-100000];
		let currentMove;

		const pieceDict = boardState.getPieceCoordinates().getAllCoordinates(PLAYER);
		// for each piece
		for (const piece in pieceDict) {
			// find all moves
			const moves = boardState.searchMoves(pieceDict[piece][0], pieceDict[piece][1]);
			// all possible moves for a piece
			// console.log("moves:", moves);
			for (const move in moves) {
				// console.log(moves[move]);
				if (depth < DEPTH_LIMIT) {
					this.computerMove(boardState.cloneBoardState(), pieceDict[piece], moves[move], depth + 1); // calculate possible computer moves
				} else {
					currentMove = this.evaluateBoard(boardState.cloneBoardState(), pieceDict[piece], moves[move]); // get score for board
					if (currentMove[0] > bestMove[0]) {
						bestMove = currentMove;
					}
				}
			}
		}
		return bestMove;
	}

	computerMove(boardState, input, move, depth) {
		// console.log("Move: ", input, move);
		if (move["isEnemy"] == true) {
			// if a capture, remove the piece that is captured
			boardState.destroyPiece(move["xy"][0], move["xy"][1]);
		}
		boardState.movePiece(input, move["xy"]); // make the move

		const pieceDict = boardState.getPieceCoordinates().getAllCoordinates(COMPUTER);
		// for each piece
		let bestMove = [100000];
		let currentMove;

		for (const piece in pieceDict) {
			// find all moves
			const moves = boardState.searchMoves(pieceDict[piece][0], pieceDict[piece][1]);
			// all possible moves for a piece
			// console.log("moves:", moves);
			for (const move in moves) {
				// console.log(moves[move]);
				if (depth < DEPTH_LIMIT) {
					this.playerMove(boardState.cloneBoardState(), pieceDict[piece], moves[move], depth + 1); // calculate possible computer moves
				} else {
					currentMove = this.evaluateBoard(boardState.cloneBoardState(), pieceDict[piece], moves[move]); // get score for board
					if (currentMove[0] < bestMove[0]) {
						bestMove = currentMove;
					}
				}
			}
		}
		return bestMove;
	}

	// determines score of a board, lower is better for computer
	evaluateBoard(boardState, input, move) {
		// console.log("Move: ", input, move);
		if (move["isEnemy"] == true) {
			// console.log(move);
			// if a capture, remove the piece that is captured
			boardState.destroyPiece(move["xy"][0], move["xy"][1]);
		}
		boardState.movePiece(input, move["xy"]); // make the move
		let score = 0; // initialize score
		let threatenedPlayer;
		let threatenedComputer;

		// get total value of player material - 0.01*value of player material threatened
		let coordinates = boardState.getPieceCoordinates().getAllCoordinates(PLAYER);
		// console.log(coordinates);
		coordinates.forEach((piece) => {
			// console.log("Piece: ", piece);
			// console.log(boardState.getBoardState()[piece[0]][piece[1]]);
			// console.log(piece, this.boardState.getRank(piece[0],piece[1]));
			threatenedComputer = boardState.seekThreats(piece[0], piece[1], COMPUTER); // player pieces protecting the given piece
			threatenedPlayer = boardState.seekThreats(piece[0], piece[1], PLAYER); // computer pieces threatening the chosen piece
			switch (boardState.getBoardState()[piece[0]][piece[1]].getRank()) {
				case PAWN:
					score += PAWN_VALUE * CAPTURE_WEIGHT;
					score += PAWN_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= PAWN_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // enemy each threatening it
					break;
				case ROOK:
					score += ROOK_VALUE * CAPTURE_WEIGHT;
					score += ROOK_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= ROOK_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case BISHOP:
					score += BISHOP_VALUE * CAPTURE_WEIGHT;
					score += BISHOP_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= BISHOP_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case KNIGHT:
					score += KNIGHT_VALUE * CAPTURE_WEIGHT;
					score += KNIGHT_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= KNIGHT_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case QUEEN:
					score += QUEEN_VALUE * CAPTURE_WEIGHT;
					score += QUEEN_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= QUEEN_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case KING:
					score += KING_VALUE * CAPTURE_WEIGHT;
					// score += KING_VALUE * THREATEN_WEIGHT * threatenedComputer.length; // friendly pieces threatening the king don't matter
					score -= KING_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
			}
		});

		// console.log("score:", score);
		// subtract value of computer material * capture weight and add threatenweight*piece value for each
		// threatened computer piece

		// for (piece in this.pieceCoordinates[COMPUTER]) {
		// 	for (const rank of [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN]) {
		// 		// for all types of computer pieces
		// 		for (const count of rank) {
		// 			// for each player piece of a given rank
		// 			switch (rank) {
		// 				case PAWN:
		// 					score -= PAWN_VALUE * CAPTURE_WEIGHT;
		// 					threatenedPlayer = boardState.seekThreats(count[0], count[1], COMPUTER);
		// 					score += PAWN_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // enemy each threatening it
		// 					break;
		// 				case ROOK:
		// 					score -= ROOK_VALUE * CAPTURE_WEIGHT;
		// 					threatenedPlayer = boardState.seekThreats(count[0], count[1], COMPUTER);
		// 					score += ROOK_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
		// 					break;
		// 				case BISHOP:
		// 					score += BISHOP_VALUE * CAPTURE_WEIGHT;
		// 					threatenedPlayer = boardState.seekThreats(count[0], count[1], COMPUTER);
		// 					score += BISHOP_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
		// 					break;
		// 				case KNIGHT:
		// 					score -= KNIGHT_VALUE * CAPTURE_WEIGHT;
		// 					threatenedPlayer = boardState.seekThreats(count[0], count[1], COMPUTER);
		// 					score += KNIGHT_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
		// 					break;
		// 				case QUEEN:
		// 					score -= QUEEN_VALUE * CAPTURE_WEIGHT;
		// 					threatenedPlayer = boardState.seekThreats(count[0], count[1], COMPUTER);
		// 					score += QUEEN_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
		// 					break;
		// 				case KING:
		// 					score -= KING_VALUE * CAPTURE_WEIGHT;
		// 					threatenedPlayer = boardState.seekThreats(count[0], count[1], COMPUTER);
		// 					score += KING_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
		// 					break;
		// 			}
		// 		}
		// 	}
		// }

		return [score, input, move["xy"], move["isEnemy"]];

		// if (score < this.bestValue) {
		// 	// if move is better than current best move
		// 	console.log("Move for finding best: ", move);
		// 	this.bestValue = score;
		// 	this.bestMoveInput = input;
		// 	this.bestMoveOutput = move["xy"];
		// 	this.bestMoveCapture = move["isEnemy"];
		// }
	}

	// gets a random legal move
	getRandomMove() {
		let pieceFound = false;

		const coordinates = this.pieceCoordinates.getAllCoordinates(COMPUTER);
		// console.log(this.pieceCoordinates);
		let pieceToMove;
		let moves;

		while (!pieceFound) {
			pieceToMove = this.getRandomInt(0, coordinates.length); // get random piece

			// console.log(coordinates);

			// check if it has legal moves
			if (this.boardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]).length) {
				// if has legal move, break loop
				pieceFound = true;
			}
		}
		moves = this.boardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]);
		const move = this.getRandomInt(0, moves.length); // select random legal move that piece can make
		this.sendMove(coordinates[pieceToMove], moves[move]["xy"], moves[move]["isEnemy"]); // make the move
	}

	getRandomInt(min, max) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
	}

	// This is mainly to appease the linter, and doesn't do anything
	CreateAnotherBoardStateLite() {
		new BoardStateLite(this.getPieceCoordinates);
		return;
	}
}
