import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {
	RULES_BACKGROUND_COLOR,
	RULES_TEXT_ONE,
	RULES_TEXT_TWO,
	RULES_BACKGROUND_COLOR_TWO,
	RULES_TEXT_THREE,
	X_ANCHOR,
	Y_ANCHOR,
	TILE_SIZE,
} from "../../game-objects/constants";
import {setPieceStyle} from "./PieceStyle";

export class Settings extends Scene {
	constructor() {
		super("Settings");
	}

	preload() {
		this.load.setPath("assets");
		// this.load.image("star", "star.png");
		// this.load.image("background", "bg.png");
		this.load.image("pieceOption1", "pieceOption1.png");
		this.load.image("pieceOption2", "pieceOption2.png");
		this.load.image("tileOption1", "tileOption1.png");
		this.load.image("tileOption2", "tileOption2.png");

		// Load the pixel font
		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				// Once the font is loaded, we can start the scene
				this.fontLoaded = true; // Flag to indicate that the font is loaded
			},
		});
	}

	create() {
		// put Rules over game screen
		this.scene.moveAbove("MainGame", "Settings");
		// Creates a visual background that also blocks input on the scene underneath
		const bg = this.add.rectangle(625, 384, 1250, 768, RULES_BACKGROUND_COLOR, 0.5);
		bg.setDepth(50);

		// Creates a visual background that also blocks input on the scene underneath
		const square = this.add.rectangle(
			625,
			384,
			800,
			400,
			RULES_BACKGROUND_COLOR_TWO,
			0.9 // Opacity
		);
		square.setDepth(50);

		// Settings text
		this.add
			.text(625, 215, "SETTINGS", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 38,
				color: RULES_TEXT_TWO,
				stroke: RULES_TEXT_ONE,
				strokeThickness: 5,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const pieceOption1 = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE - 150, Y_ANCHOR + 3.5 * TILE_SIZE, "pieceOption1")
			.setDepth(101)
			.setScale(1.5);
		const pieceOption2 = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE - 50, Y_ANCHOR + 3.5 * TILE_SIZE, "pieceOption2")
			.setDepth(101)
			.setScale(1.5);
		const tileOption1 = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE + 50, Y_ANCHOR + 3.5 * TILE_SIZE, "tileOption1")
			.setDepth(101)
			.setScale(1.5);
		const tileOption2 = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE + 150, Y_ANCHOR + 3.5 * TILE_SIZE, "tileOption2")
			.setDepth(101)
			.setScale(1.5);
		const options = [pieceOption1, pieceOption2, tileOption1, tileOption2];

		pieceOption1.setInteractive();
		pieceOption1.on(
			"pointerdown",
			function () {
				setPieceStyle(1);
			},
			this
		);

		tileOption2.setInteractive();
		tileOption2.on(
			"pointerdown",
			function () {
				setPieceStyle(2);
			},
			this
		);

		pieceOption2.setInteractive();
		pieceOption2.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to pieceOption2
			},
			this
		);

		tileOption1.setInteractive();
		tileOption1.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to tileOption1
			},
			this
		);

		// make options larger when moused over to indicate selection
		for (const option in options) {
			// When the pointer hovers over a option, scale it up
			options[option].on("pointerover", () => {
				options[option].setScale(2);
			});

			// When the pointer moves away from the option, reset the scale to normal
			options[option].on("pointerout", () => {
				options[option].setScale(1.5);
			});
		}

		// Button for closing out (this should stay unlike the above)
		const closeButton = this.add.text(100, 100, "Close Settings", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			backgroundColor: RULES_TEXT_THREE,
			color: RULES_TEXT_TWO,
			stroke: RULES_TEXT_ONE,
			strokeThickness: 5,
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});
		closeButton.setOrigin(0.5);
		closeButton.setPosition(625, 625);
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
			closeButton.setScale(1.2); // Increase the scale (grow the button by 20%)
		});

		// When the pointer moves away from the button, reset the scale to normal
		closeButton.on("pointerout", () => {
			closeButton.setScale(1); // Reset to original size
		});

		bg.setInteractive();
		square.setInteractive();

		EventBus.emit("current-scene-ready", this);
	}
}
