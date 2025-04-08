import "phaser";
import {dev_deadAI, dev_toggleAI} from "../dev-buttons.js";
import {CHECKMATE, STALEMATE} from "../global-stats.js";
import {globalStatus, globalMoves, globalPieces, globalWaves} from "../global-stats.js";
import {ChessTiles} from "../chess-tiles.js";
jest.spyOn(ChessTiles.prototype, "checkPromotion").mockImplementation(([col, row]) => {
	return false;
});
import {resize_constants, WINDOW_WIDTH, WINDOW_HEIGHT} from "../constants.js";

// Mock ChessPiece class
class MockChessPiece {
	constructor(scene, x, y, rank, alignment) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.rank = rank;
		this.alignment = alignment;
		this.moveCounter = 0;
		this.coordinate = null;

		this.image = rank + alignment;
	}

	getAlignment() {
		return this.alignment;
	}

	getRank() {
		return this.rank;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	getMoveCounter() {
		return this.moveCounter;
	}

	incrementMoveCounter() {
		this.moveCounter++;
	}

	setCoordinate(col, row) {
		this.coordinate = [col, row];
	}

	getCoordinate() {
		return this.coordinate;
	}

	setOrigin() {
		return this;
	}

	destroy() {}
}
jest.mock("../chess-piece", () => {
	return {
		ChessPiece: (scene, x, y, rank, alignment) => {
			return new MockChessPiece(scene, x, y, rank, alignment);
		},
	};
});

import {POINTER_OVER, POINTER_OUT, POINTER_DOWN} from "./test-constants.js";
import {LEFT, RIGHT, UP, DOWN} from "./test-constants.js";

import {HOVER_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR} from "../constants.js";
import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING} from "../constants.js";
import {PLAYER, COMPUTER} from "../constants.js";

describe("", () => {
	let scene;
	let tiles;
	let x, y;

	// ================================================================
	// Mocked Classes & Methods

	// Mock WebFont
	jest.mock("webfontloader");

	// Mock Scene
	class MockScene {
		constructor() {}

		scene = {
			get: jest.fn((name) => {}),
			add: jest.fn((name, scene) => {}),
			start: jest.fn((name) => {}),
			launch: jest.fn((name) => {}),
		};

		// Mock the add.rectangle & add.text & add.existing methods
		add = {
			rectangle: jest.fn((x, y, width, height, color) => {
				return new MockRectangle(x, y, width, height, color);
			}),
			text: jest.fn((x, y, text, style) => {
				return new MockText(x, y, text, style);
			}),
			existing: jest.fn(),
		};
	}

	// Mock Rectangle class
	class MockRectangle {
		constructor(x, y, width, height, color) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.fillColor = color;
			this.origin = 0;
		}

		setOrigin(origin) {
			this.origin = origin;
			return this;
		}
		setInteractive() {
			return this;
		}
		setPosition(x, y) {
			this.x = x;
			this.y = y;
			return this;
		}
		setSize(width, height) {
			this.width = width;
			this.height = height;
			return this;
		}
		on() {
			return this;
		}

		setFillStyle(color) {
			this.fillColor = color;
			return this;
		}
	}

	// Mock Text class
	class MockText {
		constructor(x, y, text, style) {
			this.x = x;
			this.y = y;
			this.text = text;
			this.style = style;
			this.origin = 0;
			this.padding = null;
			this.fontSize = null;
		}

		setInteractive() {
			return this;
		}
		setPosition(x, y) {
			this.x = x;
			this.y = y;
			return this;
		}
		on() {
			return this;
		}
		setFontSize(fontSize) {
			this.fontSize = fontSize;
			return this;
		}
		setPadding() {
			return this;
		}

		setFillStyle(color) {
			this.fillColor = color;
			return this;
		}

		setOrigin(origin) {
			this.origin = origin;
			return this;
		}

		setStyle(style) {
			this.style = style;
			return this;
		}

		setColor(color) {
			this.style.fill = color;
			return this;
		}
	}

	// Mock Event Listener
	function mockTileEvent(event) {
		switch (event) {
			case POINTER_OVER:
				tiles.pointerOver(x, y);
				break;
			case POINTER_OUT:
				tiles.pointerOut(x, y);
				break;
			case POINTER_DOWN:
				tiles.pointerSelect(x, y);
				break;
		}
	}

	// ================================================================
	// Simulated Pointer Interaction

	// Simulate Pointer Movement (1 tile)
	function move(direction, repeat = 1) {
		for (let i = 0; i < repeat; i++) {
			mockTileEvent(POINTER_OUT);
			switch (direction) {
				case LEFT:
					x -= 1;
					break;
				case RIGHT:
					x += 1;
					break;
				case UP:
					y -= 1;
					break;
				case DOWN:
					y += 1;
					break;
			}
			mockTileEvent(POINTER_OVER);
		}
	}

	// Simulate Pointer Movement (multiple tiles)
	function shift(col, row) {
		col -= x;
		row -= y;

		move(col < 0 ? LEFT : RIGHT, Math.abs(col));
		move(row < 0 ? UP : DOWN, Math.abs(row));
	}

	// Simulate Pointer Click
	function click(col = null, row = null) {
		if (col !== null && row !== null) shift(col, row);
		mockTileEvent(POINTER_DOWN);
	}

	// ================================================================
	// Preparation for Testing

	// Prepare fresh ChessTiles before each test
	beforeEach(() => {
		// Create mock scene
		scene = new MockScene();

		// Create ChessTiles object
		tiles = new ChessTiles(scene);

		// Zap and reinstantiate computer pieces for tests
		tiles.boardState.zapPieces(COMPUTER);
		tiles.boardState.initializePieces(COMPUTER);

		if (!dev_deadAI) dev_toggleAI(); // kills AI

		// Trigger hover event where 'Start Game' button is
		x = y = 4;
		mockTileEvent("pointerover");
	});

	// Tests
	test("Test Functions Functionality", () => {
		expect(scene).toBeDefined();
		expect(tiles).toBeDefined();
		shift(0, 0);
		click();
		click(0, 0);
	});

	test("Highlight Possible Moves", () => {
		click(4, 6);
		expect(tiles.chessTiles[4][5].fillColor).toBe(NON_LETHAL_COLOR);
		expect(tiles.chessTiles[4][4].fillColor).toBe(NON_LETHAL_COLOR);
		click(4, 4);
		expect(tiles.chessTiles[4][5].fillColor).toBe(tiles.getTileColor([4, 5]));
		click(7, 1);
		expect(tiles.chessTiles[7][2].fillColor).toBe(NON_LETHAL_COLOR);
		expect(tiles.chessTiles[7][3].fillColor).toBe(NON_LETHAL_COLOR);
		click(7, 3);
		expect(tiles.chessTiles[7][2].fillColor).toBe(tiles.getTileColor([7, 2]));
		click(4, 7);
		click(3, 7);
		expect(tiles.chessTiles[4][6].fillColor).toBe(NON_LETHAL_COLOR);
		expect(tiles.chessTiles[5][5].fillColor).toBe(NON_LETHAL_COLOR);
		expect(tiles.chessTiles[6][4].fillColor).toBe(NON_LETHAL_COLOR);
		expect(tiles.chessTiles[7][3].fillColor).toBe(LETHAL_COLOR);
		click(7, 3);
		expect(tiles.chessTiles[5][5].fillColor).toBe(tiles.getTileColor([5, 5]));
		click(4, 0);
		click(6, 0);
		expect(tiles.chessTiles[7][2].fillColor).toBe(NON_LETHAL_COLOR);
		click(7, 2);
		click(7, 3);
		expect(tiles.chessTiles[7][2].fillColor).toBe(LETHAL_COLOR);
		expect(tiles.chessTiles[5][1].fillColor).toBe(LETHAL_COLOR);
		expect(tiles.chessTiles[0][3].fillColor).toBe(NON_LETHAL_COLOR);
	});

	test("Highlight Hover", () => {
		shift(1, 4);
		expect(tiles.chessTiles[1][4].fillColor).toBe(HOVER_COLOR);
		shift(7, 2);
		expect(tiles.chessTiles[1][4].fillColor).toBe(tiles.getTileColor([1, 4]));
		expect(tiles.chessTiles[7][2].fillColor).toBe(HOVER_COLOR);
		shift(0, 0);
		expect(tiles.chessTiles[7][2].fillColor).toBe(tiles.getTileColor([7, 2]));
		expect(tiles.chessTiles[0][0].fillColor).toBe(HOVER_COLOR);
	});

	test("Make Valid & Invalid Moves", () => {
		click(7, 7);
		expect(tiles.xy).toEqual([7, 7]);
		click(3, 3);
		expect(tiles.xy).toEqual([7, 7]);
		click(5, 7);
		expect(tiles.xy).toEqual([5, 7]);
		click(4, 7);
		expect(tiles.xy).toEqual([4, 7]);
		click(4, 7);
		expect(tiles.xy).toBe(null);
		click(3, 3);
		expect(tiles.xy).toBe(null);
		click(1, 7);
		expect(tiles.xy).toEqual([1, 7]);
		click(6, 1);
		expect(tiles.xy).toEqual([1, 7]);
		click(2, 5);
		expect(tiles.xy).toBe(null);
		click(3, 0);
		expect(tiles.xy).toEqual([3, 0]);
	});

	test("En Passant", () => {
		click(4, 6);
		click(4, 4);
		click(3, 1);
		click(3, 3);
		click(4, 4);
		click(3, 3);
		click(4, 1);
		click(4, 3);
		expect(tiles.boardState.isEnPassant(4, 2)).toBe(true);
		click(3, 3);
		expect(tiles.chessTiles[4][2].fillColor).toBe(LETHAL_COLOR);
		click(4, 2);
		expect(tiles.boardState.isOccupied(4, 3)).toBeFalsy();
	});

	test("Castling", () => {
		for (let i = 0; i < 8; i++) if (i != 0 && i != 4 && i != 7) tiles.boardState.destroyPiece(i, 7);
		click(4, 7);
		expect(tiles.chessTiles[2][7].fillColor).toBe(NON_LETHAL_COLOR);
		expect(tiles.chessTiles[6][7].fillColor).toBe(NON_LETHAL_COLOR);
		click(2, 7);
		expect(tiles.boardState.getRank(2, 7)).toBe(KING);
		expect(tiles.boardState.getRank(3, 7)).toBe(ROOK);
		// This part checks for the ability of the black king to castle
		// because black no longer has a king its invalid

		// for (let i = 0; i<8; i++)
		//     if (i != 0 && i != 4 && i != 7)
		//         tiles.boardState.destroyPiece(i, 0);
		// click(4, 0);
		// expect(tiles.chessTiles[2][0].fillColor).toBe(NON_LETHAL_COLOR);
		// expect(tiles.chessTiles[6][0].fillColor).toBe(NON_LETHAL_COLOR);
		// click(6, 0);
		// expect(tiles.boardState.getRank(6, 0)).toBe(KING);
		// expect(tiles.boardState.getRank(5, 0)).toBe(ROOK);
		tiles.boardState.movePiece([2, 7], [4, 7]);
		click(4, 7);
		expect(tiles.chessTiles[2][7].fillColor).toBe(tiles.getTileColor([4, 7]));
		expect(tiles.chessTiles[6][7].fillColor).toBe(tiles.getTileColor([2, 7]));
	});

	test("Threat Detection", () => {
		tiles.boardState.addPiece(6, 5, KING, COMPUTER);
		click(6, 6);
		expect(tiles.chessTiles[6][5].fillColor).toBe(THREAT_COLOR);
		click(6, 6);
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++) if (tiles.boardState.isOccupied(i, j)) tiles.boardState.destroyPiece(i, j);
		tiles.boardState.addPiece(7, 7, KING, PLAYER);
		tiles.boardState.addPiece(3, 3, QUEEN, PLAYER);
		click(3, 3);
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++)
				if ((Math.abs(i - 3) == 2 && Math.abs(j - 3) == 1) || (Math.abs(i - 3) == 1 && Math.abs(j - 3) == 2))
					tiles.boardState.addPiece(i, j, KNIGHT, COMPUTER);
				else if (i < 2 || i > 4 || j < 2 || j > 4) tiles.boardState.addPiece(i, j, QUEEN, COMPUTER);
		click(3, 3);
		shift(0, 0);
		shift(3, 3);
		for (let i = 0; i < 8; i++)
			for (let j = 0; j < 8; j++)
				if ((Math.abs(i - 3) == 2 && j >= 1 && j <= 5) || (i >= 1 && i <= 5 && Math.abs(j - 3) == 2))
					expect(tiles.chessTiles[i][j].fillColor).toBe(THREAT_COLOR);
				else if (i < 2 && i > 4 && j < 2 && j > 4)
					expect(tiles.chessTiles[i][j].fillColor).toBe(tiles.getTileColor([i, j]));
		shift(7, 7);
		tiles.boardState.addPiece(2, 3, KING, COMPUTER);
		shift(3, 3);
		expect(tiles.chessTiles[2][3].fillColor).toBe(THREAT_COLOR);
	});

	// Test currently tests black king, which no longer exists.
	// Invalid with current implementation
	// test("King is Royal", () => {
	//     click(4, 6);
	//     click(4, 4);
	//     click(4, 1);
	//     click(4, 3);
	//     click(5, 6);
	//     click(5, 4);
	//     click(5, 1);
	//     click(5, 3);
	//     click(3, 7);
	//     click(7, 3);
	//     expect(tiles.chessTiles[4][0].fillColor).toBe(CHECKED_COLOR); // Invalid test, black doesn't have a king to check
	//     click(4, 0);
	//     expect(tiles.chessTiles[4][0].fillColor).toBe(HOVER_COLOR);
	//     expect(tiles.chessTiles[5][1].fillColor).toBe(tiles.getTileColor([5, 1]));
	//     expect(tiles.chessTiles[4][1].fillColor).toBe(NON_LETHAL_COLOR);
	//     click(4, 1);
	//     shift(0, 0);
	//     expect(tiles.chessTiles[4][0].fillColor).toBe(tiles.getTileColor([4, 0]));
	//     expect(tiles.chessTiles[4][1].fillColor).toBe(tiles.getTileColor([4, 1]));
	//     click(7, 3);
	//     click(5, 1);
	//     expect(tiles.chessTiles[4][1].fillColor).toBe(THREAT_COLOR);
	//     shift(0, 0);
	//     expect(tiles.chessTiles[4][1].fillColor).toBe(CHECKED_COLOR);
	//     click(4, 1);
	//     shift(0, 0);
	//     expect(tiles.chessTiles[4][0].fillColor).toBe(tiles.getTileColor([4, 0]));
	//     expect(tiles.chessTiles[5][1].fillColor).toBe(LETHAL_COLOR);
	//     expect(tiles.chessTiles[5][2].fillColor).toBe(tiles.getTileColor([5, 2]));
	//     expect(tiles.chessTiles[4][2].fillColor).toBe(tiles.getTileColor([4, 2]));
	//     expect(tiles.chessTiles[3][2].fillColor).toBe(NON_LETHAL_COLOR);
	// });

	test("Stat Tracking", () => {
		expect(globalMoves).toBe(0);
		expect(globalPieces).toBe(0);
		click(0, 6);
		click(0, 4);
		expect(globalMoves).toBe(1);
		expect(globalPieces).toBe(0);
		click(1, 1);
		click(1, 3);
		expect(globalMoves).toBe(1);
		expect(globalPieces).toBe(0);
		click(0, 4);
		click(1, 3);
		expect(globalMoves).toBe(2);
		expect(globalPieces).toBe(1);
		click(1, 0);
		click(2, 2);
		expect(globalMoves).toBe(2);
		expect(globalPieces).toBe(1);
		click(1, 3);
		click(2, 2);
		expect(globalMoves).toBe(3);
		expect(globalPieces).toBe(2);
		click(3, 1);
		click(2, 2);
		expect(globalMoves).toBe(3);
		expect(globalPieces).toBe(2);

		let turnCountDoubled = tiles.baseTurnsUntilNextWave * 2;
		for (let i = 1; i < 100; i++) {
			tiles.toggleTurn();
			if (i % turnCountDoubled == 0) expect(globalWaves).toBe(i / turnCountDoubled);
		}
	});

	test("Checkmate", () => {
		expect(globalStatus).toBe(null);
		click(5, 6);
		click(5, 4);
		click(4, 1);
		click(4, 3);
		click(6, 6);
		click(6, 4);
		expect(globalStatus).toBe(null);
		click(3, 0);
		expect(globalStatus).toBe(null);
		click(7, 4);
		expect(globalStatus).toBe(CHECKMATE);
	});

	test("Stalemate", () => {
		tiles.toggleTurn();
		expect(globalStatus).toBe(null);
		tiles.boardState.zapPieces(PLAYER);
		tiles.boardState.addPiece(0, 7, KING, PLAYER);
		tiles.boardState.addPiece(1, 6, ROOK, COMPUTER);
		tiles.boardState.addPiece(7, 5, QUEEN, COMPUTER);
		expect(globalStatus).toBe(null);
		click(7, 5);
		expect(globalStatus).toBe(null);
		click(2, 5);
		expect(globalStatus).toBe(STALEMATE);
	});

	test("Miscellaneous", () => {
		expect(tiles.pieceCoordinates.moveCoordinate([4, 4], [4, 4], PAWN, PLAYER)).toBe(false);
		expect(tiles.pieceCoordinates.deleteCoordinate(4, 4, PAWN, PLAYER)).toBe(false);
	});

	// Wave Spawning Tests
	test("Wave Spawns More Pieces", () => {
		let countOfTilesBefore = 0;
		for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) if (tiles.boardState.isOccupied(x, y)) countOfTilesBefore++;

		tiles.spawnNextWave();

		let countOfTilesAfter = 0;
		for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) if (tiles.boardState.isOccupied(x, y)) countOfTilesAfter++;

		expect(countOfTilesBefore == countOfTilesAfter).toBe(false);
	});

	test("Wave Spawn Tile Priority", () => {
		const tilePriority = tiles.getTilePriorityOrder();
		expect(tilePriority[0][1] === 0 || tilePriority[0][0] == 4 || tilePriority[0][0] == 3).toBe(true);
	});

	test("Wave Spawn Piece Priority", () => {
		const piecePriority = tiles.getPiecePriorityOrder();
		expect(piecePriority.length == 5).toBe(true);

		let allPiecesUnique = true;
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (
					piecePriority[i] == piecePriority[j] &&
					piecePriority[i] != PAWN &&
					piecePriority[i] != ROOK &&
					piecePriority[i] != KNIGHT &&
					piecePriority[i] != BISHOP &&
					piecePriority[i] != QUEEN
				)
					allPiecesUnique = false;
				break;
			}
		}

		expect(allPiecesUnique).toBe(true);
	});

	test("Resize", () => {
		// resize1 is commented out due to github exclusive npm run test error (runs fine on local)
		window.innerWidth = 42 ** 42;
		window.innerHeight = 42;
		resize_constants();
		expect(WINDOW_WIDTH).toBe((window.innerHeight * 21) / 9);
		window.innerWidth = 42;
		window.innerHeight = 42 ** 42;
		resize_constants();
		expect(WINDOW_HEIGHT).toBe((window.innerWidth * 10) / 16);

		const resize = jest.spyOn(tiles, "resize");
		// const resize1 = jest.spyOn(tiles.boardState, "resize");
		const resize2 = jest.spyOn(tiles.devButtons, "resize");
		const resize3 = jest.spyOn(tiles.piecesTaken, "resize");
		expect(resize).not.toHaveBeenCalled();
		// expect(resize1).not.toHaveBeenCalled();
		expect(resize2).not.toHaveBeenCalled();
		expect(resize3).not.toHaveBeenCalled();
		for (let i = 0; i < 7; i++) tiles.resize();
		expect(resize).toHaveBeenCalledTimes(7);
		// expect(resize1).toHaveBeenCalledTimes(7);
		expect(resize2).toHaveBeenCalledTimes(7);
		expect(resize3).toHaveBeenCalledTimes(7);
	});
});
