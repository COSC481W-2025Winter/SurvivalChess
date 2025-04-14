import {TILE_SIZE, UNIT_HEIGHT, X_ANCHOR, Y_ANCHOR} from "./constants";
import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING} from "./constants";
import {PLAYER, COMPUTER} from "./constants";
import {EN_PASSANT_TOKEN} from "./constants";
import {isSamePoint, dim2Array} from "./constants";
import {ChessPiece} from "./chess-piece";
import {BoardStateLite} from "./board-mockups";

export class BoardState {
	#scene;
	#boardState;
	#pieceCoordinates;
	#enPassantCoordinate;

	#isChecked;

	constructor(scene, pieceCoordinates, initialize = true) {
		// Adds tweens if scene does not initilize (was getting error before)
		this.#scene = scene || {tweens: {add: () => {}}};

		// 8x8 array of chess pieces
		this.#boardState = dim2Array(8, 8);
		// contains coordinate info sorted by rank & alignment
		this.#pieceCoordinates = pieceCoordinates;

		if (initialize) {
			// Initialize Player/Computer (white/black) pieces
			this.initializePieces(PLAYER);
			// this.initializePieces(COMPUTER);

			// Add 4 pawns as the first generic wave
			for (let i = 2; i < 6; i++) this.addPiece(i, 1, PAWN, COMPUTER);
		}
	}

	resize() {
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++)
				if (this.isOccupied(i, j)) {
					this.#boardState[i][j].setPosition(X_ANCHOR + i * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE);
					this.#boardState[i][j].scale = UNIT_HEIGHT / 5;
				}
	}

	// initialize player pieces (and computer pieces for testing purposes)
	initializePieces(alignment, replace = false) {
		for (let i = 0; i < 8; i++) {
			for (const j of alignment == PLAYER ? [6, 7] : [0, 1])
				if (j == 6 || j == 1) this.addPiece(i, j, PAWN, alignment, replace);
				else
					switch (i) {
						case 0:
						case 7:
							this.addPiece(i, j, ROOK, alignment, replace);
							break;
						case 1:
						case 6:
							this.addPiece(i, j, KNIGHT, alignment, replace);
							break;
						case 2:
						case 5:
							this.addPiece(i, j, BISHOP, alignment, replace);
							break;
						case 3:
							this.addPiece(i, j, QUEEN, alignment, replace);
							break;
						case 4:
							if (alignment == PLAYER) {
								this.addPiece(i, j, KING, alignment, replace);
							}
							break;
					}
		}
	}

	// ================================================================
	// Check Tile Validity & Occupancy

	// Check whether coordinate is within bounds
	isValid(col, row) {
		return col >= 0 && col < 8 && row >= 0 && row < 8;
	}

	// Check whether coordinate has chess piece
	isOccupied(col, row, ignoreTile = null) {
		if (ignoreTile && isSamePoint([col, row], ignoreTile)) return false;
		return this.#boardState[col][row] && this.#boardState[col][row] != EN_PASSANT_TOKEN;
	}

	// Check whether coordinate has en passant token
	isEnPassant(col, row) {
		return this.#boardState[col][row] == EN_PASSANT_TOKEN;
	}

	// ================================================================
	// En Passant Token Management (Adding & Deletion)

	// Add en passant token to coordinate & log coordinate
	addEnPassantToken(col, row) {
		this.#boardState[col][row] = EN_PASSANT_TOKEN;
		this.#enPassantCoordinate = [col, row];
	}

	// Destroy en passant token (if it exists)
	destroyEnPassantToken() {
		if (this.#enPassantCoordinate) {
			const col = this.#enPassantCoordinate[0];
			const row = this.#enPassantCoordinate[1];
			this.#boardState[col][row] = null;
			this.#enPassantCoordinate = null;
		}
	}

	// ================================================================
	// Chess Piece Management (Adding & Moving & Destruction)

	// Add piece of chosen rank & alignment to coordinate
	addPiece(col, row, rank, alignment, replace = false) {
		if (!replace && this.isOccupied(col, row)) return false;
		if (this.isOccupied(col, row)) this.destroyPiece(col, row);

		this.#boardState[col][row] = new ChessPiece(
			this.#scene,
			X_ANCHOR + col * TILE_SIZE,
			Y_ANCHOR + row * TILE_SIZE,
			rank,
			alignment,
			[col, row]
		);
		this.#boardState[col][row].scale = UNIT_HEIGHT / 5;

		this.#scene.add.existing(this.#boardState[col][row]);

		this.#pieceCoordinates.addCoordinate(col, row, rank, alignment);

		return true;
	}

	// Animate pieces
	animatePieceMove(piece, [outcol, outrow]) {
		const targetX = X_ANCHOR + outcol * TILE_SIZE;
		const targetY = Y_ANCHOR + outrow * TILE_SIZE;

		this.#scene.tweens.add({
			targets: piece,
			x: targetX,
			y: targetY,
			duration: 300,
			ease: "Power2",
		});
	}

	// Move piece in input coordinate to output coordinate
	async movePiece(input, output) {
		const incol = input[0];
		const inrow = input[1];
		const outcol = output[0];
		const outrow = output[1];

		if (!this.isOccupied(incol, inrow) || this.isOccupied(outcol, outrow)) return false;

		this.destroyEnPassantToken();
		if (this.getRank(incol, inrow) == PAWN && Math.abs(inrow - outrow) == 2)
			this.addEnPassantToken(incol, (inrow + outrow) / 2);

		// this.#boardState[incol][inrow].setPosition(X_ANCHOR + outcol * TILE_SIZE, Y_ANCHOR + outrow * TILE_SIZE);
		this.animatePieceMove(this.#boardState[incol][inrow], output); // Move with animation
		this.#boardState[outcol][outrow] = this.#boardState[incol][inrow];
		this.#boardState[incol][inrow] = null;

		this.incrementMoveCounter(outcol, outrow);

		this.#boardState[outcol][outrow].setCoordinate(output[0], output[1]);

		const rank = this.#boardState[outcol][outrow].getRank();
		const alignment = this.#boardState[outcol][outrow].getAlignment();
		this.#pieceCoordinates.moveCoordinate(input, output, rank, alignment);

		return true;
	}

	// Completely destroy the piece
	destroyPiece(col, row) {
		if (!this.isOccupied(col, row)) return false;

		const rank = this.#boardState[col][row].getRank();
		const alignment = this.#boardState[col][row].getAlignment();
		this.#pieceCoordinates.deleteCoordinate(col, row, rank, alignment);

		this.#boardState[col][row].destroy();
		this.#boardState[col][row] = null;

		return true;
	}

	// Destroy all pieces of given alignment
	zapPieces(alignment) {
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++)
				if (this.isOccupied(i, j) && this.getAlignment(i, j) == alignment) this.destroyPiece(i, j);
	}

	// ================================================================
	// Chess Piece Info (Alignment & Rank) Management

	// Get alignment info of piece
	getAlignment(col, row) {
		return this.#boardState[col][row].getAlignment();
	}

	// Get rank info of piece
	getRank(col, row) {
		return this.#boardState[col][row].getRank();
	}

	// Get move counter info of piece
	getMoveCounter(col, row) {
		return this.#boardState[col][row].getMoveCounter();
	}

	// Increment move counter of piece
	incrementMoveCounter(col, row) {
		this.#boardState[col][row].incrementMoveCounter();
	}

	// Check whether coordinate has different alignment
	isDiffAlignment(col, row, alignment, supposeTile = null) {
		if (supposeTile && isSamePoint([col, row], supposeTile)) return false;
		return alignment != this.getAlignment(col, row);
	}

	// ================================================================
	// Chess Piece Possible Moves Search

	// Search for possible moves a chess piece can make
	searchMoves(col, row) {
		const rank = this.getRank(col, row);
		switch (rank) {
			case PAWN:
				return this.searchPawn(col, row);
			case ROOK:
				return this.searchRook(col, row);
			case KNIGHT:
				return this.searchKnight(col, row);
			case BISHOP:
				return this.searchBishop(col, row);
			case QUEEN:
				return this.searchQueen(col, row);
			case KING:
				return this.searchKing(col, row);
		}
	}

	// Search for possible moves a pawn can make
	searchPawn(col, row) {
		const moves = [];
		const alignment = this.getAlignment(col, row);
		let j = row + (alignment == PLAYER ? -1 : 1);

		for (let i = col - 1; i <= col + 1; i++)
			if (this.isValid(i, j)) {
				// forward
				if (i == col && !this.isOccupied(i, j)) {
					if (this.kingSaved([col, row], [i, j], alignment)) moves.push({xy: [i, j], isEnemy: false});
				} else if (i != col && this.isOccupied(i, j) && this.isDiffAlignment(i, j, alignment)) {
					// elimination
					if (this.kingSaved([col, row], [i, j], alignment)) moves.push({xy: [i, j], isEnemy: true});
				} else if (
					// en passant
					i != col &&
					this.isEnPassant(i, j) &&
					this.isOccupied(i, row) &&
					this.isDiffAlignment(i, row, alignment)
				) {
					if (this.kingSaved([col, row], [i, j], alignment)) moves.push({xy: [i, j], isEnemy: true});
				}
			}

		// 2 tiles with first move
		if (!this.isOccupied(col, j)) {
			j += alignment == PLAYER ? -1 : 1;
			if (
				this.isValid(col, j) &&
				!this.getMoveCounter(col, row) &&
				!this.isOccupied(col, j) &&
				this.kingSaved([col, row], [col, j], alignment)
			)
				moves.push({xy: [col, j], isEnemy: false});
		}

		return moves;
	}

	// Search for possible moves a knight can make
	searchKnight(col, row) {
		const moves = [];
		const alignment = this.getAlignment(col, row);
		const x_s = [1, 1, -1, -1, 2, 2, -2, -2];
		const y_s = [2, -2, 2, -2, 1, -1, 1, -1];
		let x, y;

		for (let i = 0; i < 8; i++) {
			x = col + x_s[i];
			y = row + y_s[i];
			if (this.isValid(x, y)) this.searchTile([col, row], [x, y], alignment, moves);
		}

		return moves;
	}

	// Search for possible moves a king can make
	searchKing(col, row) {
		const moves = [];
		const alignment = this.getAlignment(col, row);

		for (let i = col - 1; i <= col + 1; i++)
			for (let j = row - 1; j <= row + 1; j++)
				if (this.isValid(i, j))
					if (!this.seekThreats(i, j, alignment, [col, row]).length)
						this.searchTile([col, row], [i, j], alignment, moves);

		// Castling
		if (!this.getMoveCounter(col, row)) {
			// Queenside castling
			if (
				this.isOccupied(0, row) &&
				!this.isOccupied(1, row) &&
				!this.isOccupied(2, row) &&
				!this.isOccupied(3, row) &&
				!this.getMoveCounter(0, row) &&
				!this.seekThreats(1, row, alignment, [col, row]).length &&
				!this.seekThreats(2, row, alignment, [col, row]).length &&
				!this.seekThreats(3, row, alignment, [col, row]).length &&
				!this.seekThreats(col, row, alignment).length
			)
				moves.push({xy: [col - 2, row], isEnemy: false});
			// Kingside castling
			if (
				this.isOccupied(7, row) &&
				!this.isOccupied(6, row) &&
				!this.isOccupied(5, row) &&
				!this.getMoveCounter(7, row) &&
				!this.seekThreats(6, row, alignment, [col, row]).length &&
				!this.seekThreats(5, row, alignment, [col, row]).length &&
				!this.seekThreats(col, row, alignment).length
			)
				moves.push({xy: [col + 2, row], isEnemy: false});
		}

		return moves;
	}

	// Search for possible moves a rook can make
	searchRook(col, row) {
		const moves = [];
		const alignment = this.getAlignment(col, row);
		let i, j;

		// left
		for (i = col - 1; i >= 0; i--) if (this.searchTile([col, row], [i, row], alignment, moves)) break;

		// right
		for (i = col + 1; i < 8; i++) if (this.searchTile([col, row], [i, row], alignment, moves)) break;

		// top
		for (j = row - 1; j >= 0; j--) if (this.searchTile([col, row], [col, j], alignment, moves)) break;

		// bottom
		for (j = row + 1; j < 8; j++) if (this.searchTile([col, row], [col, j], alignment, moves)) break;

		return moves;
	}

	// Search for possible moves a bishop can make
	searchBishop(col, row) {
		const moves = [];
		const alignment = this.getAlignment(col, row);
		let i, j;

		// top left
		for (i = col - 1, j = row - 1; i >= 0 && j >= 0; i--, j--)
			if (this.searchTile([col, row], [i, j], alignment, moves)) break;

		// top right
		for (i = col + 1, j = row - 1; i < 8 && j >= 0; i++, j--)
			if (this.searchTile([col, row], [i, j], alignment, moves)) break;

		// bottom left
		for (i = col - 1, j = row + 1; i >= 0 && j < 8; i--, j++)
			if (this.searchTile([col, row], [i, j], alignment, moves)) break;

		// bottom right
		for (i = col + 1, j = row + 1; i < 8 && j < 8; i++, j++)
			if (this.searchTile([col, row], [i, j], alignment, moves)) break;

		return moves;
	}

	// Search for possible moves a queen can make
	searchQueen(col, row) {
		return this.searchRook(col, row).concat(this.searchBishop(col, row));
	}

	// Check whether a coordinate is a possible move
	searchTile(input, output, alignment, moves) {
		const outcol = output[0];
		const outrow = output[1];
		if (!this.isOccupied(outcol, outrow)) {
			if (this.kingSaved(input, output, alignment)) moves.push({xy: [outcol, outrow], isEnemy: false});
		} else {
			if (this.isDiffAlignment(outcol, outrow, alignment))
				if (this.kingSaved(input, output, alignment)) moves.push({xy: [outcol, outrow], isEnemy: true});
			return true;
		}

		return false;
	}

	// ================================================================
	// Chess Piece Possible Threats Seek

	// Seek for possible threats to a hypothetical chess piece at a coordinate & of an alignment
	// Whilst Optionally ignoring occupancy of a coordinate (mostly for when moving pieces)
	seekThreats(col, row, alignment, ignoreTile = null, supposeTile = null) {
		return []
			.concat(this.seekAdjacent(col, row, alignment, supposeTile))
			.concat(this.seekSkewed(col, row, alignment, supposeTile))
			.concat(this.seekOrthogonal(col, row, alignment, ignoreTile, supposeTile))
			.concat(this.seekDiagonal(col, row, alignment, ignoreTile, supposeTile));
	}

	// Seek for possible adjacent threats (pawns & kings)
	seekAdjacent(col, row, alignment, supposeTile = null) {
		const threats = [];

		for (let i = col - 1; i <= col + 1; i++)
			for (let j = row - 1; j <= row + 1; j++)
				if (
					this.isValid(i, j) &&
					this.isOccupied(i, j) &&
					this.isDiffAlignment(i, j, alignment, supposeTile) &&
					(i != col || j != row)
				) {
					const rank = this.getRank(i, j);
					switch (rank) {
						case PAWN:
							if (
								(alignment == PLAYER && j == row - 1 && i != col) ||
								(alignment == COMPUTER && j == row + 1 && i != col)
							)
								threats.push([i, j]);
							break;
						case KING:
							threats.push([i, j]);
							break;
					}
				}

		return threats;
	}

	// Seek for possible skewed threats (knights)
	seekSkewed(col, row, alignment, supposeTile = null) {
		const threats = [];

		const x_s = [1, 1, -1, -1, 2, 2, -2, -2];
		const y_s = [2, -2, 2, -2, 1, -1, 1, -1];
		let x, y;

		for (let i = 0; i < 8; i++) {
			x = col + x_s[i];
			y = row + y_s[i];
			if (this.isValid(x, y) && !this.seekSupposed(x, y, supposeTile)) this.seekTile(x, y, alignment, threats, KNIGHT);
		}

		return threats;
	}

	// Seek for possible orthogonal threats (rooks & queens)
	seekOrthogonal(col, row, alignment, ignoreTile = null, supposeTile = null) {
		const threats = [];

		let i, j;

		// left
		for (i = col - 1; i >= 0; i--)
			if (this.seekSupposed(i, row, supposeTile) || this.seekTile(i, row, alignment, threats, ROOK, ignoreTile)) break;

		// right
		for (i = col + 1; i < 8; i++)
			if (this.seekSupposed(i, row, supposeTile) || this.seekTile(i, row, alignment, threats, ROOK, ignoreTile)) break;

		// top
		for (j = row - 1; j >= 0; j--)
			if (this.seekSupposed(col, j, supposeTile) || this.seekTile(col, j, alignment, threats, ROOK, ignoreTile)) break;

		// bottom
		for (j = row + 1; j < 8; j++)
			if (this.seekSupposed(col, j, supposeTile) || this.seekTile(col, j, alignment, threats, ROOK, ignoreTile)) break;

		return threats;
	}

	// Seek for possible diagonal threats (bishops & queens)
	seekDiagonal(col, row, alignment, ignoreTile = null, supposeTile = null) {
		const threats = [];

		let i, j;

		// top left
		for (i = col - 1, j = row - 1; i >= 0 && j >= 0; i--, j--)
			if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile)) break;

		// top right
		for (i = col + 1, j = row - 1; i < 8 && j >= 0; i++, j--)
			if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile)) break;

		// bottom left
		for (i = col - 1, j = row + 1; i >= 0 && j < 8; i--, j++)
			if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile)) break;

		// bottom right
		for (i = col + 1, j = row + 1; i < 8 && j < 8; i++, j++)
			if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile)) break;

		return threats;
	}

	// Check whether a coordinate is a threat
	seekTile(col, row, alignment, threats, compareRank, ignoreTile = null) {
		if (this.isOccupied(col, row, ignoreTile)) {
			const rank = this.getRank(col, row);
			const isThreat = rank == compareRank || ((compareRank == ROOK || compareRank == BISHOP) && rank == QUEEN);
			if (this.isDiffAlignment(col, row, alignment) && isThreat) threats.push([col, row]);
			return true;
		}

		return false;
	}

	// Check whether a coordinate is supposed by an ally piece
	seekSupposed(col, row, supposeTile = null) {
		return supposeTile && isSamePoint(supposeTile, [col, row]);
	}

	// Check whether king would be saved/un-threatened if move is made
	kingSaved(input, output, alignment) {
		if (alignment == COMPUTER) {
			// computer doesn't have a king
			return true;
		}
		let coordinate = this.#pieceCoordinates.getCoordinate(KING, alignment);
		if (!coordinate) {
			return false;
		}
		coordinate = isSamePoint(input, coordinate) ? output : coordinate;
		return !this.seekThreats(...coordinate, alignment, input, output).length;
	}

	// Check whether king of alignment is threatened
	isChecked(alignment) {
		if (alignment == COMPUTER) {
			// can't be checked if you don't have a king
			this.#isChecked = false;
			return false;
		}
		const coordinate = this.#pieceCoordinates.getCoordinate(KING, alignment);
		// console.log(coordinate);
		if (!coordinate) {
			// king captured
			this.#isChecked = true;
			return this.#isChecked;
		}
		this.#isChecked = !!this.seekThreats(...coordinate, alignment).length;
		return this.#isChecked;
	}

	// Check whether player of alignment is checkmated (checked & no legal move)
	isCheckmated(alignment) {
		if (!this.isChecked(alignment)) return false;

		const coordinates = this.#pieceCoordinates.getAllCoordinates(alignment);
		for (const xy of coordinates) if (this.searchMoves(...xy).length) return false;

		console.log("checkmated");
		return true;
	}

	// Check whether board is stalemated (not checked & no legal move)
	isStalemated(alignment) {
		if (this.isChecked(alignment)) return false;

		const coordinates = this.#pieceCoordinates.getAllCoordinates(alignment);
		for (const xy of coordinates) if (this.searchMoves(...xy).length) return false;

		console.log("stalemated");
		return true;
	}

	getBoardState() {
		return this.#boardState;
	}

	getPieceCoordinates() {
		return this.#pieceCoordinates;
	}

	// creates a deep copy of the board state without an associated scene
	cloneBoardState() {
		let cloned_boardstate = new BoardStateLite(this.#pieceCoordinates.clonePieceCoordinates());

		let boardarray = dim2Array(8, 8);
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++) {
				if (this.#boardState[i][j]) {
					if (this.#boardState[i][j] == EN_PASSANT_TOKEN) {
						boardarray[i][j] = EN_PASSANT_TOKEN;
					} else {
						boardarray[i][j] = this.#boardState[i][j].cloneChessPieceLite();
					}
				}
			}
		// cloned_boardstate.setBoardState_for_cloning(boardarray);
		cloned_boardstate.#boardState = boardarray;
		cloned_boardstate.setIsEnPassantCoordinate_for_cloning(this.#enPassantCoordinate);
		cloned_boardstate.setIsChecked_for_cloning(this.#isChecked);

		// console.log("clone board state: ", cloned_boardstate);
		return cloned_boardstate;
	}

	setBoardState_for_cloning(x) {
		this.#boardState = x;
	}
	setIsEnPassantCoordinate_for_cloning(x) {
		this.#enPassantCoordinate = x;
	}
	setIsChecked_for_cloning(x) {
		this.#isChecked = x;
	}
}
