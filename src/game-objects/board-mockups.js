// Scene-free version of board-state for AI logic to use.
import {BoardState} from "./board-state";

export class ChessPieceLite {
	#rank;
	#alignment;
	#moveCounter;
	#coordinate;

	constructor(rank, alignment, coordinate, movecounter = 0) {
		this.#rank = rank;
		this.#alignment = alignment;
		this.#moveCounter = movecounter;
		this.#coordinate = coordinate;
	}

	cloneChessPieceLite() {
		return new ChessPieceLite(this.#rank, this.#alignment, this.#coordinate, this.#moveCounter);
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

	// dummy setPosition method because there isn't an image rendering
	setPosition(x, y) {
		return;
	}

	getCoordinate() {
		return this.#coordinate;
	}
}

export class BoardStateLite extends BoardState {
	constructor(pieceCoordinates) {
		super(null, pieceCoordinates, false);
		// for (let i = 0; i<7; i++) {
		// 	for (let j = 0; j<7; j++) {
		// 		// pieceCoordinates.setCoordinate
		// 	}
		// }
	}
	// Move piece in input coordinate to output coordinate
	// movePiece(input, output) {
	// 	const incol = input[0];
	// 	const inrow = input[1];
	// 	const outcol = output[0];
	// 	const outrow = output[1];

	// 	if (!this.isOccupied(incol, inrow) || this.isOccupied(outcol, outrow)) return false;

	// 	this.destroyEnPassantToken();
	// 	if (this.getRank(incol, inrow) == PAWN && Math.abs(inrow - outrow) == 2)
	// 		this.addEnPassantToken(incol, (inrow + outrow) / 2);

	// 	this.#boardState[incol][inrow].setPosition(X_ANCHOR + outcol * TILE_SIZE, Y_ANCHOR + outrow * TILE_SIZE);
	// 	this.#boardState[outcol][outrow] = this.#boardState[incol][inrow];
	// 	this.#boardState[incol][inrow] = null;

	// 	this.incrementMoveCounter(outcol, outrow);

	// 	this.#boardState[outcol][outrow].setCoordinate(output[0], output[1]);

	// 	const rank = this.#boardState[outcol][outrow].getRank();
	// 	const alignment = this.#boardState[outcol][outrow].getAlignment();
	// 	this.#pieceCoordinates.moveCoordinate(input, output, rank, alignment);

	// 	return true;
	// }

	addPiece(col, row, rank, alignment, replace = false) {
		if (!replace && this.isOccupied(col, row)) return false;
		if (this.isOccupied(col, row)) this.destroyPiece(col, row);

		this.getBoardState()[col][row] = new ChessPieceLite(rank, alignment, [col, row]);

		this.getPieceCoordinates().addCoordinate(col, row, rank, alignment);

		return true;
	}
}
