const TILE_SIZE = 80;                       // width & height of each tile
const X_ANCHOR = 500 - 3.5 * TILE_SIZE;     // x pixel of leftmost tile
const Y_ANCHOR = 360 - 3.5 * TILE_SIZE;     // y pixel of topmost tile

const GRAY = "7D7F7C";
const FAWN = "E5AA70";
const MAHOGANY = "C04000";
const VIOLET = "7F00FF";
const MAGNETA = "FF00FF";
const AZURE = "007FFF";
const DARK_GREY = "3B3B3B";
const ONYX = "3B3B3B";
const CREAM = "F4FFFD";
const GREEN = "6E9075";
const DARK_BROWN = "5C4033";
const BLACK = "000000";

const ZEROX = "0x";
const HASH = "#";

const HOVER_COLOR = ZEROX + GRAY;           // hover color
const WHITE_TILE_COLOR = ZEROX + FAWN;      // white tile color
const BLACK_TILE_COLOR = ZEROX + MAHOGANY;  // black tile color
const NON_LETHAL_COLOR = ZEROX + VIOLET;    // non-lethal move color
const LETHAL_COLOR = ZEROX + MAGNETA;       // lethal move color
const THREAT_COLOR = ZEROX + AZURE;         // threat color
const CHECKED_COLOR = ZEROX + BLACK;        // checked color
const STAGE_COLOR = ZEROX + DARK_BROWN;     // chessboard stage color

const BACKGROUND_COLOR = ZEROX + ONYX;

const START_BACKGROUND_COLOR = ZEROX + FAWN; 
const START_TEXT_ONE = HASH + CREAM;        // main text color
const START_TEXT_TWO = HASH + MAHOGANY;     // secondary text color / outline color

const RULES_BACKGROUND_COLOR = ZEROX + MAHOGANY;
const RULES_BACKGROUND_COLOR_TWO = ZEROX + CREAM;
const RULES_TEXT_ONE = HASH + MAHOGANY;        // main text color
const RULES_TEXT_TWO = HASH + FAWN;     // secondary text color / outline color
const RULES_TEXT_THREE = HASH + CREAM;

const FAWNHEX = "E5AA70";
const MAHOGANYHEX = "C04000";
const ONYXHEX = HASH + "3B3B3B";
const CREAMHEX = HASH + "F4FFFD";
const GREENHEX = "6E9075";

const PAWN = "pawn";                        // pawn rank
const ROOK = "rook";                        // rook rank
const KNIGHT = "knight";                    // knight rank
const BISHOP = "bishop";                    // bishop rank
const QUEEN = "queen";                      // queen rank
const KING = "king";                        // king rank

const PLAYER = "W";                         // player alignment
const COMPUTER = "B";                       // computer alignment

const EN_PASSANT_TOKEN = "en passant";      // en passant token

const DEV_MODE = true; // enable development features; SET TO FALSE ON MAIN BRANCH

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

export { TILE_SIZE, X_ANCHOR, Y_ANCHOR };

export { HOVER_COLOR, WHITE_TILE_COLOR, BLACK_TILE_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR, CHECKED_COLOR, STAGE_COLOR };
export { BACKGROUND_COLOR };
export { ONYXHEX, CREAMHEX, FAWNHEX, MAHOGANYHEX, GREENHEX }
export { START_BACKGROUND_COLOR, START_TEXT_ONE, START_TEXT_TWO };
export { RULES_BACKGROUND_COLOR, RULES_BACKGROUND_COLOR_TWO, RULES_TEXT_ONE, RULES_TEXT_TWO, RULES_TEXT_THREE };

export { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING };
export { PLAYER, COMPUTER };
export { EN_PASSANT_TOKEN };

export { DEV_MODE };

export { PAWN_VALUE, KNIGHT_VALUE, BISHOP_VALUE, ROOK_VALUE,QUEEN_VALUE, KING_VALUE};
export { CAPTURE_WEIGHT, LOSS_WEIGHT, THREATEN_WEIGHT };