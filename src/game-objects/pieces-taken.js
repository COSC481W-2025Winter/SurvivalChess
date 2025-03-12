//local constants for my "captured pieces" container
const TILE_SIZE = 52;                       // width & height of each tile
const X_ANCHOR = 1100 - 3.5 * TILE_SIZE;     // x pixel of leftmost tile
const Y_ANCHOR = 300 - 3.5 * TILE_SIZE;     // y pixel of topmost tile for captured table
import { WHITE_TILE_COLOR, BLACK_TILE_COLOR, STAGE_COLOR, CREAMHEX, GREENHEX } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from './constants';
import { PLAYER, COMPUTER } from './constants';
import { ChessPiece } from './chess-piece';


export class PiecesTaken {

    preload() {
        this.load.setPath("assets");
        // Load Chess piece pngs
        this.load.setPath("assets/ourChessPieces");
        for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING])
            for (let alignment of [PLAYER, COMPUTER])
                this.load.image(rank + alignment, rank + alignment + "4.png");
    }

    scene;
    piecesTaken;
    x;
    y;
    wKnightTaken;
    wRookTaken;
    wBishopTaken;
    bKnightTaken;
    bRookTaken;
    bBishopTaken;
    nextPawnW;
    nextPawnB;

    constructor (scene) {

        //set up variables to keep track of elements
        this.scene = scene;
        this.piecesTaken = [];
        this.x = 0;
        this.y = 0;
        this.wKnightTaken = false;
        this.wRookTaken = false;
        this.wBishopTaken = false;
        this.bKnightTaken = false;
        this.bRookTaken = false;
        this.bBishopTaken = false;
        this.nextPawnW = 0;
        this.nextPawnB = 0;

        this.scene.add.rectangle(
            1048,
            144,
            7 * TILE_SIZE,
            3 * TILE_SIZE,
            WHITE_TILE_COLOR
        );
        
        // Set up captured pieces table
        for (let i = 0; i < 6; i++) {
            this.piecesTaken.push([]);
            for (let j = 0; j < 2; j++) {
                // Initialize tiles
                this.piecesTaken[i][j] = this.scene.add.rectangle(
                    X_ANCHOR + i * TILE_SIZE,
                    Y_ANCHOR + j * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE,
                    BLACK_TILE_COLOR
                );
        
            }
        }



        var j = 0;
        this.addPiece(0, j, PAWN, COMPUTER);
        this.addPiece(1, j, ROOK, COMPUTER);
        this.addPiece(2, j, KNIGHT, COMPUTER);
        this.addPiece(3, j, BISHOP, COMPUTER);
        this.addPiece(4, j, QUEEN, COMPUTER);
        this.addPiece(5, j, KING, COMPUTER);

        var j = 1;
        this.addPiece(0, j, PAWN, PLAYER);
        this.addPiece(1, j, ROOK, PLAYER);
        this.addPiece(2, j, KNIGHT, PLAYER);
        this.addPiece(3, j, BISHOP, PLAYER);
        this.addPiece(4, j, QUEEN, PLAYER);
        this.addPiece(5, j, KING, PLAYER);

    }

    addPiece(i, j, rank, alignment) {

        this.piecesTaken[i][j] = new ChessPiece(
            this.scene,
            X_ANCHOR + i * TILE_SIZE,
            Y_ANCHOR + j * TILE_SIZE,
            rank,
            alignment
        );
        this.scene.add.existing(this.piecesTaken[i][j]);
        
    }

    takePiece(rank, alignment) {
        var inrow;
        var incol;

        //determine which rows to select from based on rank, alignment, and what pieces have been taken
        if (alignment == PLAYER){
            if (rank == PAWN){
                inrow = 5;
                incol = this.nextPawnW;
                this.nextPawnW += 1;
            } else {
                inrow = 4;
                if (rank == KNIGHT){
                    if (this.wKnightTaken){
                        incol = 3;
                    } else {
                        incol = 2;
                        this.wKnightTaken = true;
                    }
                }
                if (rank == ROOK){
                    if (this.wRookTaken){
                        incol = 1;
                    } else {
                        incol = 0;
                        this.wRookTaken = true;
                    }
                }
                if (rank == BISHOP){
                    if (this.wBishopTaken){
                        incol = 5;
                    } else {
                        incol = 4;
                        this.wBishopTaken = true;
                    }
                }
                if (rank == QUEEN){
                    incol = 6;
                }
                if (rank == KING){
                    incol = 7;
                }
            }
        } else {
            if (rank == PAWN){
                inrow = 3;
                incol = this.nextPawnB;
                this.nextPawnB += 1;
            } else {
                inrow = 2;
                if (rank == KNIGHT){
                    if (this.bKnightTaken){
                        incol = 3;
                    } else {
                        incol = 2;
                        this.bKnightTaken = true;
                    }
                }
                if (rank == ROOK){
                    if (this.bRookTaken){
                        incol = 1;
                    } else {
                        incol = 0;
                        this.bRookTaken = true;
                    }
                }
                if (rank == BISHOP){
                    if (this.bBishopTaken){
                        incol = 5;
                    } else {
                        incol = 4;
                        this.bBishopTaken = true;
                    }
                }
                if (rank == QUEEN){
                    incol = 6;
                }
                if (rank == KING){
                    incol = 7;
                }
            }
        }


        this.piecesTaken[incol][inrow].setPosition(X_ANCHOR + this.y * TILE_SIZE, Y_ANCHOR + this.x * TILE_SIZE);
        this.piecesTaken[this.y][this.x] = this.piecesTaken[incol][inrow];
        this.piecesTaken[incol][inrow] = null;
        this.updateXY();
    }

    //updates x and y to keep track of where to put the next captured piece
    updateXY() {
        if (this.y == 7){
            this.x += 1;
            this.y = 0;
        }else{
            this.y += 1;
        }
    }

    
}