import { Scene } from "phaser";
import { EventBus } from "../EventBus";

import { PAWN,ROOK,KNIGHT,BISHOP,QUEEN,KING } from '../../game-objects/constants';
import { PLAYER,COMPUTER } from '../../game-objects/constants';
import { ChessTiles } from '../../game-objects/chess-tiles';
import { CapturedPieces } from "../CapturedPieces";

export class Game extends Scene {
    constructor() {
        super("MainGame");
    }

    preload() {
        this.load.setPath("assets");
        // Load Chess piece pngs
        this.load.setPath("assets/drummyfish chess");
        for (let rank of [PAWN,ROOK,KNIGHT,BISHOP,QUEEN,KING])
            for (let alignment of [PLAYER,COMPUTER])
                this.load.image(rank+alignment, rank+alignment+'.png');
    }

    create() {

        // 4 new files in src/game-objects
        // 6 sets of chess pieces (3 pairs of BW) in pubic/assets/drummyfish chess; Brought to you by Hope!
        // and a board, and an icon, and a black tile, and a white tile; Totaling to 40 images
        new ChessTiles(this);
        

        
        const endButton = this.add.text(100, 100, "End Game!", {
            fill: "#000000",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        endButton.setPosition(1000, 708);
        endButton.setInteractive();
        endButton.on(
            "pointerdown",
            function () {
                import("./Start") // Dynamically import the Game scene
                    .then((module) => {
                        // Only add the scene if it's not already registered
                        if (!this.scene.get("Game")) {
                            this.scene.add("Game", module.Game); // Add the MainGame scene dynamically
                        }

                        // Start the MainGame scene
                        this.scene.start("Game");
                    });
            },
            this
        );

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

