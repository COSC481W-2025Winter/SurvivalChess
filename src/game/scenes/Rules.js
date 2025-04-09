import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {
	configureButtons,
	paddingTexts,
	fontsizeTexts,
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CENTER_WIDTH,
	CENTER_HEIGHT,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_HEIGHT,
} from "../../game-objects/constants";

export class Rules extends Scene {
	bg;
	square;
	titleText;
	rulesText;
	closeButton;

	constructor() {
		super("Rules");
	}

	preload() {
		this.load.setPath("assets");

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
				fill: 0xe5aa70,
				stroke: 0xc04000,
				bgOpacity: 0.3,
				panelOpacity: 0.9,
			},
			dark: {
				fill: 0xbbb8b1,
				stroke: 0x222222,
				bgOpacity: 0.4,
				panelOpacity: 0.9,
			},
			light: {
				fill: 0x3b3b3b,
				stroke: 0xffffff,
				bgOpacity: 0.2, // reduced opacity for light mode
				panelOpacity: 0.8,
			},
		}[selectedPalette];

		const fillColor = Phaser.Display.Color.IntegerToColor(themeColors.fill).rgba;
		const strokeColor = Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba;

		this.scene.moveAbove("MainGame", "Rules");

		this.bg = this.add.rectangle(
			CENTER_WIDTH,
			CENTER_HEIGHT,
			WINDOW_WIDTH,
			WINDOW_HEIGHT,
			themeColors.stroke,
			themeColors.bgOpacity
		);
		this.bg.setDepth(50);

		this.square = this.add.rectangle(
			CENTER_WIDTH,
			5.5 * DOZEN_HEIGHT,
			10 * DOZEN_WIDTH,
			9 * DOZEN_HEIGHT,
			0xffffff,
			themeColors.panelOpacity
		);
		this.square.setDepth(50);

		this.titleText = this.add
			.text(CENTER_WIDTH, 1.75 * DOZEN_HEIGHT, "RULES", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 38,
				color: fillColor,
				stroke: strokeColor,
				strokeThickness: 5,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.rulesText = this.add
			.text(
				CENTER_WIDTH,
				6 * DOZEN_HEIGHT,
				"- Pieces move the same as in regular chess\n\n" +
					"- To move, click on the piece you want to move, and then click on the square you want to move it to\n\n" +
					"- Enemy pieces spawn in waves that will increase in difficulty in later rounds\n\n" +
					"- Enemy pieces spawn in the top two rows (rows 7 & 8)\n\n" +
					"- Your goal is to capture enemy pieces while avoiding checkmate\n\n" +
					"- The more pieces you capture the more points you will gain\n\n" +
					"- A new wave of pieces will spawn every 13 rounds\n\n" +
					"- Capturing all the enemy pieces will progress you to the next round early",
				{
					fontFamily: "'Pixelify Sans', sans-serif",
					fontSize: 20,
					color: fillColor,
					stroke: strokeColor,
					strokeThickness: 0,
					align: "left",
				}
			)
			.setOrigin(0.5)
			.setDepth(100);

		this.closeButton = this.add.text(CENTER_WIDTH, 11 * DOZEN_HEIGHT, "Close Rules", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			backgroundColor: "#ffffff", // always white panel
			color: fillColor,
			stroke: strokeColor,
			strokeThickness: 5,
			padding: {left: 20, right: 20, top: 10, bottom: 10},
		});
		this.closeButton.setOrigin(0.5);
		this.closeButton.setInteractive();
		this.closeButton.on("pointerdown", () => this.scene.stop("Rules"));
		this.closeButton.on("pointerover", () => this.closeButton.setScale(1.2));
		this.closeButton.on("pointerout", () => this.closeButton.setScale(1));
		this.closeButton.setDepth(100);

		this.rulesText.setWordWrapWidth(9.5 * DOZEN_WIDTH);

		configureButtons(this.closeButton);
		paddingTexts(4 * UNIT_HEIGHT, 2 * UNIT_HEIGHT, this.closeButton);
		fontsizeTexts(DOZEN_HEIGHT, this.titleText);
		fontsizeTexts(5 * UNIT_HEIGHT, this.rulesText);
		fontsizeTexts(9 * UNIT_HEIGHT, this.closeButton);

		this.bg.setInteractive();
		this.square.setInteractive();

		EventBus.emit("current-scene-ready", this);
	}
}
