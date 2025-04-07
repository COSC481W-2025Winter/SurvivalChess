import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Rules extends Scene {
	constructor() {
		super("Rules");
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
				this.createContent();
			},
		});
	}

	create() {
		if (this.fontLoaded) {
			this.createContent();
		}
	}

	createContent() {
		const selectedPalette = localStorage.getItem("selectedPalette") || "default";

		const themeColors = {
			default: {
				fill: 0xe5aa70, // fawn
				stroke: 0xc04000, // mahogany
				bgOpacity: 0.3,
				panelOpacity: 0.9,
			},
			dark: {
				fill: 0xbbb8b1, // replacing fawn
				stroke: 0x222222, // replacing mahogany
				bgOpacity: 0.4,
				panelOpacity: 0.9,
			},
			light: {
				fill: 0x3b3b3b, // replacing fawn
				stroke: 0xffffff, // replacing mahogany
				bgOpacity: 0.3,
				panelOpacity: 0.8,
			},
		}[selectedPalette];

		const fillColor = Phaser.Display.Color.IntegerToColor(themeColors.fill).rgba;
		const strokeColor = Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba;

		this.scene.moveAbove("MainGame", "Rules");

		const bg = this.add.rectangle(625, 384, 1250, 768, themeColors.stroke, themeColors.bgOpacity);
		bg.setDepth(50);

		const square = this.add.rectangle(625, 384, 800, 400, 0xffffff, themeColors.panelOpacity);
		square.setDepth(50);

		// RULES heading
		this.add.text(625, 215, "RULES", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 38,
			color: fillColor,
			stroke: strokeColor,
			strokeThickness: 5,
			align: "center",
		})
		.setOrigin(0.5)
		.setDepth(100);

		// Rule body text
		const bodyStyle = {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 20,
			color: fillColor,
			stroke: strokeColor,
			strokeThickness: 0,
			align: "left",
		};

		this.add.text(
			615,
			400,
			"- Pieces move the same as in regular chess\n\n" +
			"- To move, click on the piece you want to move, and then click on the square\n   you want to move it to\n\n" +
			"- The enemy pieces spawn in waves that will increase in dificulty in later rounds\n\n" +
			"- Enemy pieces spawn in the top two rows (rows    &   )\n\n" +
			"- Your goal is to capture enemy pieces while avoiding checkmate\n\n" +
			"- The more pieces you capture the more points you will gain\n\n" +
			"- A new wave of pieces will spawn every        rounds\n\n" +
			"- Capturing all the enemy pieces will progress you to the next round early",
			bodyStyle
		)
		.setOrigin(0.5)
		.setDepth(100);

		this.add.text(723, 390, "7 8", bodyStyle).setOrigin(0.5).setDepth(100);
		this.add.text(625, 510, "13", bodyStyle).setOrigin(0.5).setDepth(100);

		// Close Button
		const closeButton = this.add.text(625, 625, "Close Rules", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			backgroundColor: "#ffffff", // always white panel
			color: fillColor, // text fill
			stroke: strokeColor, // border
			strokeThickness: 5,
			padding: { left: 20, right: 20, top: 10, bottom: 10 },
		});
		closeButton.setOrigin(0.5);
		closeButton.setInteractive();
		closeButton.on("pointerdown", () => this.scene.stop("Rules"));
		closeButton.on("pointerover", () => closeButton.setScale(1.2));
		closeButton.on("pointerout", () => closeButton.setScale(1));
		closeButton.setDepth(100);

		bg.setInteractive();
		square.setInteractive();

		EventBus.emit("current-scene-ready", this);
	}
}
