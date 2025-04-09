let WINDOW_WIDTH; // screen width
let WINDOW_HEIGHT; // screen height
let CENTER_WIDTH; // 1/2 of screen width
let CENTER_HEIGHT; // 1/2 of screen height
let DOZEN_WIDTH; // 1/12 of screen width
let DOZEN_HEIGHT; // 1/12 of screen height
let UNIT_WIDTH; // 1/144 of screen with
let UNIT_HEIGHT; // 1/144 of screen height

let TILE_SIZE; // width & height of chessboard tile
let X_CENTER; // center width of chessboard
let Y_CENTER; // center height of chessboard
let X_ANCHOR; // center width of leftmost tile of chessboard
let Y_ANCHOR; // center height of topmost tile of chessboard

let LEFT_X_CENTER; // center width of section left to chessboard
let RIGHT_X_CENTER; // center width of section right to chessboard
let LEFT_UNIT; // default unit for objects left to chessboard
let RIGHT_UNIT; // defalt unit for objects right to chessboard

resize_constants();

export function configureButtons(...buttons) {
	for (let button of buttons)
		button
			.setOrigin(0.5)
			.setInteractive()
			.on("pointerover", () => {
				button.setScale(1.2); // Increase the scale (grow the button by 20%)
			})
			.on("pointerout", () => {
				button.setScale(1); // Reset to original size
			});
}

export function paddingTexts(width, height, ...texts) {
	for (let text of texts) text.setPadding(width, height);
}

export function fontsizeTexts(fontSize, ...texts) {
	for (let text of texts) text.setFontSize(fontSize);
}

export function resize_constants(scene = null) {
	WINDOW_WIDTH = window.innerWidth;
	WINDOW_HEIGHT = window.innerHeight;
	if (WINDOW_WIDTH / WINDOW_HEIGHT > 21 / 9) WINDOW_WIDTH = (WINDOW_HEIGHT * 21) / 9;
	else if (WINDOW_WIDTH / WINDOW_HEIGHT < 16 / 10) WINDOW_HEIGHT = (WINDOW_WIDTH / 16) * 10;

	CENTER_WIDTH = WINDOW_WIDTH / 2;
	CENTER_HEIGHT = WINDOW_HEIGHT / 2;
	DOZEN_WIDTH = WINDOW_WIDTH / 12 ** 1;
	DOZEN_HEIGHT = WINDOW_HEIGHT / 12 ** 1;
	UNIT_WIDTH = WINDOW_WIDTH / 12 ** 2;
	UNIT_HEIGHT = WINDOW_HEIGHT / 12 ** 2;

	TILE_SIZE = WINDOW_HEIGHT / 9;
	X_CENTER = 4 * DOZEN_HEIGHT + 2 * DOZEN_WIDTH;
	Y_CENTER = CENTER_HEIGHT;
	X_ANCHOR = X_CENTER - 2.5 * TILE_SIZE;
	Y_ANCHOR = Y_CENTER - 3.5 * TILE_SIZE;

	LEFT_X_CENTER = (X_ANCHOR - TILE_SIZE) / 2;
	RIGHT_X_CENTER = (WINDOW_WIDTH + (X_ANCHOR + 8 * TILE_SIZE)) / 2;
	LEFT_UNIT = LEFT_X_CENTER / 3;
	RIGHT_UNIT = (WINDOW_WIDTH - RIGHT_X_CENTER) / 3;

	if (scene != null) scene.scale.resize(WINDOW_WIDTH, WINDOW_HEIGHT);
}

const GRAY = "7D7F7C";
const FAWN = "E5AA70";
const MAHOGANY = "C04000";
const VIOLET = "7F00FF";
const MAGNETA = "FF00FF";
const AZURE = "007FFF";
const ONYX = "3B3B3B";
const CREAM = "F4FFFD";
const DARK_BROWN = "5C4033";
const BLACK = "000000";
const GOLD = "FFD700";
const WHITE = "FFFFFF";

const ZEROX = "0x";
const HASH = "#";

// === TILE COLORS ===
const HOVER_COLOR = ZEROX + GRAY;
const WHITE_TILE_COLOR = ZEROX + FAWN;
const BLACK_TILE_COLOR = ZEROX + MAHOGANY;
const NON_LETHAL_COLOR = ZEROX + VIOLET;
const LETHAL_COLOR = ZEROX + MAGNETA;
const THREAT_COLOR = ZEROX + AZURE;
const CHECKED_COLOR = ZEROX + BLACK;
const STAGE_COLOR = ZEROX + DARK_BROWN;

// === BACKGROUND COLORS ===
const BACKGROUND_COLOR = ZEROX + ONYX;

// === SIDELIGHT COLORS ===
const SIDE_BASE_COLOR = HASH + WHITE;
const SIDE_HIGHLIGHT_COLOR = HASH + GOLD;

// === START SCREEN COLORS ===
const START_BACKGROUND_COLOR = ZEROX + FAWN;
const START_TEXT_ONE = HASH + CREAM;
const START_TEXT_TWO = HASH + MAHOGANY;

// === RULES SCREEN COLORS ===
const RULES_BACKGROUND_COLOR = ZEROX + MAHOGANY;
const RULES_BACKGROUND_COLOR_TWO = ZEROX + CREAM;
const RULES_TEXT_ONE = HASH + MAHOGANY;
const RULES_TEXT_TWO = HASH + FAWN;
const RULES_TEXT_THREE = HASH + CREAM;

// === GAMEOVER SCREEN COLORS ===
const GAMEOVER_BACKGROUND_COLOR = ZEROX + MAHOGANY;
const GAMEOVER_BACKGROUND_COLOR_TWO = ZEROX + CREAM;
const GAMEOVER_TEXT_ONE = HASH + MAHOGANY;
const GAMEOVER_TEXT_TWO = HASH + FAWN;
const GAMEOVER_TEXT_THREE = HASH + CREAM;

// === EXTRA HEX CODES ===
const FAWNHEX = "E5AA70";
const MAHOGANYHEX = "C04000";
const ONYXHEX = HASH + ONYX;
const CREAMHEX = HASH + CREAM;
const GREENHEX = "6E9075";

// === CHESS PIECE DEFINITIONS ===
const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const QUEEN = "queen";
const KING = "king";

// === PLAYER ROLES ===
const PLAYER = "W";
const COMPUTER = "B";

const EN_PASSANT_TOKEN = "en passant";

// === PIECE VALUES ===
const PAWN_VALUE = 1;
const KNIGHT_VALUE = 3;
const BISHOP_VALUE = 3;
const ROOK_VALUE = 5;
const QUEEN_VALUE = 9;
const KING_VALUE = 100;

const CAPTURE_WEIGHT = 100;
const LOSS_WEIGHT = 1;
const THREATEN_WEIGHT = 0.001;
const DEPTH_LIMIT = 1;

// === COLOR THEMES FOR BOARD + UI ===
export const COLOR_THEMES = {
	default: {
		light: 0xf4c28d,
		dark: 0xa33300,
		primary: "#000000",
		secondary: "#FFFFFF",
	},
	dark: {
		light: 0xbbb8b1,
		dark: 0x222222,
		primary: "#1B1B1B",
		secondary: "#848482",
	},
	light: {
		light: 0xffffff,
		dark: 0x3b3b3b,
		primary: "#FFFFFF",
		secondary: "#C0C0C0",
	},
};

// === OPTIONAL: Apply Theme to CSS Variables ===
export function applyColors(selectedPalette) {
	const colors = COLOR_THEMES[selectedPalette] || COLOR_THEMES.default;
	document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
	document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
}

// === UTILITY FUNCTIONS ===
export function isSamePoint([col1, row1], [col2, row2]) {
	return col1 == col2 && row1 == row2;
}

export function dim2Array(dim1, dim2) {
	return Array.from(Array(dim1), () => new Array(dim2));
}

export function zip(...arrays) {
	const length = Math.min(...arrays.map((arr) => arr.length));
	return Array.from({length}, (_, i) => arrays.map((arr) => arr[i]));
}

export {WINDOW_WIDTH, WINDOW_HEIGHT, CENTER_WIDTH, CENTER_HEIGHT, DOZEN_WIDTH, DOZEN_HEIGHT, UNIT_WIDTH, UNIT_HEIGHT};
export {TILE_SIZE, X_CENTER, Y_CENTER, X_ANCHOR, Y_ANCHOR};
export {LEFT_X_CENTER, RIGHT_X_CENTER, LEFT_UNIT, RIGHT_UNIT};

export {
	HOVER_COLOR,
	WHITE_TILE_COLOR,
	BLACK_TILE_COLOR,
	NON_LETHAL_COLOR,
	LETHAL_COLOR,
	THREAT_COLOR,
	CHECKED_COLOR,
	STAGE_COLOR,
};

export {BACKGROUND_COLOR};
export {SIDE_BASE_COLOR, SIDE_HIGHLIGHT_COLOR};
export {ONYXHEX, CREAMHEX, FAWNHEX, MAHOGANYHEX, GREENHEX};

export {START_BACKGROUND_COLOR, START_TEXT_ONE, START_TEXT_TWO};
export {RULES_BACKGROUND_COLOR, RULES_BACKGROUND_COLOR_TWO, RULES_TEXT_ONE, RULES_TEXT_TWO, RULES_TEXT_THREE};
export {
	GAMEOVER_BACKGROUND_COLOR,
	GAMEOVER_BACKGROUND_COLOR_TWO,
	GAMEOVER_TEXT_ONE,
	GAMEOVER_TEXT_TWO,
	GAMEOVER_TEXT_THREE,
};

export {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING};
export {PLAYER, COMPUTER};
export {EN_PASSANT_TOKEN};

export {PAWN_VALUE, KNIGHT_VALUE, BISHOP_VALUE, ROOK_VALUE, QUEEN_VALUE, KING_VALUE};
export {CAPTURE_WEIGHT, LOSS_WEIGHT, THREATEN_WEIGHT, DEPTH_LIMIT};

let devButtons = null;
export function setDevButtonsInitializedStatus(arg) {
	devButtons = arg;
}
export {devButtons};