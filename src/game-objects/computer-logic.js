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
} from "./constants";
// LOSS_WEIGHT,
import {EventBus} from "../game/EventBus.js";

// const MIN = 0; // if level % 2 = 0, its a min level
// const MAX = 1; // if level % 2 = 1, its a max level
// const LIMIT = 4; // depth of search

export class ChessGameState {
	board;
	pieceCoordinates;
	bestValue;
	bestMoveInput;
	bestMoveOutput;
	theBoardState;

	constructor(boardState) {
		if (boardState) {
			this.theBoardState = boardState;
			this.board = boardState.getBoardState();
			this.pieceCoordinates = boardState.getPieceCoordinates();
			this.bestValue = 10000; // want lowest possible value. Dummy initialization value
		} else {
			this.bestValue = 10000;
			this.pieceCoordinates;
		}
	}

	// THIS DOES NOT WORK, DO NOT USE IT UNTIL FIXED.
	getBestMove() {
		console.log(this.pieceCoordinates.getCoordinates()[COMPUTER]);
		const pieceDict = this.pieceCoordinates.getCoordinates()[COMPUTER];
		for (const piece in pieceDict) {
			for (const coordinates in pieceDict[piece]) {
				console.log(pieceDict[piece][coordinates]);
			}
			for (const coordinates of pieceDict[piece]) {
				// for each computer piece of a given rank
				console.log(coordinates);
				const moves = this.theBoardState.searchMoves(1, 1);
				// all possible moves for a piece
				console.log("moves:");
				for (const move in moves) {
					console.log(moves[move]);
					this.evaluateBoard(this.theBoardState, [1, 1], moves[0]["xy"]); // get score for board
				}
			}
		}
		// make chosen move
		this.sendMove(this.bestMoveInput, this.bestMoveOutput);
	}
	// sends an event specifying the move as the computer's.
	// Event handle in ChessTiles is created to listen for the event
	// and make the move on the board
	sendMove(input, output, capture = false) {
		// console.log(input, output);
		EventBus.emit("ComputerMove", [input, output, capture]);
	}

	// determines score of a board, lower is better for computer
	evaluateBoard(boardState, input, output) {
		boardState.movePiece(input, output); // make the move
		// console.log(boardState, input,output);
		let score = 0; // initialize score
		let threatened;
		// get total value of player material - 0.01*value of player material threatened
		for (piece in this.pieceCoordinates[PLAYER]) {
			for (const rank of [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN]) {
				// for all types of computer pieces
				for (const count of rank) {
					// for each player piece of a given rank
					switch (rank) {
					    case PAWN:
						    score += PAWN_VALUE;
						    threatened = boardState.seekThreats(count[0], count[1], PLAYER);
    						score -= PAWN_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
						    break;
				    	case ROOK:
					    	score += ROOK_VALUE;
				    		threatened = boardState.seekThreats(count[0], count[1], PLAYER);
			    			score -= ROOK_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
		    				break;
	    				case BISHOP:
    						score += BISHOP_VALUE;
						    threatened = boardState.seekThreats(count[0], count[1], PLAYER);
					    	score -= BISHOP_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
				    		break;
			    		case KNIGHT:
		    				score += KNIGHT_VALUE;
	    					threatened = boardState.seekThreats(count[0], count[1], PLAYER);
    						score -= KNIGHT_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
						    break;
					    case QUEEN:
						    score += QUEEN_VALUE;
					    	threatened = boardState.seekThreats(count[0], count[1], PLAYER);
				    		score -= QUEEN_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
			    			break;
		    			case KING:
	    					score += KING_VALUE;
    						threatened = boardState.seekThreats(count[0], count[1], PLAYER);
						    score -= KING_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
					    	break;
					}
				}
			}
		}

		// subtract value of computer material * capture weight and add threatenweight*piece value for each
		// threatened computer piece
		for (piece in this.pieceCoordinates[COMPUTER]) {
			for (const rank of [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN]) {
				// for all types of computer pieces
				for (const count of rank) {
					// for each player piece of a given rank
					switch (rank) {
						case PAWN:
							score -= PAWN_VALUE * CAPTURE_WEIGHT;
							threatened = boardState.seekThreats(count[0], count[1], COMPUTER);
							score += PAWN_VALUE * THREATEN_WEIGHT * threatened.length; // enemy each threatening it
							break;
						case ROOK:
							score -= ROOK_VALUE * CAPTURE_WEIGHT;
							threatened = boardState.seekThreats(count[0], count[1], COMPUTER);
							score += ROOK_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
							break;
						case BISHOP:
							score += BISHOP_VALUE * CAPTURE_WEIGHT;
							threatened = boardState.seekThreats(count[0], count[1], COMPUTER);
							score += BISHOP_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
							break;
						case KNIGHT:
							score -= KNIGHT_VALUE * CAPTURE_WEIGHT;
							threatened = boardState.seekThreats(count[0], count[1], COMPUTER);
							score += KNIGHT_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
							break;
						case QUEEN:
							score -= QUEEN_VALUE * CAPTURE_WEIGHT;
							threatened = boardState.seekThreats(count[0], count[1], COMPUTER);
							score += QUEEN_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
							break;
						case KING:
							score -= KING_VALUE * CAPTURE_WEIGHT;
							threatened = boardState.seekThreats(count[0], count[1], COMPUTER);
							score += KING_VALUE * THREATEN_WEIGHT * threatened.length; // each piece threatening it
							break;
					}
				}
			}
		}

		if (score < this.bestValue) {
			// if move is better than current best move
			this.bestValue = score;
			this.bestMoveInput = input;
			this.bestMoveOutput = output;
		}
	}

	// gets a random move
	getRandomMove() {
		let pieceFound = false;

		const coordinates = this.pieceCoordinates.getAllCoordinates(COMPUTER);
		// console.log(this.pieceCoordinates);
		let pieceToMove;
		let moves;

		while (!pieceFound) {
			pieceToMove = this.getRandomInt(0, coordinates.length - 1); // get random piece
			// console.log(this.theBoardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]));
			// let theMoves = this.theBoardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]);
			// console.log(theMoves);
			if (this.theBoardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]).length) {
				// check if it has legal moves

				pieceFound = true;
			}
		}
		moves = this.theBoardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]);
		const move = this.getRandomInt(0, moves.length - 1); // select random legal move that piece can make
		// console.log("Moves", moves[move]);

		// console.log(coordinates[pieceToMove]);

		this.sendMove(coordinates[pieceToMove], moves[move]["xy"], moves[move]["isEnemy"]); // make the move
		// console.log(this.theBoardState.searchMoves(coordinates[pieceToMove][0], coordinates[pieceToMove][1]));
	}

	getRandomInt(min, max) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
	}
}
