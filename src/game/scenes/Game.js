import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import Phaser from "phaser";


import {
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING,
    CREAMHEX,
    ONYXHEX,
} from "../../game-objects/constants";
import { PLAYER, COMPUTER } from "../../game-objects/constants";
import { ChessTiles } from "../../game-objects/chess-tiles";

export class Game extends Scene {
    constructor() {
        super("MainGame");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");

        // Load Chess piece pngs
        this.load.setPath("assets/drummyfish chess");
        for (let rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING])
            for (let alignment of [PLAYER, COMPUTER])
                this.load.image(rank + alignment, rank + alignment + ".png");
    }

    create() {
        this.add.image(512, 384, "background");


        // and a board, and an icon, and a black tile, and a white tile; Totaling to 40 images
        new ChessTiles(this);

        const endButton = this.add.text(100, 100, "End Game!", {
            fill: CREAMHEX,
            backgroundColor: ONYXHEX,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        endButton.setPosition(425, 600);
        endButton.setInteractive();

        endButton.on("pointerdown", () => {
            this.scene.start("GameOver"); // Reset to original size
        });

        // When the pointer hovers over the button, scale it up
        endButton.on("pointerover", () => {
            endButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        endButton.on("pointerout", () => {
            endButton.setScale(1); // Reset to original size
        });

        EventBus.emit("current-scene-ready", this);
    }
}

