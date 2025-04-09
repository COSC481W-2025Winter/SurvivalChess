import {ChessPieceLite} from "./board-mockups";

export class ChessPiece extends Phaser.GameObjects.Image {
	#rank;
	#alignment;
	#moveCounter;
	#coordinate;

	constructor(scene, x, y, rank, alignment, coordinate) {
		super(scene, x, y, rank + alignment);
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
	cloneChessPieceLite() {
		return new ChessPieceLite(this.#rank, this.#alignment, this.#coordinate, this.#moveCounter);
	}
}
