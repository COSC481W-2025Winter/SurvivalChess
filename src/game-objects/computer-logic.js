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
    // bestMove;
    bestValue;
    bestMoveInput;
    bestMoveOutput;
    
    constructor(boardState) {
        this.board = boardState.#boardState;
        this.pieceCoordinates = boardState.#pieceCoordinates;
        // this.bestMove = null;
        this.bestValue = 10000; // want lowest possible value
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
            for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING]) { // for all types of computer pieces
                for (let coordinates of rank) { // for each computer piece of a given rank
                    moves = this.board.searchMove(coordinates[0], coordinates[1]);
                    // all possible moves for a piece
                    for (move in moves) {
                        this.evaluateBoard(this.board, (coordinates[0], coordinates[1]), move['xy']); // get score for board
                    }
                }
            }
            // get possible moves for each piece
            // let moves = piece.searchMove(piece)
            // Evaluate board

            //
        }
    }
    
    // determines score of a board, lower is better for computer
    evaluateBoard(boardState, input, output) {
        boardState.makeMove(input, output); // make the move
        let score = 0; // initialize score

        // get total value of player material
        for (piece in this.pieceCoordinates[PLAYER]) { 
            for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING]) { // for all types of computer pieces
                for (let count of rank) { // for each player piece of a given rank
                    switch(rank) {
                        case PAWN:
                            score+=PAWN_VALUE;
                            break;
                        case ROOK:
                            score+=ROOK_VALUE;
                            break;
                        case BISHOP:
                            score+=BISHOP_VALUE;
                            break;
                        case KNIGHT:
                            score+=KNIGHT_VALUE;
                            break;
                        case QUEEN:
                            score+=QUEEN_VALUE
                            break;
                        case KING:
                            score+=KING_VALUE
                    }
                }
            }
        }

        if (score < bestValue) { // if move is better than current best move
            this.bestValue=score;
            this.bestMoveInput = input;
            this.bestMoveOutput = output;
        }
}

}