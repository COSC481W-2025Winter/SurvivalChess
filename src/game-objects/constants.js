const TILE_SIZE = 80; // width & height of each tile
const X_ANCHOR = 512 - 3.5 * TILE_SIZE; // leftmost pixel of chess board
const Y_ANCHOR = 384 - 3.5 * TILE_SIZE; // topmost pixel of chess board

const GRAY = "0x7D7F7C"; // highlight color
const FAWN = "0xE5AA70"; // white color
const MAHOGANY = "0xC04000"; // black color
const ONYX = "0x3B3B3B"; //deep gray color
const CREAM = "0xF4FFFD"; //whiteish color
const GREEN = "0x6E9075"; // green color
const VIOLET = "0x7F00FF"; // non-lethal color
const MAGNETA = "0xFF00FF"; // lethal color
const DARK_GREY = "0x3b3b3b"; // stage color

const FAWNHEX = "#E5AA70"; // fawn color hex
const MAHOGANYHEX = "#C04000"; // mahogany color hex
const ONYXHEX = "#3B3B3B"; // deep gray color hex
const CREAMHEX = "#F4FFFD"; // whitish color hex
const GREENHEX = "#6E9075"; // green color hex

const PAWN = "pawn"; // pawn rank
const ROOK = "rook"; // rook rank
const KNIGHT = "knight"; // knight rank
const BISHOP = "bishop"; // bishop rank
const QUEEN = "queen"; // queen rank
const KING = "king"; // king rank

const PLAYER = "W"; // player alignment
const COMPUTER = "B"; // computer alignment

const EN_PASSANT_TOKEN = "en passant"; // en passant token

const DEV_MODE = true; // enable development features; SET TO FALSE ON MAIN BRANCH

export { TILE_SIZE, X_ANCHOR, Y_ANCHOR };
export { GRAY, FAWN, MAHOGANY, ONYX, CREAM, GREEN, VIOLET, MAGNETA, DARK_GREY };
export { FAWNHEX, MAHOGANYHEX, ONYXHEX, CREAMHEX, GREENHEX };
export { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING };
export { PLAYER, COMPUTER };
export { EN_PASSANT_TOKEN };
export { DEV_MODE };

