let WINDOW_WIDTH;
let WINDOW_HEIGHT;
let CENTER_WIDTH;
let CENTER_HEIGHT;
let DOZEN_WIDTH;
let DOZEN_HEIGHT;
let UNIT_WIDTH;
let UNIT_HEIGHT;

let TILE_SIZE;
let X_CENTER;
let Y_CENTER;
let X_ANCHOR;
let Y_ANCHOR;

let LEFT_X_CENTER;
let RIGHT_X_CENTER;
let LEFT_UNIT;
let RIGHT_UNIT;

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

export {WINDOW_WIDTH, WINDOW_HEIGHT, CENTER_WIDTH, CENTER_HEIGHT, DOZEN_WIDTH, DOZEN_HEIGHT, UNIT_WIDTH, UNIT_HEIGHT};
export {LEFT_X_CENTER, RIGHT_X_CENTER, LEFT_UNIT, RIGHT_UNIT};

const GRAY = "7D7F7C";
const FAWN = "E5AA70";
const MAHOGANY = "C04000";
const VIOLET = "7F00FF";
const MAGNETA = "FF00FF";
const AZURE = "007FFF";
const ONYX = "3B3B3B";
const CREAM = "F4FFFD";
// const GREEN = "6E9075";
const DARK_BROWN = "5C4033";
const BLACK = "000000";
const GOLD = "FFD700";
const WHITE = "FFFFFF";

const ZEROX = "0x";
const HASH = "#";

const HOVER_COLOR = ZEROX + GRAY; // hover color
const WHITE_TILE_COLOR = ZEROX + FAWN; // white tile color
const BLACK_TILE_COLOR = ZEROX + MAHOGANY; // black tile color
const NON_LETHAL_COLOR = ZEROX + VIOLET; // non-lethal move color
const LETHAL_COLOR = ZEROX + MAGNETA; // lethal move color
const THREAT_COLOR = ZEROX + AZURE; // threat color
const CHECKED_COLOR = ZEROX + BLACK; // checked color
const STAGE_COLOR = ZEROX + DARK_BROWN; // chessboard stage color

const BACKGROUND_COLOR = ZEROX + ONYX;

const SIDE_BASE_COLOR = HASH + WHITE; // sideLights non-highlighted color
const SIDE_HIGHLIGHT_COLOR = HASH + GOLD; // sideLights highlighted color

const START_BACKGROUND_COLOR = ZEROX + FAWN;
const START_TEXT_ONE = HASH + CREAM; // main text color
const START_TEXT_TWO = HASH + MAHOGANY; // secondary text color / outline color

const RULES_BACKGROUND_COLOR = ZEROX + MAHOGANY;
const RULES_BACKGROUND_COLOR_TWO = ZEROX + CREAM;
const RULES_TEXT_ONE = HASH + MAHOGANY; // main text color
const RULES_TEXT_TWO = HASH + FAWN; // secondary text color / outline color
const RULES_TEXT_THREE = HASH + CREAM;

const GAMEOVER_BACKGROUND_COLOR = ZEROX + MAHOGANY;
const GAMEOVER_BACKGROUND_COLOR_TWO = ZEROX + CREAM;
const GAMEOVER_TEXT_ONE = HASH + MAHOGANY; // main text color
const GAMEOVER_TEXT_TWO = HASH + FAWN; // secondary text color / outline color
const GAMEOVER_TEXT_THREE = HASH + CREAM;

const FAWNHEX = "E5AA70";
const MAHOGANYHEX = "C04000";
const ONYXHEX = HASH + ONYX;
const CREAMHEX = HASH + CREAM;
const GREENHEX = "6E9075";

const PAWN = "pawn"; // pawn rank
const ROOK = "rook"; // rook rank
const KNIGHT = "knight"; // knight rank
const BISHOP = "bishop"; // bishop rank
const QUEEN = "queen"; // queen rank
const KING = "king"; // king rank

const PLAYER = "W"; // player alignment
const COMPUTER = "B"; // computer alignment

const EN_PASSANT_TOKEN = "en passant"; // en passant token
export const COLOR_THEMES = {
	default: {primary: "#000000", secondary: "#FFFFFF"},
	dark: {primary: "#1B1B1B", secondary: "#848482"},
	light: {primary: "#FFFFFF", secondary: "#C0C0C0"},
};

function applyColors(selectedPalette) {
	const colors = COLOR_THEMES[selectedPalette] || COLOR_THEMES.default;
	document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
	document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
}

// Call the function when needed
applyColors("default"); // Change "default" to a dynamic value if needed

const PAWN_VALUE = 1;
const KNIGHT_VALUE = 3;
const BISHOP_VALUE = 3;
const ROOK_VALUE = 5;
const QUEEN_VALUE = 9;
const KING_VALUE = 100;

const CAPTURE_WEIGHT = 1;
const LOSS_WEIGHT = 0.1;
const THREATEN_WEIGHT = 0.01;

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

export {TILE_SIZE, X_CENTER, Y_CENTER, X_ANCHOR, Y_ANCHOR};

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
export {CAPTURE_WEIGHT, LOSS_WEIGHT, THREATEN_WEIGHT};
