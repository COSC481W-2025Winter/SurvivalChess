import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { globalMoves, globalPieces, globalWaves } from "../../game-objects/global-stats";

export class GameOver extends Scene {
	constructor() {
		super({ key: "GameOver" });
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("star", "star.png");
		this.load.image("background", "bg.png");

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
		const selectedPalette = localStorage.getItem("selectedPalette") || "default";

		const themeColors = {
			default: { light: 0xe5aa70, dark: 0xc04000 }, // fawn & mahogany
			dark: { light: 0xbbb8b1, dark: 0x222222 },     // light text, dark background
			light: { light: 0xffffff, dark: 0x3b3b3b },    // white text, dark gray background
		}[selectedPalette];
		

		// Store theme colors as class properties for access in createButton
		this.titleFillColor = themeColors.light;
		this.titleStrokeColor = themeColors.dark;
		this.panelTextColor = themeColors.light;
		this.panelBgColor = themeColors.dark;
		this.buttonTextColor = themeColors.light;
		this.buttonBgColor = themeColors.dark;

		this.scene.moveAbove("MainGame", "GameOver");

		// Background rectangles
		const bg = this.add.rectangle(625, 384, 1250, 768, 0xffffff, 0); // White transparent BG
		bg.setDepth(50);

		const square = this.add.rectangle(625, 375, 800, 600, 0xffffff, 0.95); // White panel
		square.setDepth(50);

		const square2 = this.add.rectangle(625, 350, 450, 225, this.panelBgColor, 0.9); // Score panel
		square2.setDepth(50);

		// Game Over Title
		this.add.text(625, 175, "Game Over!", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 75,
			color: Phaser.Display.Color.IntegerToColor(this.titleFillColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.titleStrokeColor).rgba,
			strokeThickness: 5,
			align: "center",
		})
		.setOrigin(0.5)
		.setDepth(100);

		// Score values
		const textOffsetX = 185;

		this.createStatText(625, 275, "Number of Moves Made:", globalMoves, textOffsetX);
		this.createStatText(625, 350, "Number of Captured Pieces:", globalPieces, textOffsetX);
		this.createStatText(625, 425, "Number of Waves Survived:", globalWaves, textOffsetX);

		// Buttons
		this.createButton(625, 525, "Main Menu", () => {
			this.scene.stop("GameOver");
			this.scene.stop("MainGame");
			this.scene.start("Game"); // back to menu scene
		});

		this.createButton(625, 600, "Restart Game", () => {
			this.scene.stop("GameOver");
			this.scene.stop("MainGame");
			this.scene.start("MainGame");
		});

		bg.setInteractive();
		square.setInteractive();
		square2.setInteractive();
		EventBus.emit("current-scene-ready", this);
	}

	createStatText(x, y, label, value, offsetX) {
		this.add.text(x, y, label, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			color: Phaser.Display.Color.IntegerToColor(this.panelTextColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.panelBgColor).rgba,
			strokeThickness: 4,
			align: "center",
		})
		.setOrigin(0.5)
		.setDepth(100);

		this.add.text(x + offsetX, y, value + "", {
			fontSize: 25,
			color: Phaser.Display.Color.IntegerToColor(this.panelTextColor).rgba,
			stroke: Phaser.Display.Color.IntegerToColor(this.panelBgColor).rgba,
			strokeThickness: 4,
			align: "center",
		})
		.setOrigin(0.5)
		.setDepth(100);
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
	}
}
