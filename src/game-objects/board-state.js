import { TILE_SIZE, X_ANCHOR, Y_ANCHOR } from './constants';
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from './constants';
import { PLAYER, COMPUTER } from './constants';
import { EN_PASSANT_TOKEN } from './constants';
import { isSamePoint, dim2Array } from "./constants";
import { ChessPiece } from './chess-piece';
import { PieceCoordinates } from './piece-coordinates';

export class BoardState {
    #scene;
    #boardState;
    #pieceCoordinates;
    #enPassantCoordinate;

    #isChecked;

    constructor(scene, pieceCoordinates) {
        this.#scene = scene;

        // 8x8 array of chess pieces
        this.#boardState = dim2Array(8, 8);
        // contains coordinate info sorted by rank & alignment
        this.#pieceCoordinates = pieceCoordinates;

        // Initialize Player/Computer (white/black) pieces
        this.initializePieces(PLAYER);
        this.initializePieces(COMPUTER);
    }

    // initialize player pieces (and computer pieces for testing purposes)
    initializePieces(alignment, replace=false) {
        for (let i = 0; i < 8; i++) {
            for (let j of alignment == PLAYER ? [6, 7] : [0, 1])
                if (j == 6 || j==1)
                    this.addPiece(i, j, PAWN, alignment, replace);
                else
                    switch (i) {
                        case 0:
                        case 7:
                            this.addPiece(i, j, ROOK, alignment, replace);
                            break;
                        case 1:
                        case 6:
                            this.addPiece(i, j, KNIGHT, alignment, replace);
                            break;
                        case 2:
                        case 5:
                            this.addPiece(i, j, BISHOP, alignment, replace);
                            break;
                        case 3:
                            this.addPiece(i, j, QUEEN, alignment, replace);
                            break;
                        case 4:
                            this.addPiece(i, j, KING, alignment, replace);
                            break;
                    }
        }
    }

    // ================================================================
    // Check Tile Validity & Occupancy

    // Check whether coordinate is within bounds
    isValid(col, row) {
        return (col >= 0 && col < 8 && row >= 0 && row < 8);
    }

    // Check whether coordinate has chess piece
    isOccupied(col, row, ignoreTile=null) {
        if (ignoreTile && isSamePoint([col, row], ignoreTile))
            return false;
        return this.#boardState[col][row] && this.#boardState[col][row] != EN_PASSANT_TOKEN;
    }

    // Check whether coordinate has en passant token
    isEnPassant(col, row) {
        return this.#boardState[col][row] == EN_PASSANT_TOKEN;
    }

    // ================================================================
    // En Passant Token Management (Adding & Deletion)

    // Add en passant token to coordinate & log coordinate
    addEnPassantToken(col, row) {
        this.#boardState[col][row] = EN_PASSANT_TOKEN;
        this.#enPassantCoordinate = [col, row];
    }

    // Destroy en passant token (if it exists)
    destroyEnPassantToken() {
        if (this.#enPassantCoordinate) {
            let col = this.#enPassantCoordinate[0];
            let row = this.#enPassantCoordinate[1];
            this.#boardState[col][row] = null;
            this.#enPassantCoordinate = null;
        }
    }

    // ================================================================
    // Chess Piece Management (Adding & Moving & Destruction)

    // Add piece of chosen rank & alignment to coordinate
    addPiece(col, row, rank, alignment, replace=false) {
        if (!replace && this.isOccupied(col, row))
            return false;
        if (this.isOccupied(col, row))
            this.destroyPiece(col, row);
        
        this.#boardState[col][row] = new ChessPiece(
            this.#scene,
            X_ANCHOR + col * TILE_SIZE,
            Y_ANCHOR + row * TILE_SIZE,
            rank,
            alignment,
            [col, row]
        );
        this.#scene.add.existing(this.#boardState[col][row]);

        this.#pieceCoordinates.addCoordinate(col, row, rank, alignment);

        return true;
    }

    // Move piece in input coordinate to output coordinate
    movePiece(input, output) {
        let incol = input[0];
        let inrow = input[1];
        let outcol = output[0];
        let outrow = output[1];

        if (!this.isOccupied(incol, inrow) || this.isOccupied(outcol, outrow))
            return false;

        this.destroyEnPassantToken();
        if (this.getRank(incol, inrow) == PAWN && Math.abs(inrow - outrow) == 2)
            this.addEnPassantToken(incol, (inrow + outrow) / 2);

        this.#boardState[incol][inrow].setPosition(X_ANCHOR + outcol * TILE_SIZE, Y_ANCHOR + outrow * TILE_SIZE);
        this.#boardState[outcol][outrow] = this.#boardState[incol][inrow];
        this.#boardState[incol][inrow] = null;

        this.incrementMoveCounter(outcol, outrow);

        this.#boardState[outcol][outrow].setCoordinate(output[0], output[1]);

        let rank = this.#boardState[outcol][outrow].getRank();
        let alignment = this.#boardState[outcol][outrow].getAlignment();
        this.#pieceCoordinates.moveCoordinate(input, output, rank, alignment);

        return true;
    }

    // Completely destroy the piece
    destroyPiece(col, row) {
        if (!this.isOccupied(col, row))
            return false;

        let rank = this.#boardState[col][row].getRank();
        let alignment = this.#boardState[col][row].getAlignment();
        this.#pieceCoordinates.deleteCoordinate(col, row, rank, alignment);

        this.#boardState[col][row].destroy();
        this.#boardState[col][row] = null;

        return true;
    }

    // Destroy all pieces of given alignment
    zapPieces(alignment) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++)
                if (this.isOccupied(i, j) && this.getAlignment(i, j) == alignment)
                    this.destroyPiece(i, j);
        }
    }

    // ================================================================
    // Chess Piece Info (Alignment & Rank) Management

    // Get alignment info of piece
    getAlignment(col, row) {
        if (this.pieceIsValid(col, row))
            if (this.#boardState[col][row] instanceof ChessPiece)
                return this.#boardState[col][row].getAlignment();
        
        return "x";
    }

    // Get rank info of piece
    getRank(col, row) {
        return this.#boardState[col][row].getRank();
    }

    // Get move counter info of piece
    getMoveCounter(col, row) {
        return this.#boardState[col][row].getMoveCounter();
    }

    // Increment move counter of piece
    incrementMoveCounter(col, row) {
        this.#boardState[col][row].incrementMoveCounter();
    }

    // Check whether coordinate has different alignment
    isDiffAlignment(col, row, alignment, supposeTile=null) {
        if (supposeTile && isSamePoint([col, row], supposeTile))
            return false;
        return alignment != this.getAlignment(col, row);
    }

    // ================================================================
    // Chess Piece Possible Moves Search

    // Search for possible moves a chess piece can make
    searchMoves(col, row) {
        let rank = this.getRank(col, row);
        switch (rank) {
            case PAWN:
                return this.searchPawn(col, row);
            case ROOK:
                return this.searchRook(col, row);
            case KNIGHT:
                return this.searchKnight(col, row);
            case BISHOP:
                return this.searchBishop(col, row);
            case QUEEN:
                return this.searchQueen(col, row);
            case KING:
                return this.searchKing(col, row);
        }
    }

    // Search for possible moves a pawn can make
    searchPawn(col, row) {
        let moves = [];
        let alignment = this.getAlignment(col, row);
        let j = row + (alignment == PLAYER ? -1 : 1);

        for (let i = col - 1; i <= col + 1; i++)
            if (this.isValid(i, j)) {
                // forward
                if (i == col && !this.isOccupied(i, j)) {
                    if (this.kingSaved([col, row], [i, j], alignment))
                        moves.push({ xy: [i, j], isEnemy: false });
                }
                // elimination
                else if (i != col && this.isOccupied(i, j) && this.isDiffAlignment(i, j, alignment)) {
                    if (this.kingSaved([col, row], [i, j], alignment))
                        moves.push({ xy: [i, j], isEnemy: true });
                // en passant
                } else if (i != col && this.isEnPassant(i, j) && this.isOccupied(i, row) && this.isDiffAlignment(i, row, alignment)) {
                    if (this.kingSaved([col, row], [i, j], alignment))
                        moves.push({ xy: [i, j], isEnemy: true });
                }
            }

        // 2 tiles with first move
        if (!this.isOccupied(col, j)) {
            j += (alignment == PLAYER ? -1 : 1);
            if (!this.getMoveCounter(col, row) && !this.isOccupied(col, j) && this.kingSaved([col, row], [col, j], alignment))
                moves.push({ xy: [col, j], isEnemy: false });
        }

        return moves;
    }

    // Search for possible moves a knight can make
    searchKnight(col, row) {
        let moves = [];
        let alignment = this.getAlignment(col, row);
        let x_s = [1, 1, -1, -1, 2, 2, -2, -2];
        let y_s = [2, -2, 2, -2, 1, -1, 1, -1];
        let x, y;

        for (let i = 0; i < 8; i++) {
            x = col + x_s[i];
            y = row + y_s[i];
            if (this.isValid(x, y))
                this.searchTile([col, row], [x, y], alignment, moves);
        }

        return moves;
    }

    // Search for possible moves a king can make
    searchKing(col, row) {
        let moves = [];
        let alignment = this.getAlignment(col, row);

        for (let i = col - 1; i <= col + 1; i++)
            for (let j = row - 1; j <= row + 1; j++)
                if (this.isValid(i, j))
                    if (!this.seekThreats(i, j, alignment, [col, row]).length)
                        this.searchTile([col, row], [i, j], alignment, moves);

        // Castling
        if (!this.getMoveCounter(col, row)) {
            // Queenside castling
            if (this.isOccupied(0, row) &&
                !this.isOccupied(1, row) &&
                !this.isOccupied(2, row) &&
                !this.isOccupied(3, row) &&
                !this.getMoveCounter(0, row) &&
                !this.seekThreats(1, row, alignment, [col, row]).length &&
                !this.seekThreats(2, row, alignment, [col, row]).length &&
                !this.seekThreats(3, row, alignment, [col, row]).length &&
                !this.seekThreats(col, row, alignment).length
            )
                moves.push({ xy: [col - 2, row], isEnemy: false });
            // Kingside castling
            if (this.isOccupied(7, row) &&
                !this.isOccupied(6, row) &&
                !this.isOccupied(5, row) &&
                !this.getMoveCounter(7, row) &&
                !this.seekThreats(6, row, alignment, [col, row]).length &&
                !this.seekThreats(5, row, alignment, [col, row]).length &&
                !this.seekThreats(col, row, alignment).length
            )
                moves.push({ xy: [col + 2, row], isEnemy: false });
        }

        return moves;
    }

    // Search for possible moves a rook can make
    searchRook(col, row) {
        let moves = [];
        let alignment = this.getAlignment(col, row);
        let i, j;

        // left
        for (i = col - 1; i >= 0; i--)
            if (this.searchTile([col, row], [i, row], alignment, moves))
                break;

        // right
        for (i = col + 1; i < 8; i++)
            if (this.searchTile([col, row], [i, row], alignment, moves))
                break;

        // top
        for (j = row - 1; j >= 0; j--)
            if (this.searchTile([col, row], [col, j], alignment, moves))
                break;

        // bottom
        for (j = row + 1; j < 8; j++)
            if (this.searchTile([col, row], [col, j], alignment, moves))
                break;

        return moves;
    }

    // Search for possible moves a bishop can make
    searchBishop(col, row) {
        let moves = [];
        let alignment = this.getAlignment(col, row);
        let i, j;

        // top left
        for (i = col - 1, j = row - 1; i >= 0 && j >= 0; i--, j--)
            if (this.searchTile([col, row], [i, j], alignment, moves))
                break;

        // top right
        for (i = col + 1, j = row - 1; i < 8 && j >= 0; i++, j--)
            if (this.searchTile([col, row], [i, j], alignment, moves))
                break;

        // bottom left
        for (i = col - 1, j = row + 1; i >= 0 && j < 8; i--, j++)
            if (this.searchTile([col, row], [i, j], alignment, moves))
                break;

        // bottom right
        for (i = col + 1, j = row + 1; i < 8 && j < 8; i++, j++)
            if (this.searchTile([col, row], [i, j], alignment, moves))
                break;

        return moves;
    }

    // Search for possible moves a queen can make
    searchQueen(col, row) {
        return this.searchRook(col, row).concat(this.searchBishop(col, row));
    }

    // Check whether a coordinate is a possible move
    searchTile(input, output, alignment, moves) {
        let outcol = output[0];
        let outrow = output[1];
        if (!this.isOccupied(outcol, outrow)) {
            if (this.kingSaved(input, output, alignment))
                moves.push({ xy: [outcol, outrow], isEnemy: false });
        } else {
            if (this.isDiffAlignment(outcol, outrow, alignment))
                if (this.kingSaved(input, output, alignment))
                    moves.push({ xy: [outcol, outrow], isEnemy: true });
            return true;
        }
        
        return false;
    }

    // ================================================================
    // Chess Piece Possible Threats Seek

    // Seek for possible threats to a hypothetical chess piece at a coordinate & of an alignment
    // Whilst Optionally ignoring occupancy of a coordinate (mostly for when moving pieces)
    seekThreats(col, row, alignment, ignoreTile=null, supposeTile=null) {
        return []
            .concat(this.seekAdjacent(col, row, alignment, supposeTile))
            .concat(this.seekSkewed(col, row, alignment, supposeTile))
            .concat(this.seekOrthogonal(col, row, alignment, ignoreTile, supposeTile))
            .concat(this.seekDiagonal(col, row, alignment, ignoreTile, supposeTile));
    }

    // Seek for possible adjacent threats (pawns & kings)
    seekAdjacent(col, row, alignment, supposeTile=null) {
        let threats = [];

        for (let i = col - 1; i <= col + 1; i++)
            for (let j = row - 1; j <= row + 1; j++)
                if (this.isValid(i, j) && this.isOccupied(i, j) && this.isDiffAlignment(i, j, alignment, supposeTile) && (i != col || j != row)) {
                    let rank = this.getRank(i, j);
                    switch (rank) {
                        case PAWN:
                            if ((alignment == PLAYER && j == row - 1 && i != col) || (alignment == COMPUTER && j == row + 1 && i != col))
                                threats.push([i, j]);
                            break;
                        case KING:
                            threats.push([i, j]);
                            break;
                    }
                }

        return threats;
    }

    // Seek for possible skewed threats (knights)
    seekSkewed(col, row, alignment, supposeTile=null) {
        let threats = [];

        let x_s = [1, 1, -1, -1, 2, 2, -2, -2];
        let y_s = [2, -2, 2, -2, 1, -1, 1, -1];
        let x, y;

        for (let i = 0; i < 8; i++) {
            x = col + x_s[i];
            y = row + y_s[i];
            if (this.isValid(x, y) && !this.seekSupposed(x, y, supposeTile))
                this.seekTile(x, y, alignment, threats, KNIGHT);
        }

        return threats;
    }

    // Seek for possible orthogonal threats (rooks & queens)
    seekOrthogonal(col, row, alignment, ignoreTile=null, supposeTile=null) {
        let threats = [];

        let i, j;

        // left
        for (i = col - 1; i >= 0; i--)
            if (this.seekSupposed(i, row, supposeTile) || this.seekTile(i, row, alignment, threats, ROOK, ignoreTile))
                break;

        // right
        for (i = col + 1; i < 8; i++)
            if (this.seekSupposed(i, row, supposeTile) || this.seekTile(i, row, alignment, threats, ROOK, ignoreTile))
                break;

        // top
        for (j = row - 1; j >= 0; j--)
            if (this.seekSupposed(col, j, supposeTile) || this.seekTile(col, j, alignment, threats, ROOK, ignoreTile))
                break;

        // bottom
        for (j = row + 1; j < 8; j++)
            if (this.seekSupposed(col, j, supposeTile) || this.seekTile(col, j, alignment, threats, ROOK, ignoreTile))
                break;

        return threats;
    }

    // Seek for possible diagonal threats (bishops & queens)
    seekDiagonal(col, row, alignment, ignoreTile=null, supposeTile=null) {
        let threats = [];

        let i, j;

        // top left
        for (i = col - 1, j = row - 1; i >= 0 && j >= 0; i--, j--)
            if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile))
                break;

        // top right
        for (i = col + 1, j = row - 1; i < 8 && j >= 0; i++, j--)
            if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile))
                break;

        // bottom left
        for (i = col - 1, j = row + 1; i >= 0 && j < 8; i--, j++)
            if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile))
                break;

        // bottom right
        for (i = col + 1, j = row + 1; i < 8 && j < 8; i++, j++)
            if (this.seekSupposed(i, j, supposeTile) || this.seekTile(i, j, alignment, threats, BISHOP, ignoreTile))
                break;

        return threats;
    }

    // Check whether a coordinate is a threat
    seekTile(col, row, alignment, threats, compareRank, ignoreTile=null) {
        if (this.isOccupied(col, row, ignoreTile)) {
            let rank = this.getRank(col, row);
            let isThreat = rank == compareRank || ((compareRank == ROOK || compareRank == BISHOP) && rank == QUEEN);
            if (this.isDiffAlignment(col, row, alignment) && isThreat)
                threats.push([col, row]);
            return true;
        }

        return false;
    }

    // ================================================================
    // Helper methods

    pieceIsValid(col, row) {
        if (this.#boardState[col][row] === undefined)
            return false;
        if (this.#boardState[col][row] === null)
            return false;
    
        return true;
    }

    // Check whether a coordinate is supposed by an ally piece
    seekSupposed(col, row, supposeTile=null) {
        return supposeTile && isSamePoint(supposeTile, [col, row]);
    }

    // Check whether king would be saved/un-threatened if move is made
    kingSaved(input, output, alignment) {
        let coordinate = this.#pieceCoordinates.getCoordinate(KING, alignment);
        let col = isSamePoint(input, coordinate) ? output[0] : coordinate[0];
        let row = isSamePoint(input, coordinate) ? output[1] : coordinate[1];
        return !this.seekThreats(col, row, alignment, input, output).length;
    }

    // Check whether king of alignment is threatened
    isChecked(alignment) {
        let coordinate = this.#pieceCoordinates.getCoordinate(KING, alignment);
        let col = coordinate[0];
        let row = coordinate[1];

        this.#isChecked = !!this.seekThreats(col, row, alignment).length;
        return this.#isChecked;
    }

    // Check whether king of alignment is threatened
    isCheckmated(alignment) {
        let coordinate = this.#pieceCoordinates.getCoordinate(KING, alignment);
        let col = coordinate[0];
        let row = coordinate[1];

        if (!this.isChecked(alignment) && this.searchMoves(col, row).length)
            return false;

        for (let piece of this.#pieceCoordinates.getAllCoordinates(alignment))
            if (!!this.searchMoves(piece[0], piece[1]).length)
                return true;
        
        return false;
    }

    // Check whether board is stalemated (not checked & no legal move)
    isStalemated(alignment) {
        if (this.isChecked(alignment))
            return false;

        let coordinates = this.#pieceCoordinates.getAllCoordinates(alignment);
        for (let xy of coordinates)
            if (this.searchMoves(xy[0], xy[1]).length)
                return false;

        return true;
    }
}