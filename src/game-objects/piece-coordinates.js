import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING, PLAYER, COMPUTER} from "./constants";

export class PieceCoordinates {
	#coordinates;

	constructor() {
		this.#coordinates = {};
		for (const alignment of [PLAYER, COMPUTER]) {
			this.#coordinates[alignment] = {};
			for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING]) {
				this.#coordinates[alignment][rank] = [];
			}
		}
	}

	addCoordinate(col, row, rank, alignment) {
		this.#coordinates[alignment][rank].push([col, row]);
	}

	moveCoordinate(input, output, rank, alignment) {
		const index = this.findIndex(...input, rank, alignment);
		if (index == null) {
			return false;
		}
		this.#coordinates[alignment][rank][index] = output;
		return true;
	}

	getCoordinate(rank, alignment) {
		return this.#coordinates[alignment][rank][0];
	}

	getAllCoordinates(alignment) {
		const coordinates = [];
		for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING]) {
			for (const piece of this.#coordinates[alignment][rank]) {
				coordinates.push(piece);
			}
		}
		return coordinates;
	}

	deleteCoordinate(col, row, rank, alignment) {
		const index = this.findIndex(col, row, rank, alignment);
		if (index == null) {
			return false;
		}
		this.#coordinates[alignment][rank].splice(index, 1);
		return true;
	}

	findIndex(col, row, rank, alignment) {
		let index = 0;
		for (; index < this.#coordinates[alignment][rank].length; index++) {
			if (col == this.#coordinates[alignment][rank][index][0] && row == this.#coordinates[alignment][rank][index][1]) {
				return index;
			}
		}
		return null;
	}

	// makes a deep clone of a PieceCoordinates object
	clonePieceCoordinates() {
		let cloned_coordinates = new PieceCoordinates();
		for (let alignment of [PLAYER, COMPUTER])
			for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING])
				for (let coordinate of this.#coordinates[alignment][rank])
					cloned_coordinates.addCoordinate(...coordinate, rank, alignment);
		return cloned_coordinates;
	}
}
