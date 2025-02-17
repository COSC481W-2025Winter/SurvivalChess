const TILE_SIZE = 40;                       // width & height of each tile
const X_ANCHOR = 1056 - 3.5 * TILE_SIZE;     // x pixel of leftmost tile
const Y_ANCHOR = 194 - 3.5 * TILE_SIZE;     // y pixel of topmost tile
import { WHITE_TILE_COLOR, BLACK_TILE_COLOR, STAGE_COLOR, CREAMHEX, GREENHEX } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from './constants';
import { PLAYER, COMPUTER } from './constants';
import { ChessPiece } from './chess-piece';


export class PiecesTaken{

    constructor (scene){

        this.scene = scene;
        this.piecesTaken = [];
        this.scene.add.rectangle(
            X_ANCHOR + 3.5 * TILE_SIZE,
            Y_ANCHOR + 3.5 * TILE_SIZE,
            9 * TILE_SIZE,
            9 * TILE_SIZE,
            WHITE_TILE_COLOR
        );
        this.x = 0;
        this.y = 0;
        
        // Set up chess table
        for (let i = 0; i < 8; i++) {
            this.piecesTaken.push([]);
            for (let j = 0; j < 8; j++) {
                // Initialize tiles
                this.piecesTaken[i][j] = this.scene.add.rectangle(
                    X_ANCHOR + i * TILE_SIZE,
                    Y_ANCHOR + j * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE,
                    CREAMHEX
                );/*
                switch (j){
                    case 0:
                        switch (i){
                            case 0:
                            case 7:
                                this.addPiece(i, j, ROOK, COMPUTER);
                                break; 
                            case 1:
                            case 6:
                                this.addPiece(i, j, KNIGHT, COMPUTER);
                                break;
                            case 2:
                            case 5:
                                this.addPiece(i, j, BISHOP, COMPUTER);
                                break;
                            case 3:
                                this.addPiece(i, j, QUEEN, COMPUTER);
                                break;
                            case 4:
                                this.addPiece(i, j, KING, COMPUTER);
                                break;
                        }
                        break;
                    case 1:
                        this.addPiece(i, j, PAWN, COMPUTER);
                        break;
                    case 6:
                        this.addPiece(i, j, PAWN, PLAYER);
                        break;
                    case 7:
                        switch (i){
                            case 0:
                            case 7:
                                this.addPiece(i, j, ROOK, PLAYER);
                                break; 
                            case 1:
                            case 6:
                                this.addPiece(i, j, KNIGHT, PLAYER);
                                break;
                            case 2:
                            case 5:
                                this.addPiece(i, j, BISHOP, PLAYER);
                                break;
                            case 3:
                                this.addPiece(i, j, QUEEN, PLAYER);
                                break;
                            case 4:
                                this.addPiece(i, j, KING, PLAYER);
                                break;
                        }
                        break;
                }*/
        
            }
        }


    }


    getTileColor([col, row]) {
        return (col + row) % 2 == 0 ? WHITE_TILE_COLOR : BLACK_TILE_COLOR;
    }
    addPiece(rank, alignment) {
        col = this.x;
        row = this.y;
        this.piecesTaken[col][row] = new ChessPiece(
            this.scene,
            X_ANCHOR + col * TILE_SIZE,
            Y_ANCHOR + row * TILE_SIZE,
            rank,
            alignment
        );
        this.scene.add.existing(this.piecesTaken[col][row]);
    }
}