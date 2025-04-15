import {TILE_SIZE, X_ANCHOR, Y_ANCHOR} from "./constants";
import {
	HOVER_COLOR,
	NON_LETHAL_COLOR,
	LETHAL_COLOR,
	THREAT_COLOR,
	CHECKED_COLOR,
	STAGE_COLOR,
	BACKGROUND_COLOR,
} from "./constants";
import WebFont from "webfontloader"; // Correctly import WebFont
import {SIDE_BASE_COLOR, SIDE_HIGHLIGHT_COLOR} from "./constants";
import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING} from "./constants";
import {PLAYER, COMPUTER} from "./constants";
import {isSamePoint, dim2Array} from "./constants";
import {ChessGameState} from "./computer-logic";

import {BoardState} from "./board-state";
import {PieceCoordinates} from "./piece-coordinates";
import {PiecesTaken} from "./pieces-taken";
import {DevButtons} from "./dev-buttons";

import {CHECKMATE, STALEMATE} from "./global-stats";
import {setGlobalStatus, incrementGlobalMoves, incrementGlobalPieces, incrementGlobalWaves} from "./global-stats";
import {resetGlobalStatus, resetGlobalMoves, resetGlobalPieces, resetGlobalWaves} from "./global-stats";

import {dev_alignment, dev_rank, dev_bamzap, dev_stopOn, dev_deadAI} from "./dev-buttons";
import {BAM, ZAP} from "./dev-buttons";

import {fontsizeTexts} from "./constants";

import {EventBus} from "../game/EventBus";

export class ChessTiles {
	constructor(scene) {
		this.scene = scene;
		// Load the pixel font
		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true; // Flag to indicate the font is loaded
			},
		});

		this.currentTheme = {
			light: 0xe5aa70, // default light
			dark: 0xc04000, // default dark
		};

		this.chessTiles; // 8x8 array of chess tiles
		this.boardState; // contains BoardState object that manages an 8x8 array of chess pieces
		this.pieceCoordinates; // contains PieceCoordinates object that manages coordinate info sorted by rank & alignment
		this.piecesTaken; // contains PiecesTaken object that logs captured pieces
		this.devButtons; // contains DevButtons object that configures development mode buttons
		this.sideLights; // numbers & letters on edge of chessboard that highlight in response to cursorZ

		this.xy; // coordinate of selected chess piece; list of [i,j]
		this.moves; // possible moves of selected chess piece; list of dictionaries of {'xy':[#,#],'isEnemy':boolean}
		this.temp; // temporary storage of coordinate & color; list of dictionaries of {'xy':[#,#],'color':color}
		this.threats; // temporary storage of threats to chess piece, list of lists of [#,#]

		this.baseTurnsUntilNextWave = 13;
		this.turnsUntilNextWave = this.baseTurnsUntilNextWave;
		this.waveSpawnBudget = 10;

		this.promotionCol; // temporary storage of column of piece to promote
		this.promotionRow; // temporary storage of row of piece to promote

		this.futureMoves; // the ChessGameState object that plans future moves

		this.currentPlayer = PLAYER; // denotes current player
		this.isChecked; // is true if the current player's king is checked

		// Set up stage behind (surrounding) chessboard
		this.stage = this.scene.add.rectangle(
			X_ANCHOR + 3.5 * TILE_SIZE,
			Y_ANCHOR + 3.5 * TILE_SIZE,
			9 * TILE_SIZE,
			9 * TILE_SIZE,
			STAGE_COLOR
		);

		this.sideLights = dim2Array(4, 8);
		for (let i = 0; i < 4; i++)
			for (let j = 0; j < 8; j++)
				switch (i) {
					case 0: // [0,1][0~7] top & bottom rows of a~h
						this.sideLights[i][j] = this.scene.add
							.text(X_ANCHOR + j * TILE_SIZE, Y_ANCHOR - 0.75 * TILE_SIZE, String.fromCharCode(65 + j), {
								fontSize: TILE_SIZE / 2,
							})
							.setOrigin(0.5);
						this.sideLights[i][j].setStyle({fontFamily: "'Pixelify Sans', sans-serif"});
						break;
					case 1: // [0,1][0~7] top & bottom rows of a~h
						this.sideLights[i][j] = this.scene.add
							.text(X_ANCHOR + j * TILE_SIZE, Y_ANCHOR + 7.75 * TILE_SIZE, String.fromCharCode(65 + j), {
								fontSize: TILE_SIZE / 2,
							})
							.setOrigin(0.5);
						this.sideLights[i][j].setStyle({fontFamily: "'Pixelify Sans', sans-serif"});
						break;
					case 2: // [2,3][0~7] left & right columns of 1~8
						this.sideLights[i][j] = this.scene.add
							.text(X_ANCHOR - 0.75 * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE, 8 - j, {fontSize: TILE_SIZE / 2})
							.setOrigin(0.5);
						break;
					case 3: // [2,3][0~7] left & right columns of 1~8
						this.sideLights[i][j] = this.scene.add
							.text(X_ANCHOR + 7.75 * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE, 8 - j, {fontSize: TILE_SIZE / 2})
							.setOrigin(0.5);
						break;
				}

		// Set up chessTiles & pointer behaviour, as well as interaction with pieces
		this.chessTiles = dim2Array(8, 8);
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				// Initialize tiles & enable interaction
				this.chessTiles[i][j] = this.scene.add.rectangle(
					X_ANCHOR + i * TILE_SIZE,
					Y_ANCHOR + j * TILE_SIZE,
					TILE_SIZE,
					TILE_SIZE,
					this.getTileColor([i, j])
				);
				this.chessTiles[i][j].setInteractive();

				// When the pointer hovers over a tile, highlight it
				this.chessTiles[i][j].on("pointerover", () => {
					this.pointerOver(i, j);
				});

				// When the pointer moves away from a tile, restore original color
				this.chessTiles[i][j].on("pointerout", () => {
					this.pointerOut(i, j);
				});

				// When the pointer pushes down a tile, select/move piece & highlight selected tile / possible moves
				this.chessTiles[i][j].on("pointerdown", () => {
					this.pointerSelect(i, j);
				});
			}
		}

		// Reset game stats
		resetGlobalStatus();
		resetGlobalMoves();
		resetGlobalPieces();
		resetGlobalWaves();

		this.pieceCoordinates = new PieceCoordinates();
		this.boardState = new BoardState(this.scene, this.pieceCoordinates);
		this.devButtons = new DevButtons(this.scene, this);
		this.piecesTaken = new PiecesTaken(this.scene);
	} // constructor ends here!!

	// modified this
	updateColorTheme(palette) {
		const themeColors = {
			default: {light: 0xe5aa70, dark: 0xc04000},
			dark: {light: 0xbbb8b1, dark: 0x222222},
			light: {light: 0xffffff, dark: 0x3b3b3b},
		}[palette] || {light: 0xe5aa70, dark: 0xc04000};

		this.currentTheme = themeColors;

		// Update stage color
		if (palette == "default") {
			this.stage.setFillStyle(STAGE_COLOR); // BROWN
		} else {
			this.stage.setFillStyle(BACKGROUND_COLOR); // ONYX
		}

		// Update board tiles
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const isLight = (i + j) % 2 === 0;
				this.chessTiles[i][j].setFillStyle(isLight ? themeColors.light : themeColors.dark);
			}
		}
		// NOW add the EventBus listener:
		EventBus.on("PaletteChanged", (palette) => {
			this.updateColorTheme(palette);
		});

		// Update captured panel
		if (this.piecesTaken?.updatePanelColor) {
			this.piecesTaken.updatePanelColor(themeColors.dark, themeColors.light, palette);
		}
	}

	resize() {
		this.stage.setPosition(X_ANCHOR + 3.5 * TILE_SIZE, Y_ANCHOR + 3.5 * TILE_SIZE);
		this.stage.setSize(9 * TILE_SIZE, 9 * TILE_SIZE);
		for (let i = 0; i < 4; i++)
			for (let j = 0; j < 8; j++) {
				fontsizeTexts(TILE_SIZE / 2, this.sideLights[i][j]);
				switch (i) {
					case 0: // [0,1][0~7] top & bottom rows of a~h
						this.sideLights[i][j].setPosition(X_ANCHOR + j * TILE_SIZE, Y_ANCHOR - 0.75 * TILE_SIZE);
						break;
					case 1: // [0,1][0~7] top & bottom rows of a~h
						this.sideLights[i][j].setPosition(X_ANCHOR + j * TILE_SIZE, Y_ANCHOR + 7.75 * TILE_SIZE);
						break;
					case 2: // [2,3][0~7] left & right columns of 1~8
						this.sideLights[i][j].setPosition(X_ANCHOR - 0.75 * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE);
						break;
					case 3: // [2,3][0~7] left & right columns of 1~8
						this.sideLights[i][j].setPosition(X_ANCHOR + 7.75 * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE);
						break;
				}
			}
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++) {
				this.chessTiles[i][j].setPosition(X_ANCHOR + i * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE);
				this.chessTiles[i][j].setSize(TILE_SIZE, TILE_SIZE);
			}
		this.boardState.resize();
		this.devButtons.resize();
		this.piecesTaken.resize();
	}

	// ================================================================
	// Pointer Events

	// Executes when pointer enters tile, or upon manual trigger from pointerSelect
	pointerOver(i, j) {
		// if highlighted as possible move, save state to restore on pointerout
		let color = this.chessTiles[i][j].fillColor;
		if ([NON_LETHAL_COLOR, LETHAL_COLOR, CHECKED_COLOR].includes(color)) this.temp = [{xy: [i, j], color: color}];

		// highlight tile
		this.highlightColor([i, j], HOVER_COLOR);

		// also highlight the corresponding numbers/letters for clarity
		this.sideLights[0][i].setColor(SIDE_HIGHLIGHT_COLOR); // Top letters (gold)
		this.sideLights[1][i].setColor(SIDE_HIGHLIGHT_COLOR); // Bottom letters
		this.sideLights[2][j].setColor(SIDE_HIGHLIGHT_COLOR); // Left numbers
		this.sideLights[3][j].setColor(SIDE_HIGHLIGHT_COLOR); // Right numbers

		// if hovering over a piece then highlight this.threats excluding the selected piece
		if (this.boardState.isOccupied(i, j)) {
			this.threats = this.boardState.seekThreats(i, j, this.boardState.getAlignment(i, j));
			if (!this.temp) this.temp = [];
			for (let tile of this.threats)
				if (!this.xy || !isSamePoint(this.xy, tile)) {
					color = this.chessTiles[tile[0]][tile[1]].fillColor;
					if ([NON_LETHAL_COLOR, LETHAL_COLOR, CHECKED_COLOR].includes(color)) this.temp.push({xy: tile, color: color});
					this.highlightColor(tile, THREAT_COLOR);
				}
		}
	}

	// Executes when pointer exits tile
	pointerOut(i, j) {
		// restore non-selected tiles to board color
		if (!this.xy || !isSamePoint(this.xy, [i, j])) this.restoreColor([i, j]);

		// restore highlighted this.threats to board color, unless is HOVER or LETHAL color
		if (this.threats)
			for (let tile of this.threats) {
				let color = this.chessTiles[tile[0]][tile[1]].fillColor;
				if (color != HOVER_COLOR && color != LETHAL_COLOR) this.restoreColor(tile);
			}

		// restore highlighted lethal / non-lethal tile colors, if selected piece exists
		if (this.temp) {
			for (let tile of this.temp) {
				this.highlightColor(tile.xy, tile.color);
			}
		}
		this.temp = null;
		this.threats = null;

		// remove sideLights on pointer out
		this.sideLights[0][i].setColor(SIDE_BASE_COLOR); // Top letters (white)
		this.sideLights[1][i].setColor(SIDE_BASE_COLOR); // Bottom letters
		this.sideLights[2][j].setColor(SIDE_BASE_COLOR); // Left numbers
		this.sideLights[3][j].setColor(SIDE_BASE_COLOR); // Right numbers
	}

	// Executes when tile is clicked
	pointerSelect(i, j, recursion = true) {
		let pointerOver = true;

		// If in bam or zap mode (and is the first surface level invocation) create/destroy piece
		if (dev_bamzap && recursion) {
			this.unselect();
			switch (dev_bamzap) {
				case BAM:
					this.boardState.addPiece(i, j, dev_rank, dev_alignment, true);
					break;
				case ZAP:
					this.boardState.destroyPiece(i, j);
					break;
			}
			// If the tile is the same as the selected, unselect the piece
		} else if (this.xy && isSamePoint(this.xy, [i, j])) {
			this.clearBoard();
			// If the tile is occupied, check if the selected piece is the player's piece
		} else if (this.boardState.isOccupied(i, j)) {
			switch (this.boardState.getAlignment(i, j)) {
				case this.currentPlayer: // If it's the current player's piece
					this.clearBoard();

					// if checked & non-king is selected, revert king tile to checked color
					if (this.boardState.getRank(i, j) != KING && this.isChecked) {
						let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
						this.highlightColor(coordinate, CHECKED_COLOR);
					}

					// Highlight tile and possible moves, and record the selected piece in xy
					this.highlightColor([i, j], HOVER_COLOR);
					this.moves = this.boardState.searchMoves(i, j);
					for (let move of this.moves) this.highlightColor(move.xy, move.isEnemy ? LETHAL_COLOR : NON_LETHAL_COLOR);
					this.xy = [i, j];
					pointerOver = false;
					break;
				case this.currentPlayer === PLAYER ? COMPUTER : PLAYER: // If it's the opponent's piece
					// If previously selected piece exists and move is valid, destroy and move the piece
					if (this.xy && this.isValidMove([i, j])) {
						let pieceValue = this.getValueOfPiece(this.boardState.getRank(i, j));
						this.capturePiece(this.boardState.getRank(i, j), this.boardState.getAlignment(i, j));
						this.boardState.destroyPiece(i, j);
						this.boardState.movePiece(this.xy, [i, j]);
						if (this.currentPlayer == PLAYER) {
							incrementGlobalPieces(pieceValue);
							incrementGlobalMoves();
						}

						// check to see if move results in pawn promotion
						this.checkPromotion([i, j]);
						this.clearBoard();

						// Toggle turn after the move
						this.toggleTurn();
					}
					break;
			}
			// If not occupied and move is valid, move the piece
		} else if (this.xy && this.isValidMove([i, j])) {
			// if en passant move, destroy enemy pawn
			if (this.boardState.getRank(...this.xy) == PAWN && this.boardState.isEnPassant(i, j)) {
				this.capturePiece(this.boardState.getRank(i, this.xy[1]), this.boardState.getAlignment(i, this.xy[1]));
				this.boardState.destroyPiece(i, this.xy[1]);
			}
			// if castling move, also move rook
			if (this.boardState.getRank(...this.xy) == KING && Math.abs(this.xy[0] - i) == 2)
				this.boardState.movePiece([i < this.xy[0] ? 0 : 7, j], [i < this.xy[0] ? 3 : 5, this.xy[1]]);

			// if king-saving move not executed by king, restore king tile color
			if (this.boardState.getRank(...this.xy) != KING && this.isChecked) {
				let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
				this.restoreColor(coordinate);
			}

			// move piece & clear board
			this.boardState.movePiece(this.xy, [i, j]);
			if (this.currentPlayer == PLAYER) incrementGlobalMoves();

			// check to see if move results in pawn promotion
			this.checkPromotion([i, j]);
			this.clearBoard();

			// Toggle turn after the move
			this.toggleTurn();
		} else {
			pointerOver = false;
		}

		this.temp = null;

		// If something happened resulting in un-selection, trigger pointerout & pointerover event
		if (pointerOver) {
			this.pointerOut(i, j);
			this.pointerOver(i, j);
			// highlight checked king if checked
			if (this.isChecked) {
				let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
				this.temp.push({xy: coordinate, color: CHECKED_COLOR});
			}
		}
	}

	// Toggle turn & check board state & spawn wave counter
	toggleTurn(override = false) {
		// un-highlight checked king (since making a move means that the king is saved)
		if (this.isChecked) {
			this.isChecked = false;
			let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
			this.restoreColor(coordinate);
		}

		// if Flip! is clicked (override) or Stop! is disabled
		if (override || !dev_stopOn) {
			if (this.currentPlayer == PLAYER) {
				// If we're about to switch to the computer, check if any piece has valid moves
				// If they do not, all their pieces are purged and replaced, and player keeps playing
				// This should also automatically handle being out of pieces
				let computerHasValidMove = false;

				// If we have any moves, set check variable to true
				let coordinates = this.pieceCoordinates.getAllCoordinates(COMPUTER);
				for (let coordinate of coordinates)
					if (this.boardState.searchMoves(...coordinate).length) {
						computerHasValidMove = true;
						break;
					}

				// If we do, permit the computer to make a move
				if (computerHasValidMove) {
					this.currentPlayer = COMPUTER;
					if (!dev_deadAI) {
						// Delay computer move slightly
						setTimeout(() => {
							this.makeComputerMove();
						}, 300);
					}
					if (!--this.turnsUntilNextWave) this.spawnNextWave();
				} else {
					// No moves means we clear all pieces and instantly start the next wave
					this.boardState.zapPieces(COMPUTER);
					this.spawnNextWave();
				}
			} else this.currentPlayer = PLAYER;
		}

		// if king is checked highlight their tile
		this.isChecked = this.boardState.isChecked(this.currentPlayer);
		if (this.isChecked) {
			let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
			this.highlightColor(coordinate, CHECKED_COLOR);
		}

		// if checkmate or stalemate, set status & end game
		let status = null;
		if (this.boardState.isCheckmated(this.currentPlayer)) status = CHECKMATE;
		if (this.boardState.isStalemated(this.currentPlayer)) status = STALEMATE;
		setGlobalStatus(status);
		console.log(status, this.currentPlayer);
		if (status)
			import("../game/scenes/GameOver").then((module) => {
				// Only add the scene if it's not already registered
				if (!this.scene.scene.get("GameOver")) this.scene.scene.add("GameOver", module.GameOver);
				// Start the GameOver scene
				this.scene.scene.launch("GameOver");
			});
	}

	// ================================================================
	// Wave Spawning

	spawnNextWave() {
		try {
			// console.log("NEW WAVE SPAWNS!");
			// Reset turn counter
			this.turnsUntilNextWave = this.baseTurnsUntilNextWave;

			// Randomly order what priority of pieces to go through to prevent a universal bias
			let piecePriority = this.getPiecePriorityOrder();

			// Get the ordering of tiles to traverse through for new spawns
			let testSpawnLocations = this.getTilePriorityOrder();
			let testSpawnIndex = 0;

			// Spawn according to budget, piece priority, and spawn tile priority
			let currentBudget = this.waveSpawnBudget;
			let firstLoop = true;
			let outOfSpawns = false;
			while (currentBudget > 0 && !outOfSpawns) {
				// Order of pieceType is random to mitigate a bias
				for (let pieceType of piecePriority) {
					let costOfType = this.getValueOfPiece(pieceType);

					// Spawn a random amount of given pieces
					let numberOfPieces = currentBudget / costOfType;

					// On first loop, random how many pieces can spawn for variety
					// Otherwise, it'll maximize how many
					if (firstLoop) numberOfPieces = Math.floor(Math.random() * numberOfPieces);

					// Locate spawn point and instantiate if successful
					for (let pieceCount = 0; pieceCount < numberOfPieces; pieceCount++) {
						while (testSpawnIndex < testSpawnLocations.length) {
							let testSpawnLoc = testSpawnLocations[testSpawnIndex];
							if (!this.boardState.isOccupied(testSpawnLoc[0], testSpawnLoc[1])) {
								currentBudget -= costOfType;
								this.boardState.addPiece(testSpawnLoc[0], testSpawnLoc[1], pieceType, COMPUTER);

								break;
							}

							testSpawnIndex++;
						}

						// Prevent an infinite impossible loop if the entire board is full
						if (testSpawnIndex >= testSpawnLocations.length) outOfSpawns = true;
					}
				}

				firstLoop = false;
			}
		} catch (ex) {
			window.alert("Error with new wave: " + ex.message);
		}

		this.waveSpawnBudget += 2;
		incrementGlobalWaves();
	}

	// Centering procedure
	//
	// Left Bias            Right Bias
	// ---4----     or      ----5---
	// ----5---             ---4----
	// -----6--             --3-----
	// --3-----             -----6--
	// -2------             ------7-
	// ------7-             -2------
	// -------8             -1------
	// 1-------             -------8
	//
	// Could potentially introduce different spawn patterns too if this is
	// too abusable by playing along the margins
	getTilePriorityOrder() {
		// ~50% between left or right bias
		let colOrder = Math.random() < 0.5 ? [3, 4, 5, 2, 1, 6, 7, 0] : [4, 3, 2, 5, 6, 1, 0, 7];
		let output = [];

		// Travels from first row downward for finding valid spawn points
		for (let row = 0; row < 8; row++) {
			for (let col of colOrder) {
				output.push([col, row]);
			}
		}

		return output;
	}

	// Get a random order of pieces to process to prevent a universal bias
	getPiecePriorityOrder() {
		// This order doesn't matter (gets randomized)
		let piecePriority = [QUEEN, BISHOP, ROOK, KNIGHT];

		// Sort it randomly
		let currentIndex = piecePriority.length;
		while (currentIndex) {
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[piecePriority[currentIndex], piecePriority[randomIndex]] = [
				piecePriority[randomIndex],
				piecePriority[currentIndex],
			];
		}

		// Append Pawn to the end so it is always bottom priority
		// We wanted less pawns, so append it to the end to always be the lowest priority
		piecePriority.push(PAWN);

		return piecePriority;
	}

	// Gather an array of vacant tiles for valid spawn points
	// Currently unused but may be useful for more naive spawn algorithms
	collectVacantTiles() {
		let vacantTiles = [];

		try {
			for (let col = 0; col < 8; col++) {
				for (let row = 0; row < 2; row++) {
					if (!this.boardState.isOccupied(col, row)) {
						vacantTiles.push([col, row]);
					}
				}
			}
		} catch (error) {
			window.alert("Error: " + error.message);
		}

		return vacantTiles;
	}

	// Still needs Marley's constants from his branch instead of hardcoding these values
	// Based on standard Chess piece valuation, may be tweaked for balance
	getValueOfPiece(pieceType) {
		switch (pieceType) {
			case QUEEN:
				return 9;
			case ROOK:
				return 5;
			case KNIGHT:
			case BISHOP:
				return 3;
			case PAWN:
				return 1;
			default:
				return null;
		}
	}

	// ================================================================
	// Tile Highlight & Restoration

	// Highlight selected tile
	highlightColor([col, row], color) {
		this.chessTiles[col][row].setFillStyle(color);
	}

	// Get original tile color
	getTileColor([col, row]) {
		return (col + row) % 2 === 0 ? this.currentTheme.light : this.currentTheme.dark;
	}

	// Restore original tile color
	restoreColor([col, row]) {
		this.chessTiles[col][row].setFillStyle(this.getTileColor([col, row]));
	}

	// Restore original colors to all tiles
	clearBoard() {
		if (this.xy) this.restoreColor(this.xy);
		if (this.moves) for (let move of this.moves) this.restoreColor(move.xy);
		this.xy = null;
		this.moves = null;
	}

	// ================================================================
	// Miscellaneous Methods

	// Unselect the currently selected piece if any
	unselect() {
		if (this.xy) {
			let col = this.xy[0];
			let row = this.xy[1];
			this.pointerSelect(col, row, false);
			this.pointerOut(col, row);
		}
	}

	// Check whether the coordinate would be a valid move
	isValidMove([col, row]) {
		if (!this.moves) return false;
		for (let move of this.moves) if (isSamePoint(move.xy, [col, row])) return true;
		return false;
	}

	// add captured piece to the captured pieces
	capturePiece(rank, alignment) {
		this.piecesTaken.takePiece(rank, alignment);
	}

	// check whether the move results in a promotion
	checkPromotion([col, row]) {
		if (this.boardState.getRank(col, row) == PAWN && row == 0 && this.boardState.getAlignment(col, row) == PLAYER) {
			// do the promotion
			import("../game/scenes/Promotion") // Dynamically import the rules scene
				.then((module) => {
					// Only add the scene if it's not already registered
					if (!this.scene.scene.get("Promotion")) {
						this.scene.scene.add("Promotion", module.Promotion); // Add the scene dynamically
					}
					this.promotionCol = col;
					this.promotionRow = row;
					// Use launch to run scene in parallel to current
					EventBus.once("PawnPromoted", (detail) => {
						this.setPromotion(detail, PLAYER);
					});
					this.scene.scene.launch("Promotion");
				});
		} else if (
			this.boardState.getRank(col, row) == PAWN &&
			row == 7 &&
			this.boardState.getAlignment(col, row) == COMPUTER
		) {
			// set black piece to queen which is almost always correct choice,
			// ocassionally knight might be correct but this is less computationally intensive
			this.promotionCol = col;
			this.promotionRow = row;
			this.setPromotion(QUEEN, COMPUTER);
		}
	}

	setPromotion(rank, alignment) {
		if (this.boardState.getAlignment(this.promotionCol, this.promotionRow) == alignment) {
			this.boardState.destroyPiece(this.promotionCol, this.promotionRow); // might need update with capture
			this.boardState.addPiece(this.promotionCol, this.promotionRow, rank, alignment);
		}
	}

	makeComputerMove() {
		EventBus.once("ComputerMove", async (detail) => {
			console.log("move: " + detail[0] + " to " + detail[1], detail[2]);
			if (this.boardState.isOccupied(detail[1][0], detail[1][1])) {
				this.capturePiece(this.boardState.getRank(detail[1][0], detail[1][1]), PLAYER);
				this.boardState.destroyPiece(detail[1][0], detail[1][1]);
			}
			this.boardState.movePiece(detail[0], detail[1]); // make the move given
			this.checkPromotion(detail[1]);
			// this.currentPlayer = PLAYER;
			this.toggleTurn();
		});
		this.futureMoves = new ChessGameState(this.boardState.cloneBoardState());
		this.futureMoves.getBestMove();
	}
}
