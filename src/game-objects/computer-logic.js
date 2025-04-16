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
	LOSS_WEIGHT,
} from "./constants";
import {EventBus} from "../game/EventBus.js";
import {BoardStateLite} from "./board-mockups";

export class ChessGameState {
	board;

	constructor(BoardState) {
		if (BoardState) {
			this.boardState = BoardState;
			// this.pieceCoordinates = BoardState.getPieceCoordinates();
		}
		// makes linter not complain about unused BoardStateLite import
		// Workaround oriented programming at its finest
		this.CreateAnotherBoardStateLite();
	}

	// Find the best move using min-max algorithm
	getBestMove() {
		let bestMove;
		let currentMove;

		// all computer coordinates
		const pieceDict = this.boardState.getPieceCoordinates().getAllCoordinates(COMPUTER);
		// for each piece
		for (const piece in pieceDict) {
			// find all moves
			const moves = this.boardState.searchMoves(pieceDict[piece][0], pieceDict[piece][1]);
			// all possible moves for a piece
			for (const move in moves) {
				// console.log(pieceDict[piece], moves[move]);
				currentMove = this.computerMove(this.boardState.cloneBoardState(), pieceDict[piece], moves[move], 0); // get score for board
				if (!bestMove || currentMove[0] < bestMove[0]) {
					bestMove = [currentMove[0], pieceDict[piece], moves[move]["xy"], moves[move]["isEnemy"]];

					// console.log("BEST MOVE: ", bestMove);
				}
			}
		}
		// make chosen move
		// console.log("The Move: ", bestMove);
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

		let bestMove;
		let currentMove;

		const pieceDict = boardState.getPieceCoordinates().getAllCoordinates(PLAYER);
		// for each piece
		for (const piece in pieceDict) {
			// find all moves
			// console.log("moves: ", pieceDict[piece][0], pieceDict[piece][1])
			const moves = boardState.searchMoves(pieceDict[piece][0], pieceDict[piece][1]);
			// all possible moves for a piece
			// console.log("moves:", moves);
			for (const move in moves) {
				// console.log(moves[move]);
				if (depth < DEPTH_LIMIT) {
					this.computerMove(boardState.cloneBoardState(), pieceDict[piece], moves[move], depth + 1); // calculate possible computer moves
				} else {
					currentMove = this.evaluateBoard(boardState.cloneBoardState()); // get score for board
				}
				// console.log(currentMove);
				if (!bestMove || currentMove > bestMove[0]) {
					bestMove = [currentMove, pieceDict[piece], moves[move]["xy"], moves[move]["isEnemy"]];
				}
			}
		}
		if (!currentMove) {
			// if there is no legal subsequent move
			return this.evaluateBoard(boardState);
		}
		// console.log("PLAYER BEST", bestMove);
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
		let bestMove;
		let currentMove;

		for (const piece in pieceDict) {
			// find all moves
			const moves = boardState.searchMoves(pieceDict[piece][0], pieceDict[piece][1]);
			// all possible moves for a piece
			// console.log("moves:", moves);
			for (const move in moves) {
				// console.log(moves[move]);
				if (depth < DEPTH_LIMIT) {
					currentMove = this.playerMove(boardState.cloneBoardState(), pieceDict[piece], moves[move], depth + 1); // calculate possible computer moves
				} else {
					currentMove = this.evaluateBoard(boardState.cloneBoardState()); // get score for board
					// console.log(currentMove, bestMove)
				}
				if (!bestMove || currentMove < bestMove[0]) {
					bestMove = [currentMove, pieceDict[piece], moves[move]["xy"], moves[move]["isEnemy"]];
				}
			}
		}
		if (!currentMove) {
			// if there is no legal subsequent move
			return this.evaluateBoard(boardState);
		}
		// console.log("COMPUTER BEST", bestMove);
		return bestMove;
	}

	// determines score of a board, lower is better for computer
	evaluateBoard(boardState) {
		let score = 0; // initialize score
		let threatenedPlayer;
		let threatenedComputer;
		if (boardState.isCheckmated(PLAYER) || boardState.isStalemated(PLAYER)) {
			return -999999;
		}
		// get total value of player material - 0.01*value of player material threatened
		let coordinates = boardState.getPieceCoordinates().getAllCoordinates(PLAYER);
		// console.log(coordinates);
		coordinates.forEach((piece) => {
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
					// friendly pieces threatening the king don't matter
					// score += KING_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					if (threatenedPlayer.length > 0) {
						// doesn't matter if multiple pieces threaten king, its in check or not in check
						score -= KING_VALUE * THREATEN_WEIGHT * 0.1; // make less likely to suicide-check player
					} // * threatenedPlayer.length; // each piece threatening it
					break;
			}
		});

		coordinates = boardState.getPieceCoordinates().getAllCoordinates(COMPUTER);
		// console.log(coordinates);
		coordinates.forEach((piece) => {
			threatenedComputer = boardState.seekThreats(piece[0], piece[1], COMPUTER); // player pieces protecting the given piece
			threatenedPlayer = boardState.seekThreats(piece[0], piece[1], PLAYER); // computer pieces threatening the chosen piece
			switch (boardState.getBoardState()[piece[0]][piece[1]].getRank()) {
				case PAWN:
					score -= PAWN_VALUE * LOSS_WEIGHT;
					score += PAWN_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= PAWN_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case ROOK:
					score -= ROOK_VALUE * LOSS_WEIGHT;
					score += ROOK_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= ROOK_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case BISHOP:
					score -= BISHOP_VALUE * LOSS_WEIGHT;
					score += BISHOP_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= BISHOP_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case KNIGHT:
					score -= KNIGHT_VALUE * LOSS_WEIGHT;
					score += KNIGHT_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= KNIGHT_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
				case QUEEN:
					score -= QUEEN_VALUE * LOSS_WEIGHT;
					score += QUEEN_VALUE * THREATEN_WEIGHT * threatenedComputer.length;
					score -= QUEEN_VALUE * THREATEN_WEIGHT * threatenedPlayer.length; // each piece threatening it
					break;
			}
		});

		return score;
	}

	// gets a random legal move
	getRandomMove() {
		let pieceFound = false;

		const coordinates = this.boardState.getPieceCoordinates().pieceCoordinates.getAllCoordinates(COMPUTER);
		let pieceToMove;
		let moves;

		while (!pieceFound) {
			pieceToMove = this.getRandomInt(0, coordinates.length); // get random piece

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
