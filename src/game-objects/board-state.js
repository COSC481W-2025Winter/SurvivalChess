import { TILE_SIZE,X_ANCHOR,Y_ANCHOR } from './constants';
import { PLAYER,COMPUTER } from './constants';
import { ChessPiece } from './chess-piece';

export class BoardState {
    constructor(scene)
    {
        this.scene=scene;

        this.boardState=[]; // 8x8 array of chess pieces

        // set up boardState & initialize player pieces (and computer pieces for testing purposes)
        for (let i=0;i<8;i++)
        {
            this.boardState.push([]);
            // Initialize Player (white) pieces
            for (let j=6;j<8;j++)
                if (j==6)
                    this.addPiece(i,j,'pawn',PLAYER);
                else
                    switch (i)
                    {
                        case 0:
                        case 7:
                            this.addPiece(i,j,'rook',PLAYER);
                            break;
                        case 1:
                        case 6:
                            this.addPiece(i,j,'knight',PLAYER);
                            break;
                        case 2:
                        case 5:
                            this.addPiece(i,j,'bishop',PLAYER);
                            break;
                        case 3:
                            this.addPiece(i,j,'queen',PLAYER);
                            break;
                        case 4:
                            this.addPiece(i,j,'king',PLAYER);
                            break;
                    }
            // Initialize Computer (black) pieces
            for (let j=0;j<2;j++)
                if (j==1)
                    this.addPiece(i,j,'pawn',COMPUTER);
                else
                    switch (i)
                    {
                        case 0:
                        case 7:
                            this.addPiece(i,j,'rook',COMPUTER);
                            break;
                        case 1:
                        case 6:
                            this.addPiece(i,j,'knight',COMPUTER);
                            break;
                        case 2:
                        case 5:
                            this.addPiece(i,j,'bishop',COMPUTER);
                            break;
                        case 3:
                            this.addPiece(i,j,'queen',COMPUTER);
                            break;
                        case 4:
                            this.addPiece(i,j,'king',COMPUTER);
                            break;
                    }
        }
    }
    
    // Check whether coordinate is within bounds
    isValid(col,row)
    {
        return (col>=0 && col<8 && row>=0 && row<8);
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
    movePiece(input,output)
    {
        let incol=input[0];
        let inrow=input[1];
        let outcol=output[0];
        let outrow=output[1];

        this.boardState[incol][inrow].setPosition(X_ANCHOR+outcol*TILE_SIZE, Y_ANCHOR+outrow*TILE_SIZE);
        this.boardState[outcol][outrow] = this.boardState[incol][inrow];
        this.boardState[incol][inrow] = null;
    }

    // Completely destroy the piece
    destroyPiece(col,row)
    {
        this.boardState[col][row].destroy();
    }

    // Get alignment info of piece
    getAlignment(col,row)
    {
        return this.boardState[col][row].getAlignment();
    }

    // Get rank info of piece
    getRank(col,row)
    {
        return this.boardState[col][row].getRank();
    }

    // Search for possible moves a piece can make
    searchMoves(col,row)
    {
        let rank = this.getRank(col,row);
        switch (rank)
        {
            case 'pawn':
                return this.searchPawn(col,row);
            case 'rook':
                return this.searchRook(col,row);
            case 'knight':
                return this.searchKnight(col,row);
            case 'bishop':
                return this.searchBishop(col,row);
            case 'queen':
                return this.searchQueen(col,row);
            case 'king':
                return this.searchKing(col,row);
        }
    }

    // Search for possible moves a pawn can make
    searchPawn(col,row)
    {
        let moves=[];
        let alignment=this.getAlignment(col,row);
        let j = row + (alignment==PLAYER ? -1 : 1);
        
        for (let i=col-1;i<=col+1;i++)
            if (this.isValid(i,j))
            {
                if (i==col && !this.isOccupied(i,j))
                    moves.push({'xy':[i,j],'isEnemy':false});
                else if (i!=col && this.isOccupied(i,j) && alignment!=this.getAlignment(i,j))
                    moves.push({'xy':[i,j],'isEnemy':true});
            }
        
        j += (alignment==PLAYER ? -1 : 1);
        if (((j==3 && alignment==COMPUTER) || (j==4 && alignment==PLAYER)) && !this.isOccupied(col,j))
            moves.push({'xy':[col,j],'isEnemy':false});
        
        return moves;
    }

    // Search for possible moves a knight can make
    searchKnight(col,row)
    {
        let moves=[];
        let alignment=this.getAlignment(col,row);
        let x_s=[1,1,-1,-1,2,2,-2,-2];
        let y_s=[2,-2,2,-2,1,-1,1,-1];
        let x,y;

        for (let i=0;i<8;i++)
        {
            x=col+x_s[i];
            y=row+y_s[i];
            if (this.isValid(x,y))
            {
                if (!this.isOccupied(x,y))
                    moves.push({'xy':[x,y],'isEnemy':false});
                else if (alignment!=this.getAlignment(x,y))
                    moves.push({'xy':[x,y],'isEnemy':true});
            }
        }

        return moves;
    }

    // Search for possible moves a king can make
    searchKing(col,row)
    {
        let moves=[];
        let alignment=this.getAlignment(col,row);

        for (let i=col-1;i<=col+1;i++)
            for (let j=row-1;j<=row+1;j++)
                if (this.isValid(i,j))
                {
                    if (!this.isOccupied(i,j))
                        moves.push({'xy':[i,j],'isEnemy':false});
                    else if (alignment!=this.getAlignment(i,j))
                        moves.push({'xy':[i,j],'isEnemy':true});
                }
        
        return moves;
    }

    // Search for possible moves a rook can make
    searchRook(col,row)
    {
        let moves=[];
        let alignment=this.getAlignment(col,row);
        let i,j;

        // left
        for (i=col-1; i>=0; i--)
            if(!this.isOccupied(i,row))
                moves.push({'xy':[i,row],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(i,row))
                    moves.push({'xy':[i,row],'isEnemy':true});
                break;
            }

        // right
        for (i=col+1; i<8; i++)
            if(!this.isOccupied(i,row))
                moves.push({'xy':[i,row],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(i,row))
                    moves.push({'xy':[i,row],'isEnemy':true});
                break;
            }

        // top
        for (j=row-1; j>=0; j--)
            if(!this.isOccupied(col,j))
                moves.push({'xy':[col,j],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(col,j))
                    moves.push({'xy':[col,j],'isEnemy':true});
                break;
            }

        // bottom
        for (j=row+1; j<8; j++)
            if(!this.isOccupied(col,j))
                moves.push({'xy':[col,j],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(col,j))
                    moves.push({'xy':[col,j],'isEnemy':true});
                break;
            }

        return moves;
    }

    // Search for possible moves a bishop can make
    searchBishop(col,row)
    {
        let moves=[];
        let alignment=this.getAlignment(col,row);
        let i,j;

        // top left
        for (i=col-1,j=row-1; i>=0&&j>=0; i--,j--)
            if(!this.isOccupied(i,j))
                moves.push({'xy':[i,j],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(i,j))
                    moves.push({'xy':[i,j],'isEnemy':true});
                break;
            }

        // top right
        for (i=col+1,j=row-1; i<8&&j>=0; i++,j--)
            if(!this.isOccupied(i,j))
                moves.push({'xy':[i,j],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(i,j))
                    moves.push({'xy':[i,j],'isEnemy':true});
                break;
            }

        // bottom left
        for (i=col-1,j=row+1; i>=0&&j<8; i--,j++)
            if(!this.isOccupied(i,j))
                moves.push({'xy':[i,j],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(i,j))
                    moves.push({'xy':[i,j],'isEnemy':true});
                break;
            }

        // bottom right
        for (i=col+1,j=row+1; i<8&&j<8; i++,j++)
            if(!this.isOccupied(i,j))
                moves.push({'xy':[i,j],'isEnemy':false});
            else 
            {
                if(alignment!=this.getAlignment(i,j))
                    moves.push({'xy':[i,j],'isEnemy':true});
                break;
            }

        return moves;
    }

    // Search for possible moves a queen can make
    searchQueen(col,row)
    {
        return this.searchRook(col,row).concat(this.searchBishop(col,row));
    }
}