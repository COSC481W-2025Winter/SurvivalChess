import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { globalMoves, globalPieces, globalWaves } from "../../game-objects/global-stats";

import { paddingTexts, fontsizeTexts } from "../../game-objects/constants";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CENTER_WIDTH,
	CENTER_HEIGHT,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_HEIGHT,
} from "../../game-objects/constants";

export class GameOver extends Scene {
	constructor() {
		super({ key: "GameOver" });
	}

	preload() {
		this.load.audio("endMusic", "../assets/music/SurvivalChess-End.mp3");
		this.load.setPath("assets");

		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true;
			},
		});
	}

	create() {
		// Theme logic
		const selectedPalette = localStorage.getItem("selectedPalette") || "default";
		const themeColors = {
			default: { text: 0xe5aa70, background: 0xc04000 },
			dark: { text: 0xbbb8b1, background: 0x222222 },
			light: { text: 0x3b3b3b, background: 0xffffff },
		}[selectedPalette];

		this.buttonTextColor = themeColors.text;
		this.buttonBgColor = themeColors.background;

		// Music
		this.endMusic = this.sound.add("endMusic", { loop: false, volume: 0.5 });
		this.endMusic.play();

		// Scene layering
		this.scene.moveAbove("MainGame", "GameOver");

		// Background layers
		this.bg = this.add.rectangle(CENTER_WIDTH, CENTER_HEIGHT, WINDOW_WIDTH, WINDOW_HEIGHT, 0xffffff, 0);
		this.bg.setDepth(50);

		this.square = this.add.rectangle(CENTER_WIDTH, CENTER_HEIGHT, 800, 600, 0xffffff, 0.95);
		this.square.setDepth(50);

		// Title
		this.titleText = this.add.text(CENTER_WIDTH, 2 * DOZEN_HEIGHT, "Game Over!", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 50,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			strokeThickness: 5,
			align: "center",
		}).setOrigin(0.5).setDepth(100);

		// Stats
		this.createStatText(625, 275, "Number of Moves Made:", globalMoves);
		this.createStatText(625, 350, "Number of Captured Pieces:", globalPieces);
		this.createStatText(625, 425, "Number of Waves Survived:", globalWaves);

		// Buttons
		this.menuButton = this.createButton(CENTER_WIDTH, 525, "Main Menu", () => {
			console.log("Returning to main menu...");
			this.endMusic.stop();
			this.scene.stop("GameOver");
			this.scene.stop("MainGame");
			this.scene.start("Game"); // ← Go to Start screen
		});

		this.restartButton = this.createButton(CENTER_WIDTH, 600, "Restart Game", () => {
			console.log("Restarting game...");
			this.endMusic.stop();
			this.scene.stop("GameOver");
			this.scene.stop("MainGame");
			this.scene.start("MainGame");
		});

		this.bg.setInteractive();
		this.square.setInteractive();
		EventBus.emit("current-scene-ready", this);
	}

	createStatText(x, y, label, value) {
		const labelText = this.add.text(x, y, label, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			strokeThickness: 4,
			align: "center",
		}).setOrigin(0.5).setDepth(100);

		const valueText = this.add.text(x + 200, y, value.toString(), {
			fontSize: 25,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			strokeThickness: 4,
			align: "center",
		}).setOrigin(0.5).setDepth(100);
	}

	createButton(x, y, text, callback) {
		const button = this.add.text(x, y, text, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 20,
			backgroundColor: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			strokeThickness: 5,
			padding: { left: 20, right: 20, top: 10, bottom: 10 },
		})
		.setOrigin(0.5)
		.setDepth(150)
		.setInteractive();

		button.on("pointerdown", callback);
		button.on("pointerover", () => button.setScale(1.1));
		button.on("pointerout", () => button.setScale(1));
		return button;
	}
}
