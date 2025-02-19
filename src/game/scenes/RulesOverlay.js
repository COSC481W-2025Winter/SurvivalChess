import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class RulesOverlay extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
    }

    create() {
        // put Rules over game screen
        this.scene.moveAbove("MainGame", "Rules");
        // Creates a visual background that also blocks input on the scene underneath
        const bg = this.add.rectangle(625, 384, 1250, 768, 0x00ff00, 0.5);
        bg.setDepth(50);

        // Placeholder visual elements
        this.add.image(625, 300, "star").setDepth(100);
        this.add
            .text(625, 490, "These are the rules", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // Button for closing out (this should stay unlike the above)
        const closeButton = this.add.text(100, 100, "Close Rules", {
            fill: "#0099ff",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        closeButton.setOrigin(0.5);
        closeButton.setPosition(625, 600);
        closeButton.setInteractive();
        closeButton.on(
            "pointerdown",
            function () {
                this.scene.stop("Rules");
            },
            this
        );
        closeButton.setDepth(100);

        // When the pointer hovers over the button, scale it up
        closeButton.on("pointerover", () => {
            closeButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        closeButton.on("pointerout", () => {
            closeButton.setScale(1); // Reset to original size
        });

        bg.setInteractive();

        EventBus.emit("current-scene-ready", this);
    }
}

