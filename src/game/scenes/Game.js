import {Scene} from "phaser";
import {EventBus} from "../EventBus";

import {SettingsButton} from "./SettingsButton";
import {RulesButton} from "./RulesButton";

import {ChessTiles} from "../../game-objects/chess-tiles";

import {pieceStyleValue} from "./PieceStyle";

import {
	PAWN,
	ROOK,
	KNIGHT,
	BISHOP,
	QUEEN,
	KING,
	CREAMHEX,
	ONYXHEX,
	BACKGROUND_COLOR,
	PLAYER,
	COMPUTER,
} from "../../game-objects/constants";

export class Game extends Scene {
	constructor() {
		super("MainGame");
	}

	preload() {
		this.load.setPath("assets");
		// Load Chess piece pngs
		this.load.setPath("assets/ourChessPieces");
		for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING]) {
			for (const alignment of [PLAYER, COMPUTER]) {
				this.load.image(rank + alignment, rank + alignment + pieceStyleValue + ".png");
			}
		}

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
		this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);

		// and a board, and an icon, and a black tile, and a white tile; Totaling to 40 images
		new ChessTiles(this);

		const endButton = this.add.text(100, 100, "End Game!", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 20,
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});
		endButton.setPosition(1050, 700);
		endButton.setInteractive();
		endButton.setOrigin(0.5);

		endButton.on(
			"pointerdown",
			function () {
				import("./GameOver") //
					.then((module) => {
						// Only add the scene if it's not already registered
						if (!this.scene.get("GameOver")) {
							this.scene.add("GameOver", module.GameOver); // Add the MainGame scene dynamically
						}
						// Start the MainGame scene
						this.scene.launch("GameOver"); // Use launch to run scene in parallel to current
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

		const settingsButton = this.add.text(100, 100, "See Settings", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 20,
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});

		const rulesButton = this.add.text(100, 100, "See Rules", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 20,
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});

		settingsButton.setPosition(1050, 600);
		settingsButton.setInteractive();
		settingsButton.setOrigin(0.5);
		settingsButton.on("pointerdown", new SettingsButton(this).click, this);
		// When the pointer hovers over the button, scale it up
		settingsButton.on("pointerover", () => {
			settingsButton.setScale(1.2); // Increase the scale (grow the button by 20%)
		});
		// When the pointer moves away from the button, reset the scale to normal
		settingsButton.on("pointerout", () => {
			settingsButton.setScale(1); // Reset to original size
		});

		rulesButton.setPosition(1050, 650);

		rulesButton.setInteractive();
		rulesButton.setOrigin(0.5);
		rulesButton.on("pointerdown", new RulesButton(this).click, this);

		// When the pointer hovers over the button, scale it up
		rulesButton.on("pointerover", () => {
			rulesButton.setScale(1.2); // Increase the scale (grow the button by 20%)
		});

		// When the pointer moves away from the button, reset the scale to normal
		rulesButton.on("pointerout", () => {
			rulesButton.setScale(1); // Reset to original size
		});

		EventBus.emit("current-scene-ready", this);
	}
}
