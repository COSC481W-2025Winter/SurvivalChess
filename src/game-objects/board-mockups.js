// Scene-free version of board-state for AI logic to use.
import {TILE_SIZE, X_ANCHOR, Y_ANCHOR} from "./constants";
import {ChessPiece} from "./chess-piece";
import {BoardState} from "./board-state";

export class ChessPieceLite extends ChessPiece {
	constructor(x, y, rank, alignment, coordinate) {
		super(null, x, y, rank, alignment, coordinate);
	}
}

export class BoardStateLite extends BoardState {
	constructor(pieceCoordinates) {
		super(null, pieceCoordinates);
	}

	addPiece(col, row, rank, alignment, replace = false) {
		if (!replace && this.isOccupied(col, row)) return false;
		if (this.isOccupied(col, row)) this.destroyPiece(col, row);

		this.getBoardState()[col][row] = new ChessPieceLite(
			X_ANCHOR + col * TILE_SIZE,
			Y_ANCHOR + row * TILE_SIZE,
			rank,
			alignment,
			[col, row]
		);

		this.getPieceCoordinates().addCoordinate(col, row, rank, alignment);

		return true;
	}
}
