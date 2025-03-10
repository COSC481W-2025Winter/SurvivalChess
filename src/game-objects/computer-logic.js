import { BoardState } from "./board-state";
import { PLAYER,COMPUTER } from "./constants";
import { KING,QUEEN,BISHOP,KNIGHT,ROOK,PAWN } from "./constants";
import {PAWN_VALUE, KNIGHT_VALUE, BISHOP_VALUE, ROOK_VALUE,QUEEN_VALUE, KING_VALUE} from "./constants"; 
import { CAPTURE_WEIGHT, LOSS_WEIGHT, THREATEN_WEIGHT } from "./constants";


const rows = 8;
const columns = 8;
let board = Array.from({ length: rows }, () => new Array(columns).fill([null,null]));
console.log(board);

let moveChain;

class gameState {
    constructor(previous) {
        let board = Array.from({ length: rows }, () => new Array(columns).fill([null,null]));
        // console.log(board);
        this.previous = previous; // previous move in the search chain
    }
}