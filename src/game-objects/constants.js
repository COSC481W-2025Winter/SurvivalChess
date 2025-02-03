const TILE_SIZE = 80;   // width & height of each tile
const X_ANCHOR = 512-3.5*TILE_SIZE;   // leftmost pixel of chess board
const Y_ANCHOR = 384-3.5*TILE_SIZE;   // topmost pixel of chess board

const GRAY = "0x7D7F7C";        // highlight color
const FAWN = "0xE5AA70";        // white color
const MAHOGANY = "0xC04000";    // black color
const VIOLET = "0x7F00FF";      // non-lethal color
const MAGNETA = "0xFF00FF";     // lethal color
const DARK_GREY = "0x3b3b3b";   // stage color

const PLAYER = "W";     // player color
const COMPUTER = "B";   // computer color

const DEV_MODE = true;  // enable development features; SET TO FALSE ON MAIN BRANCH

export { TILE_SIZE,X_ANCHOR,Y_ANCHOR };
export { GRAY,FAWN,MAHOGANY,VIOLET,MAGNETA,DARK_GREY };
export { PLAYER,COMPUTER };
export { DEV_MODE };