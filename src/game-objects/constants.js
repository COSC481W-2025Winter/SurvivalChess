const TILE_SIZE = 80;
const X_ANCHOR = 500 - 3.5 * TILE_SIZE;
const Y_ANCHOR = 360 - 3.5 * TILE_SIZE;

const GRAY = "7D7F7C";
const FAWN = "E5AA70";
const MAHOGANY = "C04000";
const VIOLET = "7F00FF";
const MAGENTA = "FF00FF";
const AZURE = "007FFF";
const DARK_GREY = "3B3B3B";
const ONYX = "3B3B3B";
const CREAM = "F4FFFD";
const GREEN = "6E9075";
const DARK_BROWN = "5C4033";
const BLACK = "000000";

const ZEROX = "0x";
const HASH = "#";

const HOVER_COLOR = ZEROX + GRAY;
const WHITE_TILE_COLOR = ZEROX + FAWN;
const BLACK_TILE_COLOR = ZEROX + MAHOGANY;
const NON_LETHAL_COLOR = ZEROX + VIOLET;
const LETHAL_COLOR = ZEROX + MAGENTA;
const THREAT_COLOR = ZEROX + AZURE;
const CHECKED_COLOR = ZEROX + BLACK;
const STAGE_COLOR = ZEROX + DARK_BROWN;

const BACKGROUND_COLOR = ZEROX + ONYX;

const START_BACKGROUND_COLOR = ZEROX + FAWN;
const START_TEXT_ONE = HASH + CREAM;
const START_TEXT_TWO = HASH + MAHOGANY;

const FAWNHEX = "E5AA70";
const MAHOGANYHEX = "C04000";
const ONYXHEX = HASH + "3B3B3B";
const CREAMHEX = HASH + "F4FFFD";
const GREENHEX = "6E9075";

const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const QUEEN = "queen";
const KING = "king";

const PLAYER = "W";
const COMPUTER = "B";

const EN_PASSANT_TOKEN = "en passant";

const DEV_MODE = true;

export const COLOR_THEMES = {
    default: { primary: "#000000", secondary: "#FFFFFF" },
    dark: { primary: "#1B1B1B", secondary: "#848482" },
    light: { primary: "#FFFFFF", secondary: "#C0C0C0" }
};

function applyColors(selectedPalette) {
    const colors = COLOR_THEMES[selectedPalette] || COLOR_THEMES.default;
    document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
    document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
}

// Call the function when needed
applyColors("default"); // Change "default" to a dynamic value if needed

export function isSamePoint([col1, row1], [col2, row2]) {
    return col1 == col2 && row1 == row2;
}

export function dim2Array(dim1, dim2) {
    return Array.from(Array(dim1), () => new Array(dim2));
}

export { TILE_SIZE, X_ANCHOR, Y_ANCHOR };
export { HOVER_COLOR, WHITE_TILE_COLOR, BLACK_TILE_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR, CHECKED_COLOR, STAGE_COLOR };
export { BACKGROUND_COLOR };
export { ONYXHEX, CREAMHEX, FAWNHEX, MAHOGANYHEX, GREENHEX };
export { START_BACKGROUND_COLOR, START_TEXT_ONE, START_TEXT_TWO };
export { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING };
export { PLAYER, COMPUTER };
export { EN_PASSANT_TOKEN };
export { DEV_MODE };
