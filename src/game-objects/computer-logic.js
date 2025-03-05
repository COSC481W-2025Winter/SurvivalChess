import { BoardState } from "./board-state";
import { PLAYER,COMPUTER } from "./constants";
import { KING,QUEEN,BISHOP,KNIGHT,ROOK,PAWN } from "./constants";

const rows = 8;
const columns = 8;
let board = Array.from({ length: rows }, () => new Array(columns).fill([null,null]));
console.log(board);

let moveChain;

class gameState {
    constructor() {
        let board = Array.from({ length: rows }, () => new Array(columns).fill([null,null]));
        // console.log(board);
    }
}