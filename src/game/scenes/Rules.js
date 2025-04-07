import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {
	RULES_BACKGROUND_COLOR,
	RULES_TEXT_ONE,
	RULES_TEXT_TWO,
	RULES_BACKGROUND_COLOR_TWO,
	RULES_TEXT_THREE,
} from "../../game-objects/constants";

import {configureButtons, paddingTexts, fontsizeTexts} from "../../game-objects/constants";
import {
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
		this.scene.moveAbove("MainGame", "Rules");
		// Creates a visual background that also blocks input on the scene underneath
		this.bg = this.add.rectangle(1, 1, 1, 1, RULES_BACKGROUND_COLOR, 0.5);
		this.bg.setDepth(50);

		// Creates a visual background that also blocks input on the scene underneath
		this.square = this.add.rectangle(
			0,
			0,
			0,
			0,
			RULES_BACKGROUND_COLOR_TWO,
			0.9 // Opacity
		);
		this.square.setDepth(50);

		// Rules text
		this.titleText = this.add
			.text(0, 0, "RULES", {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: RULES_TEXT_TWO,
				stroke: RULES_TEXT_ONE,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.rulesText = this.add
			.text(
				0,
				0,
				"- Pieces move the same as in regular chess\n\n" +
					"- To move, click on the piece you want to move, and then click on the square you want to move it to\n\n" +
					"- Enemy pieces spawn in waves that will increase in dificulty in later rounds\n\n" +
					"- Enemy pieces spawn in the top two rows (rows 7 & 8)\n\n" +
					"- Your goal is to capture enemy pieces while avoiding checkmate\n\n" +
					"- The more pieces you capture the more points you will gain\n\n" +
					"- A new wave of pieces will spawn every 13 rounds\n\n" +
					"- Capturing all the enemy pieces will progress you to the next round early",
				{
					fontFamily: "'Pixelify Sans', sans-serif",
					color: RULES_TEXT_TWO,
					stroke: RULES_TEXT_ONE,
					align: "left",
				}
			)
			.setOrigin(0.5)
			.setDepth(100);

		// Button for closing out (this should stay unlike the above)
		this.closeButton = this.add.text(0, 0, "Close Rules", {
			fontFamily: "'Pixelify Sans', sans-serif",
			backgroundColor: RULES_TEXT_THREE,
			color: RULES_TEXT_TWO,
			stroke: RULES_TEXT_ONE,
		});
		this.closeButton.on(
			"pointerdown",
			function () {
				this.scene.stop("Rules");
			},
			this
		);
		this.closeButton.setDepth(100);

		this.bg.setInteractive();
		this.square.setInteractive();

		const scene = this;
		configureButtons(this.closeButton);
		window.addEventListener(
			"resize",
			function (event) {
				scene.resize();
			},
			false
		);

		this.resize();
		EventBus.emit("current-scene-ready", this);
	}

	resize() {
		this.bg.setPosition(CENTER_WIDTH, CENTER_HEIGHT);
		this.bg.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
		this.square.setPosition(CENTER_WIDTH, 5.5 * DOZEN_HEIGHT);
		this.square.setSize(10 * DOZEN_WIDTH, 9 * DOZEN_HEIGHT);
		this.titleText.setPosition(CENTER_WIDTH, 1.75 * DOZEN_HEIGHT);
		this.rulesText.setPosition(CENTER_WIDTH, 6 * DOZEN_HEIGHT);
		this.closeButton.setPosition(CENTER_WIDTH, 11 * DOZEN_HEIGHT);
		this.rulesText.setWordWrapWidth(9.5 * DOZEN_WIDTH);
		paddingTexts(4 * UNIT_HEIGHT, 2 * UNIT_HEIGHT, this.closeButton);
		fontsizeTexts(DOZEN_HEIGHT, this.titleText);
		fontsizeTexts(5 * UNIT_HEIGHT, this.rulesText);
		fontsizeTexts(9 * UNIT_HEIGHT, this.closeButton);
	}
}
