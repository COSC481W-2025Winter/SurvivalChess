const TILE_SIZE = 80;                       // width & height of each tile
const X_ANCHOR = 512 - 3.5 * TILE_SIZE;     // x pixel of leftmost tile
const Y_ANCHOR = 384 - 3.5 * TILE_SIZE;     // y pixel of topmost tile

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

const ZEROX = "0x";
const HASH = "#";

const HOVER_COLOR = ZEROX + GRAY;           // hover color
const WHITE_TILE_COLOR = ZEROX + FAWN;      // white tile color
const BLACK_TILE_COLOR = ZEROX + MAHOGANY;  // black tile color
const NON_LETHAL_COLOR = ZEROX + VIOLET;    // non-lethal move color
const LETHAL_COLOR = ZEROX + MAGNETA;       // lethal move color
const THREAT_COLOR = ZEROX + AZURE;         // threat color
const STAGE_COLOR = ZEROX + DARK_GREY;      // chessboard stage color

const BACKGROUND_COLOR = ZEROX + ONYX;

const FAWNHEX = HASH + FAWN;                // fawn color hex
const MAHOGANYHEX = HASH + MAHOGANY;        // mahogany color hex
const ONYXHEX = HASH + ONYX;                // deep gray color hex
const CREAMHEX = HASH + CREAM;              // whitish color hex
const GREENHEX = HASH + GREEN;              // green color hex

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

export function isSamePoint([col1, row1], [col2, row2]) {
    return col1 == col2 && row1 == row2;
}

export { TILE_SIZE, X_ANCHOR, Y_ANCHOR };

export { HOVER_COLOR, WHITE_TILE_COLOR, BLACK_TILE_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR, STAGE_COLOR };
export { BACKGROUND_COLOR };
export { FAWNHEX, MAHOGANYHEX, ONYXHEX, CREAMHEX, GREENHEX };

export { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING };
export { PLAYER, COMPUTER };
export { EN_PASSANT_TOKEN };

export { DEV_MODE };

