import { TILE_SIZE, X_ANCHOR, Y_ANCHOR } from "./constants";
import { HOVER_COLOR, WHITE_TILE_COLOR, BLACK_TILE_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR, CHECKED_COLOR, STAGE_COLOR } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "./constants";
import { PLAYER, COMPUTER } from "./constants";
import { isSamePoint, dim2Array } from "./constants";
import { DEV_MODE } from "./constants";
import { BoardState } from "./board-state";
import { EventBus } from "../game/EventBus";
import { PieceCoordinates } from './piece-coordinates';
import { PiecesTaken } from "./pieces-taken";

export class ChessTiles {

    constructor(scene) {
        this.scene = scene;
        this.chessTiles;        // 8x8 array of chess tiles
        this.boardState;        // contains BoardState object that manages an 8x8 array of chess pieces
        this.pieceCoordinates;  // contains PieceCoordinates object that manages coordinate info sorted by rank & alignment
        this.piecesTaken;       // contains PiecesTaken object that logs captured pieces

        this.xy;                // coordinate of selected chess piece; list of [i,j]
        this.moves;             // possible moves of selected chess piece; list of dictionaries of {'xy':[#,#],'isEnemy':boolean}
        this.temp;              // temporary storage of coordinate & color; list of dictionaries of {'xy':[#,#],'color':color}
        this.threats;           // temporary storage of threats to chess piece, list of lists of [#,#]

        this.promotionCol;      // temporary storage of column of piece to promote
        this.promotionRow;      // temporary storage of row of piece to promote

        this.sideLights;        // numbers & letters on edge of chessboard that highlight in response to cursor

        this.currentPlayer = PLAYER;    // denotes current player
        this.isChecked;         // is true if the current player's king is checked

        // Set up stage behind (surrounding) chessboard
        this.scene.add.rectangle(
            X_ANCHOR + 3.5 * TILE_SIZE,
            Y_ANCHOR + 3.5 * TILE_SIZE,
            9 * TILE_SIZE,
            9 * TILE_SIZE,
            STAGE_COLOR
        );

        this.sideLights = dim2Array(4, 8);
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 8; j++)
                switch (i) {
                    case 0: // [0,1][0~7] top & bottom rows of a~h
                        this.sideLights[i][j] = this.scene.add.text(X_ANCHOR + j * TILE_SIZE, Y_ANCHOR - 0.75 * TILE_SIZE, String.fromCharCode(65 + j), {fontSize: TILE_SIZE/2}).setOrigin(0.5);
                        break;
                    case 1: // [0,1][0~7] top & bottom rows of a~h
                        this.sideLights[i][j] = this.scene.add.text(X_ANCHOR + j * TILE_SIZE, Y_ANCHOR + 7.75 * TILE_SIZE, String.fromCharCode(65 + j), {fontSize: TILE_SIZE/2}).setOrigin(0.5);
                        break;
                    case 2: // [2,3][0~7] left & right columns of 1~8
                        this.sideLights[i][j] = this.scene.add.text(X_ANCHOR - 0.75 * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE, 8 - j, {fontSize: TILE_SIZE/2}).setOrigin(0.5);
                        break;
                    case 3: // [2,3][0~7] left & right columns of 1~8
                        this.sideLights[i][j] = this.scene.add.text(X_ANCHOR + 7.75 * TILE_SIZE, Y_ANCHOR + j * TILE_SIZE, 8 - j, {fontSize: TILE_SIZE/2}).setOrigin(0.5);
                        break;
                }

        // Set up chessTiles & pointer behaviour, as well as interaction with pieces
        this.chessTiles = dim2Array(8, 8);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // Initialize tiles & enable interaction
                this.chessTiles[i][j] = this.scene.add.rectangle(
                    X_ANCHOR + i * TILE_SIZE,
                    Y_ANCHOR + j * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE,
                    this.getTileColor([i, j])
                );
                this.chessTiles[i][j].setInteractive();

                // When the pointer hovers over a tile, highlight it
                this.chessTiles[i][j].on("pointerover", () => {
                    this.pointerOver(i, j);
                });

                // When the pointer moves away from a tile, restore original color
                this.chessTiles[i][j].on("pointerout", () => {
                    this.pointerOut(i, j);
                });

                // When the pointer pushes down a tile, select/move piece & highlight selected tile / possible moves
                this.chessTiles[i][j].on("pointerdown", () => {
                    this.pointerSelect(i, j);
                });
            }
        }

        this.pieceCoordinates = new PieceCoordinates();
        this.boardState = new BoardState(this.scene, this.pieceCoordinates);
        this.piecesTaken = new PiecesTaken(this.scene);
    }

    // ================================================================
    // Pointer Events

    // Executes when pointer enters tile, or upon manual trigger from pointerSelect
    pointerOver(i, j) {
        // if highlighted as possible move, save state to restore on pointerout
        let color = this.chessTiles[i][j].fillColor;
        if ([NON_LETHAL_COLOR, LETHAL_COLOR, CHECKED_COLOR].includes(color))
            this.temp = [{ xy: [i, j], color: color }];

        // highlight tile
        this.highlightColor([i, j], HOVER_COLOR);

        // if hovering over a piece then highlight this.threats excluding the selected piece
        if (this.boardState.isOccupied(i, j)) {
            this.threats = this.boardState.seekThreats(i, j, this.boardState.getAlignment(i, j))
            if (!this.temp)
                this.temp = [];
            for (let tile of this.threats)
                if (!this.xy || !isSamePoint(this.xy, tile)) {
                    color = this.chessTiles[tile[0]][tile[1]].fillColor;
                    if ([NON_LETHAL_COLOR, LETHAL_COLOR, CHECKED_COLOR].includes(color))
                        this.temp.push({ xy: tile, color: color });
                    this.highlightColor(tile, THREAT_COLOR);
                }
        }
    }

    // Executes when pointer exits tile
    pointerOut(i, j) {
        // restore non-selected tiles to board color
        if (!this.xy || !isSamePoint(this.xy, [i, j]))
            this.restoreColor([i, j]);

        // restore highlighted this.threats to board color, unless is HOVER or LETHAL color
        if (this.threats)
            for (let tile of this.threats) {
                let color = this.chessTiles[tile[0]][tile[1]].fillColor;
                if (color != HOVER_COLOR && color != LETHAL_COLOR)
                    this.restoreColor(tile);
            }

        // restore highlighted lethal / non-lethal tile colors, if selected piece exists
        if (this.temp)
            for (let tile of this.temp)
                this.highlightColor(tile.xy, tile.color);

        this.temp = null;
        this.threats = null;
    }

    // Executes when tile is clicked
    pointerSelect(i, j) {
        let pointerOver = true;
    
        // If the tile is the same as the selected, unselect the piece
        if (this.xy && isSamePoint(this.xy, [i, j])) {
            this.clearBoard();
        }
        // If the tile is occupied, check if the selected piece is the player's piece
        else if (this.boardState.isOccupied(i, j)) {
            switch (this.boardState.getAlignment(i, j)) {
                case this.currentPlayer: // If it's the current player's piece
                    this.clearBoard();

                    // Highlight tile and possible moves, and record the selected piece in xy
                    this.highlightColor([i, j], HOVER_COLOR);
                    this.moves = this.boardState.searchMoves(i, j);
                    for (let move of this.moves)
                        this.highlightColor(
                            move.xy,
                            move.isEnemy ? LETHAL_COLOR : NON_LETHAL_COLOR
                        );
                    this.xy = [i, j];
                    pointerOver = false;
                    break;
                case (this.currentPlayer === PLAYER ? COMPUTER : PLAYER): // If it's the opponent's piece
                    // If previously selected piece exists and move is valid, destroy and move the piece
                    if (this.xy && this.isValidMove([i, j])) {
                        this.capturePiece(this.boardState.getRank(i, j), this.boardState.getAlignment(i, j));
                        this.boardState.destroyPiece(i, j);
                        this.boardState.movePiece(this.xy, [i, j]);
                        // check to see if move results in pawn promotion
                        this.checkPromotion([i, j]);
                        this.clearBoard();
                        // Toggle turn after the move
                        this.toggleTurn();
                    }
                    break;
            }
        }
        // If not occupied and move is valid, move the piece
        else if (this.xy && this.isValidMove([i, j])) {
            // if en passant move, destroy enemy pawn
            if (this.boardState.getRank(this.xy[0], this.xy[1]) == PAWN &&
                this.boardState.isEnPassant(i, j)
            ) {
                this.capturePiece(this.boardState.getRank(i, this.xy[1]), this.boardState.getAlignment(i, this.xy[1]));
                this.boardState.destroyPiece(i, this.xy[1]);
            }
            // if castling move, also move rook
            if (this.boardState.getRank(this.xy[0], this.xy[1]) == KING &&
                Math.abs(this.xy[0] - i) == 2
            )
                this.boardState.movePiece([i < this.xy[0] ? 0 : 7, j], [i < this.xy[0] ? 3 : 5, this.xy[1]])

            // move piece & clear board
            this.boardState.movePiece(this.xy, [i, j]);
            // check to see if move results in pawn promotion
            this.checkPromotion([i, j]);
            this.clearBoard();
    
            // Toggle turn after the move
            this.toggleTurn();
        }
        else {
            pointerOver = false;
        }
    
        this.temp = null;
    
        // If something happened resulting in un-selection, trigger pointerout & pointerover event
        if (pointerOver) {
            this.pointerOut(i, j);
            this.pointerOver(i, j);
            // highlight checked king if checked
            if (this.isChecked)
            {
                let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
                this.temp.push({ xy: coordinate, color: CHECKED_COLOR });
            }
        }
    }
    
    toggleTurn() {
        this.currentPlayer = (this.currentPlayer === PLAYER) ? COMPUTER : PLAYER;
        this.isChecked = this.boardState.isChecked(this.currentPlayer);
        if (this.isChecked) {
            let coordinate = this.pieceCoordinates.getCoordinate(KING, this.currentPlayer);
            this.highlightColor(coordinate, CHECKED_COLOR);
        }
    }
    
    // ================================================================
    // Tile Highlight & Restoration

    // Highlight selected tile
    highlightColor([col, row], color) {
        this.chessTiles[col][row].setFillStyle(color);
    }

    // Get original tile color
    getTileColor([col, row]) {
        return (col + row) % 2 == 0 ? WHITE_TILE_COLOR : BLACK_TILE_COLOR;
    }

    // Restore original tile color
    restoreColor([col, row]) {
        this.chessTiles[col][row].setFillStyle(this.getTileColor([col, row]));
    }

    // Restore original colors to all tiles
    clearBoard() {
        if (this.xy)
            this.restoreColor(this.xy);
        if (this.moves)
            for (let move of this.moves)
                this.restoreColor(move.xy);
        this.xy = null;
        this.moves = null;
    }

    // ================================================================
    // Miscellaneous Methods

    // Check whether the coordinate would be a valid move
    isValidMove([col, row]) {
        if (!this.moves)
            return false;
        for (let move of this.moves)
            if (isSamePoint(move.xy, [col, row]))
                return true;
        return false;
    }

    // add captured piece to the captured pieces
    capturePiece(rank, alignment) {
        this.piecesTaken.takePiece(rank, alignment);
    }

    // check whether the move results in a promotion
    checkPromotion([col, row]) {
        if (this.boardState.getRank(col, row) == PAWN && row==0 && this.boardState.getAlignment(col, row)==PLAYER ) {
            // do the promotion
            import("../game/scenes/Promotion") // Dynamically import the rules scene
            .then((module) => {
                // Only add the scene if it's not already registered
                if (!this.scene.scene.get("Promotion")) {
                    this.scene.scene.add("Promotion", module.Promotion); // Add the scene dynamically
                }
                this.promotionCol = col;
                this.promotionRow = row;
                // Use launch to run scene in parallel to current
                EventBus.once("PawnPromoted", (detail) => {
                    this.setPromotion(detail, PLAYER);
                });
                this.scene.scene.launch("Promotion");
            });
    
        } else if (this.boardState.getRank(col, row) == PAWN && row==7 && this.boardState.getAlignment(col, row)==COMPUTER ) {
            // set black piece to queen which is almost always correct choice, 
            // ocassionally knight might be correct but this is less computationally intensive
            this.promotionCol = col;
            this.promotionRow = row;
            this.setPromotion(QUEEN,COMPUTER);
        }
    }

    setPromotion(rank, alignment) {
        this.boardState.destroyPiece(this.promotionCol, this.promotionRow); // might need update with capture
        this.boardState.addPiece(this.promotionCol, this.promotionRow, rank, alignment);
    }
}
