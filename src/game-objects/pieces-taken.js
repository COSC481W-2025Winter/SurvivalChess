//local constants for my "captured pieces" container
const TILE_SIZE = 52;                       // width & height of each tile
const X_ANCHOR = 1100 - 3.5 * TILE_SIZE;     // x pixel of leftmost tile
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
        for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING])
            for (let alignment of [PLAYER, COMPUTER])
                this.load.image(rank + alignment, rank + alignment + "4.png");
    }

    scene;
    piecesTaken;

    constructor (scene) {

        //set up variables to keep track of elements
        this.scene = scene;
        this.piecesTaken = [];

        this.scene.add
            .text(930, 18, "Captured Pieces:", {
                fontFamily: "'Sans', sans-serif",
                fontSize: 32,
                color: START_TEXT_ONE
            })
            


        this.scene.add.rectangle(
            1048,
            144,
            7 * TILE_SIZE,
            3 * TILE_SIZE,
            WHITE_TILE_COLOR
        );
        this.scene.add.rectangle(
            1048,
            144,
            6 * TILE_SIZE,
            2 * TILE_SIZE,
            BLACK_TILE_COLOR
        );
        // Set up captured pieces table
        for (let i = 0; i < 6; i++) {
            this.piecesTaken.push([]);
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
        /*

        //determine which count to update from based on rank and alignment
        if (alignment == PLAYER){
            if (rank == PAWN){
            } else {
                if (rank == KNIGHT){

                }
                if (rank == ROOK){
                    
                }
                if (rank == BISHOP){
                    
                }
                if (rank == QUEEN){
                    
                }
                if (rank == KING){
                    
                }
            }
        } else {
            if (rank == PAWN){
                
            } else {
                inrow = 2;
                if (rank == KNIGHT){
                    
                }
                if (rank == ROOK){
                    
                }
                if (rank == BISHOP){
                    
                }
                if (rank == QUEEN){
                    
                }
                //this will be removed after the computer no longer has a
                if (rank == KING){
                    
                }
            }
        }


        */
    }


    
}