import {Scene} from "phaser";
import {EventBus} from "../EventBus";

export class Settings extends Scene {
	constructor() {
		super("Settings");
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("star", "star.png");
		this.load.image("background", "bg.png");
	}

	create() {
		// Creates a visual background that also blocks input on the scene underneath
		const bg = this.add.rectangle(625, 384, 1250, 768, 0x00ff00, 0.5);
		bg.setDepth(50);

		// Placeholder visual elements
		this.add.image(512, 384, "background").alpha = 0.5;
		this.add.image(512, 350, "star").setDepth(100);
		this.add
			.text(512, 490, "Settings mode", {
				fontFamily: "purple",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const closeButton = this.add.text(100, 100, "Close Settings", {
			fill: "#0099ff",
			backgroundColor: "#ffff",
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});

		closeButton.setOrigin(0.5);
		closeButton.setPosition(625, 600);
		closeButton.setInteractive();
		closeButton.on(
			"pointerdown",
			function () {
				this.scene.stop("Settings");
			},
			this
		);
		closeButton.setDepth(100);

		// When the pointer hovers over the button, scale it up
		closeButton.on("pointerover", () => {
			closeButton.setScale(1.2);
		});

		// When the pointer moves away from the button, reset the scale to normal
		closeButton.on("pointerout", () => {
			closeButton.setScale(1);
		});

		bg.setInteractive();

		EventBus.emit("current-scene-ready", this);
	}
}
