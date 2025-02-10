import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
    }

    create() {
        this.add.image(512, 384, "background");
        this.add.image(512, 350, "logo").setDepth(100);

        this.add
            .text(512, 450, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 50,
                color: "#ff0000", // Fixed missing #
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100); // Removed extra semicolon

        const restartButton = this.add.text(400, 600, "Back to Start", {
            fill: "#0099ff",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 20, bottom: 10 },
        });

        restartButton.setInteractive();


        restartButton.on(
            "pointerdown",
            () => {
                this.scene.start("Game Over"); // Ensuring 'this' is correctly referenced
            }
        );

        restartButton.on("pointerover", () => {
            restartButton.setScale(1.2);
        });
        restartButton.on("pointerout", () => {
            restartButton.setScale(1);
        });

        EventBus.emit("current-scene-ready", this);
    }
}
