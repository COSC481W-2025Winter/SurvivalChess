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
        //         this.add.image(512, 350, "star").setDepth(100);
        //         this.add
        //             .text(512, 490, "You are currently playing the game", {
        //                 fontFamily: "Arial Black",
        //                 fontSize: 38,
        //                 color: "#ffffff",
        //                 stroke: "#000000",
        //                 strokeThickness: 8,
        //                 align: "center",
        //             })
        //             .setOrigin(0.5)
        //             .setDepth(100);

        // 4 new files in src/game-objects
        // 6 sets of chess pieces (3 pairs of BW) in pubic/assets/drummyfish chess; Brought to you by Hope!
        // and a board, and an icon, and a black tile, and a white tile; Totaling to 40 images
        new ChessTiles(this);

        const endButton = this.add.text(100, 100, "End Game!", {
            fill: CREAMHEX,
            backgroundColor: ONYXHEX,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        endButton.setPosition(425, 600);
        endButton.setInteractive();
        // endButton.on(
        //     "pointerdown",
        //     function () {
        //         import("./Start") // Dynamically import the Game scene
        //             .then((module) => {
        //                 // Only add the scene if it's not already registered
        //                 if (!this.scene.get("Game")) {
        //                     this.scene.add("Game", module.Game); // Add the MainGame scene dynamically
        //                 }

        //                 // Start the MainGame scene
        //                 this.scene.start("Game");
        //             });
        //     },
        //     this
        // );
        endButton.on("pointerout", () => {
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

