import { Scene } from "phaser";
import { EventBus } from "../EventBus";


import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from '../../game-objects/constants';
import { PLAYER, COMPUTER } from '../../game-objects/constants';
import { ChessTiles } from '../../game-objects/chess-tiles';

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
                this.load.image(rank + alignment, rank + alignment + '.png');
    }

    create() {
        this.add.image(512, 384, "background");
        new ChessTiles(this);

        // Settings Button
        const settingsButton = this.add.text(425, 650, "Settings", {
            fill: "#ff9900",
            backgroundColor: "#fff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive();

        settingsButton.on("pointerdown", () => {
            console.log("Settings button clicked");
            EventBus.emit("open-settings-menu"); // Emitting an event for opening settings
        });

        settingsButton.on("pointerover", () => settingsButton.setScale(1.2));
        settingsButton.on("pointerout", () => settingsButton.setScale(1));

        EventBus.emit("current-scene-ready", this);
    }
}
