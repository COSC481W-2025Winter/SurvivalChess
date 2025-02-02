import { TILE_SIZE,X_ANCHOR,Y_ANCHOR } from '../game-objects/constants';
import { BoardState } from '../game-objects/board-state';

import { GRAY,FAWN,MAHOGANY } from '../game-objects/constants';

export class ChessTiles {
    constructor(scene)
    {
        this.scene=scene;

        this.boardState;

        this.chessTiles=[]; // 8x8 array of chess tiles
        let xy; // coordinate of selected chess piece
        
        // set up chessTiles & pointer behaviour, as well as interaction with pieces
        for (let i=0;i<8;i++)
        {
            this.chessTiles.push([]);
            for (let j=0;j<8;j++)
            {
                // Initialize tiles & enable interaction
                this.chessTiles[i][j] = this.scene.add.rectangle(X_ANCHOR+i*TILE_SIZE, Y_ANCHOR+j*TILE_SIZE, TILE_SIZE, TILE_SIZE, this.getTileColor(i,j));
                this.chessTiles[i][j].setInteractive();

                // When the pointer hovers over a tile, highlight it
                this.chessTiles[i][j].on("pointerover", () => {
                    this.highlightColor(i,j);
                });

                // When the pointer moves away from a tile, restore original color
                this.chessTiles[i][j].on("pointerout", () => {
                    if (!xy || xy[0]!=i || xy[1]!=j) // if tile isn't selected
                        this.restoreColor(i,j);
                });

                // When the pointer pushes down a tile, select/move piece & highlight selected tile
                this.chessTiles[i][j].on("pointerdown", () => {
                    if (this.boardState.isOccupied(i,j)) // select (pick up) piece
                    {
                        if (xy) // if previously selected piece exists, restore corresponding tile to original color
                            this.restoreColor(xy[0],xy[1]); 
                        this.highlightColor(i,j);
                        xy = [i,j];
                    }
                    else if (xy) // move (put down) selected piece
                    {
                        this.restoreColor(xy[0],xy[1]);
                        this.boardState.movePiece(xy[0],xy[1],i,j);
                        xy = null;
                    }

                });
            }
        }

        this.boardState = new BoardState(this.scene);
    }

    // Highlight tile with color
    highlightColor(i,j)
    {
        this.chessTiles[i][j].setFillStyle(GRAY);
    }

    // Restore original tile color
    restoreColor(i,j)
    {
        this.chessTiles[i][j].setFillStyle(this.getTileColor(i,j));
    }

    // Get original tile color
    getTileColor(i,j)
    {
        return (i+j)%2==0 ? FAWN : MAHOGANY;
    }
}