import { BoardState } from "./board-state";
import { PLAYER,COMPUTER } from "./constants";
import { KING,QUEEN,BISHOP,KNIGHT,ROOK,PAWN } from "./constants";
import {PAWN_VALUE, KNIGHT_VALUE, BISHOP_VALUE, ROOK_VALUE,QUEEN_VALUE, KING_VALUE} from "./constants"; 
import { CAPTURE_WEIGHT, LOSS_WEIGHT, THREATEN_WEIGHT } from "./constants";
import { dim2Array } from "./constants";

const rows = 8;
const columns = 8;
const MIN = 0; // if level % 2 = 0, its a min level
const MAX = 1; // if level % 2 = 1, its a max level
const LIMIT = 4; // depth of search

// let board = dim2Array(8,8);
// console.log(board);

// let moveChain;


class gameState {
    board;
    pieceCoordinates;
    
    constructor(boardState) {
        this.board = boardState.#boardState;
        this.pieceCoordinates = boardState.#pieceCoordinates;

        // for (let i=0; i<8; i++) {
        //     for (let j=0; j<8; j++) {
        //         if (false) {

        //         }
        //     }
        // }
        // console.log(board);
    };
    
    getBestMove() {
        for (piece in this.pieceCoordinates[COMPUTER]) {

            // get possible moves for each piece
            piece.searchMove(piece)
            // Evaluate board

            //
        }
    }
    
}