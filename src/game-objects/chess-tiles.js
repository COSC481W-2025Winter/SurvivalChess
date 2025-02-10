import { TILE_SIZE, X_ANCHOR, Y_ANCHOR } from "./constants";
import { HOVER_COLOR, WHITE_TILE_COLOR, BLACK_TILE_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR, STAGE_COLOR } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "./constants";
import { PLAYER, COMPUTER } from "./constants";
import { BoardState } from "./board-state";
import { isSamePoint } from "./constants";

import { DEV_MODE } from "./constants";

export class ChessTiles {
    constructor(scene) {
        this.scene = scene;

        this.chessTiles = [];   // 8x8 array of chess tiles
        this.boardState;        // contains BoardState object that manages an 8x8 array of chess pieces
        this.xy;                // coordinate of selected chess piece; list of [i,j]
        this.moves;             // possible moves of selected chess piece; list of dictionaries of {'xy':[#,#],'isEnemy':boolean}
        this.temp;              // temporary storage of coordinate & color; list of dictionaries of {'xy':[#,#],'color':color}
        this.threats;           // temporary storage of threats to chess piece, list of lists of [#,#]

        // Set up stage behind (surrounding) chessboard
        this.scene.add.rectangle(
            X_ANCHOR + 3.5 * TILE_SIZE,
            Y_ANCHOR + 3.5 * TILE_SIZE,
            9 * TILE_SIZE,
            9 * TILE_SIZE,
            STAGE_COLOR
        );

        // Set up chessTiles & pointer behaviour, as well as interaction with pieces
        for (let i = 0; i < 8; i++) {
            this.chessTiles.push([]);
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
                    // if highlighted as possible move, save state to restore on pointerout
                    let color = this.chessTiles[i][j].fillColor;
                    if (color == NON_LETHAL_COLOR || color == LETHAL_COLOR)
                        this.temp = [{ xy: [i, j], color: color }];

                    // highlight tile
                    this.highlightColor([i, j], HOVER_COLOR);

                    // if hovering over a piece and either 1. is selected piece or 2. no piece is selected, highlight this.threats
                    if ((!this.xy || isSamePoint(this.xy, [i, j])) && this.boardState.isOccupied(i, j)) {
                        this.threats = this.boardState.seekThreats(i, j, this.boardState.getAlignment(i, j))
                        if (!this.temp)
                            this.temp = [];
                        for (let tile of this.threats) {
                            let colo = this.chessTiles[tile[0]][tile[1]].fillColor;
                            if (colo == NON_LETHAL_COLOR || colo == LETHAL_COLOR)
                                this.temp.push({ xy: tile, color: colo });
                            this.highlightColor(tile, THREAT_COLOR);
                        }
                    }
                });

                // When the pointer moves away from a tile, restore original color
                this.chessTiles[i][j].on("pointerout", () => {
                    // restore non-selected tiles to board color
                    if (!this.xy || !isSamePoint(this.xy, [i, j]))
                        this.restoreColor([i, j]);

                    // restore highlighted lethal / non-lethal tile colors, if selected piece exists
                    if (this.temp)
                        for (let tile of this.temp)
                            this.highlightColor(tile.xy, tile.color);

                    // restore highlighted this.threats to board color, unless already restored to lethal / non-lethal tile colors
                    if (this.threats && (!this.temp || this.temp.length != 1))
                        for (let tile of this.threats)
                            this.restoreColor(tile);

                    this.temp = null;
                    this.threats = null;
                });

                // When the pointer pushes down a tile, select/move piece & highlight selected tile / possible moves
                this.chessTiles[i][j].on("pointerdown", () => {
                    // if tile is same as selected, unselect piece
                    if (this.xy && isSamePoint(this.xy, [i, j]))
                        this.clearBoard();
                    // else if tile is occupied re-select new piece or move & eliminate piece
                    else if (this.boardState.isOccupied(i, j))
                        switch (this.boardState.getAlignment(i, j)) {
                            case PLAYER: // if PLAYER's piece
                                this.clearBoard();

                                // highlight tile & possible moves & record selected piece into xy
                                this.highlightColor([i, j], HOVER_COLOR);
                                this.moves = this.boardState.searchMoves(i, j);
                                for (let move of this.moves)
                                    this.highlightColor(
                                        move.xy,
                                        move.isEnemy ? LETHAL_COLOR : NON_LETHAL_COLOR
                                    );
                                this.xy = [i, j];
                                break;
                            case COMPUTER: // if COMPUTER's piece
                                // if previously selected piece exists & move is valid, destroy then move piece
                                if (this.xy && this.isValidMove([i, j])) {
                                    this.boardState.destroyPiece(i, j);
                                    this.boardState.movePiece(this.xy, [i, j]);
                                    this.clearBoard();
                                }
                                break;
                        }
                    // if not occupied & move is valid, move piece
                    else if (this.xy && this.isValidMove([i, j])) {
                        // if en passant move, destroy enemy pawn
                        if (
                            this.boardState.getRank(this.xy[0], this.xy[1]) == PAWN &&
                            this.boardState.isEnPassant(i, j)
                        )
                            this.boardState.destroyPiece(i, this.xy[1]);

                        // move piece & clear board
                        this.boardState.movePiece(this.xy, [i, j]);
                        this.clearBoard();
                    }

                    this.temp = null;
                    this.threats = null;
                });

                // if DEV_MODE is enabled; Enable COMPUTER moves via substituting pointerdown with scrolling
                if (DEV_MODE)
                    // When the pointer scrolls on a tile, select/move piece & highlight selected tile / possible moves
                    this.chessTiles[i][j].on("wheel", () => {
                        // if tile is same as selected, unselect piece
                        if (this.xy && isSamePoint(this.xy, [i, j]))
                            this.clearBoard();
                        // else if tile is occupied re-select new piece or move & eliminate piece
                        else if (this.boardState.isOccupied(i, j))
                            switch (this.boardState.getAlignment(i, j)) {
                                case COMPUTER: // if COMPUTER's piece
                                    this.clearBoard();

                                    // highlight tile & possible moves & record selected piece into xy
                                    this.highlightColor([i, j], HOVER_COLOR);
                                    this.moves = this.boardState.searchMoves(i, j);
                                    for (let move of this.moves)
                                        this.highlightColor(
                                            move.xy,
                                            move.isEnemy ? LETHAL_COLOR : NON_LETHAL_COLOR
                                        );
                                    this.xy = [i, j];
                                    break;
                                case PLAYER: // if PLAYER's piece
                                    // if previously selected piece exists & move is valid, destroy then move piece
                                    if (this.xy && this.isValidMove([i, j])) {
                                        this.boardState.destroyPiece(i, j);
                                        this.boardState.movePiece(this.xy, [i, j]);
                                        this.clearBoard();
                                    }
                                    break;
                            }
                        // if not occupied & move is valid, move piece
                        else if (this.xy && this.isValidMove([i, j])) {
                            // if en passant move, destroy enemy pawn
                            if (
                                this.boardState.getRank(this.xy[0], this.xy[1]) == PAWN &&
                                this.boardState.isEnPassant(i, j)
                            )
                                this.boardState.destroyPiece(i, this.xy[1]);

                            // move piece & clear board
                            this.boardState.movePiece(this.xy, [i, j]);
                            this.clearBoard();
                        }

                        this.temp = null;
                        this.threats = null;
                    });
            }
        }

        this.boardState = new BoardState(this.scene);
    }

    // Highlight selected tile
    highlightColor([col, row], color) {
        this.chessTiles[col][row].setFillStyle(color);
    }

    // Restore original tile color
    restoreColor([col, row]) {
        this.chessTiles[col][row].setFillStyle(this.getTileColor([col, row]));
    }

    // Restore original tile color
    clearBoard() {
        if (this.xy)
            this.restoreColor(this.xy);
        if (this.moves)
            for (let move of this.moves)
                this.restoreColor(move.xy);
        if (this.threats)
            for (let tile of this.threats)
                this.restoreColor(tile);
        this.xy = null;
        this.moves = null;
    }

    // Get original tile color
    getTileColor([col, row]) {
        return (col + row) % 2 == 0 ? WHITE_TILE_COLOR : BLACK_TILE_COLOR;
    }

    // Check whether the coordinate would be a valid move
    isValidMove([col, row]) {
        if (!this.moves)
            return false;
        for (let move of this.moves)
            if (move.xy[0] == col && move.xy[1] == row)
                return true;
        return false;
    }
}

