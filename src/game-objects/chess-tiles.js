import { TILE_SIZE,X_ANCHOR,Y_ANCHOR } from './constants';
import { GRAY,FAWN,MAHOGANY,VIOLET,MAGNETA,DARK_GREY } from './constants';
import { PAWN,ROOK,KNIGHT,BISHOP,QUEEN,KING } from './constants';
import { PLAYER,COMPUTER } from './constants';
import { BoardState } from './board-state';

import { DEV_MODE } from './constants';

export class ChessTiles {
    constructor(scene)
    {
        this.scene=scene;

        this.chessTiles=[];     // 8x8 array of chess tiles
        this.boardState;        // contains BoardState object that manages an 8x8 array of chess pieces
        this.xy;                // coordinate of selected chess piece; list of [i,j]
        this.moves;             // possible moves of selected chess piece; list of dictionaries of {'xy':[#,#],'isEnemy':boolean}
        let temp;               // temporary storage of coordinate & color; dictionary of {'xy':[i,j],'color':color}
        
        this.scene.add.rectangle(X_ANCHOR+3.5*TILE_SIZE, Y_ANCHOR+3.5*TILE_SIZE, 9*TILE_SIZE, 9*TILE_SIZE, DARK_GREY);

        // set up chessTiles & pointer behaviour, as well as interaction with pieces
        for (let i=0;i<8;i++)
        {
            this.chessTiles.push([]);
            for (let j=0;j<8;j++)
            {
                // Initialize tiles & enable interaction
                this.chessTiles[i][j] = this.scene.add.rectangle(X_ANCHOR+i*TILE_SIZE, Y_ANCHOR+j*TILE_SIZE, TILE_SIZE, TILE_SIZE, this.getTileColor([i,j]));
                this.chessTiles[i][j].setInteractive();

                // When the pointer hovers over a tile, highlight it
                this.chessTiles[i][j].on("pointerover", () => {
                    let color = this.chessTiles[i][j].fillColor;
                    if (color == VIOLET || color == MAGNETA) // if highlighted as possible move, save state to restore on pointerout
                        temp = {'xy':[i,j],'color':color};
                    this.highlightColor([i,j],GRAY);
                });

                // When the pointer moves away from a tile, restore original color
                this.chessTiles[i][j].on("pointerout", () => {
                    if (!this.xy || this.xy[0]!=i || this.xy[1]!=j) // if tile isn't selected
                        this.restoreColor([i,j]);
                    if (temp)   // restore highlighted tile color
                        this.highlightColor(temp.xy,temp.color);
                });

                // When the pointer pushes down a tile, select/move piece & highlight selected tile / possible moves 
                this.chessTiles[i][j].on("pointerdown", () => {
                    if (this.xy && this.xy[0]==i && this.xy[1]==j) // if tile is same as selected, unselect piece
                        this.clearBoard();
                    else if (this.boardState.isOccupied(i,j)) // else if tile is occupied
                        switch (this.boardState.getAlignment(i,j))
                        {   
                            case PLAYER:    // if PLAYER's piece
                                if (this.xy) // if previously selected piece exists, restore corresponding tile to original color
                                    this.clearBoard();
                                this.highlightColor([i,j],GRAY);
                                this.moves = this.boardState.searchMoves(i,j);
                                for (let move of this.moves)
                                    this.highlightColor(move.xy, move.isEnemy ? MAGNETA : VIOLET);
                                this.xy = [i,j];
                                break;
                            case COMPUTER:  // if COMPUTER's piece
                                if (this.xy && this.isValidMove([i,j])) // if previously selected piece exists & move is valid, destroy then move piece
                                {
                                    this.boardState.destroyPiece(i,j);
                                    this.boardState.movePiece(this.xy,[i,j]);
                                    this.clearBoard();
                                }
                                break;
                        }
                    else if (this.xy && this.isValidMove([i,j])) // if not occupied & move is valid, move piece
                    {
                        if (this.boardState.getRank(this.xy[0],this.xy[1])==PAWN && this.boardState.isEnPassant(i,j)) // if en passant move, destroy enemy pawn
                            this.boardState.destroyPiece(i,this.xy[1]);
                        this.boardState.movePiece(this.xy,[i,j]);
                        this.clearBoard();
                    }

                    temp=null;
                });

                // if DEV_MODE is enabled; Enable COMPUTER moves via substituting pointerdown with scrolling
                if (DEV_MODE)
                    // When the pointer scrolls on a tile, select/move piece & highlight selected tile / possible moves 
                    this.chessTiles[i][j].on("wheel", () => {
                        if (this.xy && this.xy[0]==i && this.xy[1]==j) // if tile is same as selected, unselect piece
                            this.clearBoard();
                        else if (this.boardState.isOccupied(i,j)) // else if tile is occupied
                            switch (this.boardState.getAlignment(i,j))
                            {   
                                case COMPUTER:  // if COMPUTER's piece
                                    if (this.xy) // if previously selected piece exists, restore corresponding tile to original color
                                        this.clearBoard();
                                    this.highlightColor([i,j],GRAY);
                                    this.moves = this.boardState.searchMoves(i,j);
                                    for (let move of this.moves)
                                        this.highlightColor(move.xy, move.isEnemy ? MAGNETA : VIOLET);
                                    this.xy = [i,j];
                                    break;
                                case PLAYER:    // if PLAYER's piece
                                    if (this.xy && this.isValidMove([i,j])) // if previously selected piece exists & move is valid, destroy then move piece
                                    {
                                        this.boardState.destroyPiece(i,j);
                                        this.boardState.movePiece(this.xy,[i,j]);
                                        this.clearBoard();
                                    }
                                    break;
                            }
                        else if (this.xy && this.isValidMove([i,j])) // if not occupied & move is valid, move piece
                        {
                            if (this.boardState.getRank(this.xy[0],this.xy[1])==PAWN && this.boardState.isEnPassant(i,j)) // if en passant move, destroy enemy pawn
                                this.boardState.destroyPiece(i,this.xy[1]);
                            this.boardState.movePiece(this.xy,[i,j]);
                            this.clearBoard();
                        }

                        temp=null;
                    });
            }
        }

        this.boardState = new BoardState(this.scene);
    }

    // Highlight selected tile
    highlightColor([col,row],color)
    {
        this.chessTiles[col][row].setFillStyle(color);
    }

    // Restore original tile color
    restoreColor([col,row])
    {
        this.chessTiles[col][row].setFillStyle(this.getTileColor([col,row]));
    }

    // Restore original tile color
    clearBoard()
    {
        this.restoreColor(this.xy);
        for (let move of this.moves)
            this.restoreColor(move.xy);
        this.xy=null;
        this.moves=null;
    }

    // Get original tile color
    getTileColor([col,row])
    {
        return (col+row)%2==0 ? FAWN : MAHOGANY;
    }

    // Check whether the coordinate would be a valid move
    isValidMove([col,row])
    {
        if(!this.moves)
            return false;
        for (let move of this.moves)
            if (move.xy[0]==col && move.xy[1]==row)
                return true;
        return false;
    }
}