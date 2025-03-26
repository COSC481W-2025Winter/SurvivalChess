// Scene-free version of board-state for AI logic to use.
import {BoardState} from "./board-state";

// export class ChessPieceLite extends ChessPiece {
// 	constructor(x, y, rank, alignment, coordinate) {
// 		super(null, x, y, rank, alignment, coordinate);
// 	}
// }

export class ChessPieceLite {
	#rank;
	#alignment;
	#moveCounter;
	#coordinate;

	constructor(rank, alignment, coordinate) {
		this.#rank = rank;
		this.#alignment = alignment;
		this.#moveCounter = 0;
		this.#coordinate = coordinate;
	}

	getRank() {
		return this.#rank;
	}

	getAlignment() {
		return this.#alignment;
	}

	getMoveCounter() {
		return this.#moveCounter;
	}

	incrementMoveCounter() {
		this.#moveCounter++;
	}

	setCoordinate(col, row) {
		this.#coordinate = [col, row];
	}

	getCoordinate() {
		return this.#coordinate;
	}
}

export class BoardStateLite extends BoardState {
	constructor(pieceCoordinates) {
		super(null, pieceCoordinates);
	}

	addPiece(col, row, rank, alignment, replace = false) {
		if (!replace && this.isOccupied(col, row)) return false;
		if (this.isOccupied(col, row)) this.destroyPiece(col, row);

		this.getBoardState()[col][row] = new ChessPieceLite(rank, alignment, [col, row]);

		this.getPieceCoordinates().addCoordinate(col, row, rank, alignment);

		return true;
	}
}
