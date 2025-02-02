import { TILE_SIZE,X_ANCHOR,Y_ANCHOR } from '../game-objects/constants';
import { ChessPiece } from '../game-objects/chess-piece';

export class BoardState {
    constructor(scene)
    {
        this.scene=scene;

        // set up boardState & initialize placeholder player pieces
        this.boardState=[]; // 8x8 array of chess pieces
        for (let i=0;i<8;i++)
        {
            this.boardState.push([]);
            // Initialize Player (white) pieces
            for (let j=6;j<8;j++)
                if (j==6)
                    this.addPiece(i,j,'pawn','W');
                else
                    switch(i)
                    {
                        case 0:
                        case 7:
                            this.addPiece(i,j,'rook','W');
                            break;
                        case 1:
                        case 6:
                            this.addPiece(i,j,'knight','W');
                            break;
                        case 2:
                        case 5:
                            this.addPiece(i,j,'bishop','W');
                            break;
                        case 3:
                            this.addPiece(i,j,'queen','W');
                            break;
                        case 4:
                            this.addPiece(i,j,'king','W');
                            break;
                    }
        }
    }

    // Check whether coordinate has chess piece
    isOccupied(col,row)
    {
        return !!this.boardState[col][row];
    }

    // Add piece of chosen rank & alignment to coordinate
    addPiece(col,row,rank,alignment)
    {
        this.boardState[col][row] = new ChessPiece(this.scene, X_ANCHOR+col*TILE_SIZE, Y_ANCHOR+row*TILE_SIZE, rank, alignment);
        this.scene.add.existing(this.boardState[col][row]);
    }

    // Move piece in input coordinate to output coordinate
    movePiece(inputCol, inputRow, outputCol, outputRow)
    {
        this.boardState[inputCol][inputRow].setPosition(X_ANCHOR+outputCol*TILE_SIZE, Y_ANCHOR+outputRow*TILE_SIZE);
        this.boardState[outputCol][outputRow] = this.boardState[inputCol][inputRow];
        this.boardState[inputCol][inputRow] = null;
    }
}