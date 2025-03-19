//local constants for my "captured pieces" container
const TILE_SIZE = 52;                       // width & height of each tile
const X_ANCHOR = 1072 - 3.5 * TILE_SIZE;     // x pixel of leftmost tile
const Y_ANCHOR = 300 - 3.5 * TILE_SIZE;     // y pixel of topmost tile for captured table
import { WHITE_TILE_COLOR, BLACK_TILE_COLOR, STAGE_COLOR, CREAMHEX, GREENHEX } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING, START_TEXT_ONE, START_TEXT_TWO} from './constants';
import { PLAYER, COMPUTER } from './constants';
import { ChessPiece } from './chess-piece';


export class PiecesTaken {

    preload() {
        this.load.setPath("assets");
        // Load Chess piece pngs
        this.load.setPath("assets/ourChessPieces");
        for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN])
            for (let alignment of [PLAYER, COMPUTER])
                this.load.image(rank + alignment, rank + alignment + "4.png");         
    }

    

    scene;
    piecesTaken;

    wPawnScore;
    bPawnScore;
    wRookScore;
    bRookScore;
    wKnightScore;
    bKnightScore;
    wBishopScore;
    bBishopScore;
    wQueenScore;
    bQueenScore;

    wPawnScores;
    bPawnScores;
    wRookScores;
    bRookScores;
    wKnightScores;
    bKnightScores;
    wBishopScores;
    bBishopScores;
    wQueenScores;
    bQueenScores;


    constructor (scene) {

        //set up variables to keep track of elements
        this.scene = scene;
        this.piecesTaken = [];

        this.wPawnScore = 0;
        this.bPawnScore = 0;
        this.wRookScore = 0;
        this.bRookScore = 0;
        this.wKnightScore = 0;
        this.bKnightScore = 0;
        this.wBishopScore = 0;
        this.bBishopScore = 0;
        this.wQueenScore = 0;
        this.bQueenScore = 0;

        //add the title and the two "boxes" for the pieces
        this.scene.add
            .text(930, 26, "Captured Pieces:", {
                fontFamily: "'Sans', sans-serif",
                fontSize: 32,
                color: START_TEXT_ONE
            });
        this.scene.add.rectangle(
            1050,
            144,
            7.25 * TILE_SIZE,
            2.5 * TILE_SIZE,
            WHITE_TILE_COLOR
        );
        this.scene.add.rectangle(
            1050,
            144,
            7 * TILE_SIZE,
            2.25 * TILE_SIZE,
            BLACK_TILE_COLOR
        );
        // Set up captured pieces table
        for (let i = 0; i < 5; i++) {
            this.piecesTaken.push([]);
        }

        var j = 0;
        this.addPiece(0, j, PAWN, COMPUTER);
        this.addPiece(1, j, ROOK, COMPUTER);
        this.addPiece(2, j, KNIGHT, COMPUTER);
        this.addPiece(3, j, BISHOP, COMPUTER);
        this.addPiece(4, j, QUEEN, COMPUTER);
        

        var j = 1;
        this.addPiece(0, j, PAWN, PLAYER);
        this.addPiece(1, j, ROOK, PLAYER);
        this.addPiece(2, j, KNIGHT, PLAYER);
        this.addPiece(3, j, BISHOP, PLAYER);
        this.addPiece(4, j, QUEEN, PLAYER);

        //add in score keeping
        this.scene.bPawnScores = this.scene.add
                    .text(X_ANCHOR + 26, Y_ANCHOR - 10, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.bRookScores = this.scene.add
                    .text(X_ANCHOR + 26 + 72, Y_ANCHOR - 10, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.bKnightScores = this.scene.add
                    .text(X_ANCHOR + 26 + 2 * 72, Y_ANCHOR - 10, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.bBishopScores = this.scene.add
                    .text(X_ANCHOR + 26 + 3 * 72, Y_ANCHOR - 10, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.bQueenScores = this.scene.add
                    .text(X_ANCHOR + 26 + 4 * 72, Y_ANCHOR - 10, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });

        this.scene.wPawnScores = this.scene.add
                    .text(X_ANCHOR + 26, Y_ANCHOR - 10 + TILE_SIZE, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.wRookScores = this.scene.add
                    .text(X_ANCHOR + 26 + 72, Y_ANCHOR - 10 + TILE_SIZE, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.wKnightScores = this.scene.add
                    .text(X_ANCHOR + 26 + 2 * 72, Y_ANCHOR - 10 + TILE_SIZE, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.wBishopScores = this.scene.add
                    .text(X_ANCHOR + 26 + 3 * 72, Y_ANCHOR - 10 + TILE_SIZE, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
        this.scene.wQueenScores = this.scene.add
                    .text(X_ANCHOR + 26 + 4 * 72, Y_ANCHOR - 10 + TILE_SIZE, "0", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 22,
                        color: START_TEXT_ONE
                    });
    }

    addPiece(i, j, rank, alignment) {

        this.piecesTaken[i][j] = new ChessPiece(
            this.scene,
            X_ANCHOR + i * 72,
            Y_ANCHOR + j * TILE_SIZE,
            rank,
            alignment
        );
        this.scene.add.existing(this.piecesTaken[i][j]);
        this.scene.add
                    .text(X_ANCHOR + 15 + i * 72, Y_ANCHOR - 7 + j * TILE_SIZE, "x ", {
                        fontFamily: "'Sans', sans-serif",
                        fontSize: 16,
                        color: START_TEXT_ONE
                    });   
    }

    takePiece(rank, alignment) {

        //determine which count to update from based on rank and alignment
        if (alignment == PLAYER){
            if (rank == PAWN){
                this.scene.wPawnScore = this.wPawnScore + 1;
                var t = this.scene.wPawnScore.toString();
                this.scene.wPawnScores.setText(t);
                this.wPawnScore = this.wPawnScore + 1;
            }
            if (rank == KNIGHT){
                this.scene.wKnightScore = this.wKnightScore + 1;
                var t = this.scene.wKnightScore.toString();
                this.scene.wKnightScores.setText(t);
                this.wKnightScore = this.wKnightScore + 1;
            }
            if (rank == ROOK){
                this.scene.wRookScore = this.wRookScore + 1;
                var t = this.scene.wRookScore.toString();
                this.scene.wRookScores.setText(t);
                this.wRookScore = this.wRookScore + 1;
            }
            if (rank == BISHOP){
                this.scene.wBishopScore = this.wBishopScore + 1;
                var t = this.scene.wBishopScore.toString();
                this.scene.wBishopScores.setText(t);
                this.wBishopScore = this.wBishopScore + 1;
            }
            if (rank == QUEEN){
                this.scene.wQueenScore = this.wQueenScore + 1;
                var t = this.scene.wQueenScore.toString();
                this.scene.wQueenScores.setText(t);
                this.wQueenScore = this.wQueenScore + 1;
            }
        } else if (alignment == COMPUTER){
            if (rank == PAWN){
                this.scene.bPawnScore = this.bPawnScore + 1;
                var t = this.scene.bPawnScore.toString();
                this.scene.bPawnScores.text = t;
                this.bPawnScore = this.bPawnScore + 1;
            }
            if (rank == KNIGHT){
                this.scene.bKnightScore = this.bKnightScore + 1;
                var t = this.scene.bKnightScore.toString();
                this.scene.bKnightScores.setText(t);
                this.bKnightScore = this.bKnightScore + 1;
            }
            if (rank == ROOK){
                this.scene.bRookScore = this.bRookScore + 1;
                var t = this.scene.bRookScore.toString();
                this.scene.bRookScores.setText(t);
                this.bRookScore = this.bRookScore + 1;
            }
            if (rank == BISHOP){
                this.scene.bBishopScore = this.bBishopScore + 1;
                var t = this.scene.bBishopScore.toString();
                this.scene.bBishopScores.setText(t);
                this.bBishopScore = this.bBishopScore + 1;
            }
            if (rank == QUEEN){
                this.scene.bQueenScore = this.bQueenScore + 1;
                var t = this.scene.bQueenScore.toString();
                this.scene.bQueenScores.setText(t);
                this.bQueenScore = this.bQueenScore + 1;
            }
        }
    }


    
}