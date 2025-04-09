import {WHITE_TILE_COLOR, BLACK_TILE_COLOR, fontsizeTexts} from "./constants";
import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, START_TEXT_ONE} from "./constants";
import {PLAYER, COMPUTER} from "./constants";
import {ChessPiece} from "./chess-piece";

import {RIGHT_X_CENTER, RIGHT_UNIT} from "./constants";

export class PiecesTaken {
	preload() {
		this.load.setPath("assets");
		// Load Chess piece pngs
		this.load.setPath("assets/ourChessPieces");
		for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN])
			for (const alignment of [PLAYER, COMPUTER]) this.load.image(rank + alignment, rank + alignment + "4.png");

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

	scene;

	titleText;
	box1;
	box2;

	scores;
	texts;
	images;

	constructor(scene) {
		// set up variables to keep track of elements
		this.scene = scene;

		// add the title and the two "boxes" for the pieces
		this.titleText = this.scene.add.text(0, 0, "Captured Pieces", {
			fontFamily: "'Pixelify Sans', sans-serif",
			color: START_TEXT_ONE,
		});
		this.box1 = this.scene.add.rectangle(0, 0, 0, 0, WHITE_TILE_COLOR).setOrigin(0.5);
		this.box2 = this.scene.add.rectangle(0, 0, 0, 0, BLACK_TILE_COLOR).setOrigin(0.5);

		this.scores = {};
		this.texts = {};
		this.images = {};
		for (const alignment of [PLAYER, COMPUTER]) {
			this.scores[alignment] = {};
			this.texts[alignment] = {};
			this.images[alignment] = {};
			for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN]) {
				this.scores[alignment][rank] = 0;

				this.texts[alignment][rank] = this.scene.add
					.text(0, 0, "00", {
						color: START_TEXT_ONE,
					})
					.setOrigin(0.5);

				this.images[alignment][rank] = new ChessPiece(this.scene, 0, 0, rank, alignment).setOrigin(0.5);
				this.scene.add.existing(this.images[alignment][rank]);
			}
		}

		this.resize();
	}

	resize() {
		this.titleText.setPosition(RIGHT_X_CENTER, 0.5 * RIGHT_UNIT).setOrigin(0.5);
		fontsizeTexts(RIGHT_UNIT / 2, this.titleText);

		this.box1.setPosition(RIGHT_X_CENTER, 2.5 * RIGHT_UNIT);
		this.box2.setPosition(RIGHT_X_CENTER, 2.5 * RIGHT_UNIT);
		this.box1.setSize(5.75 * RIGHT_UNIT, 2.75 * RIGHT_UNIT);
		this.box2.setSize(5.5 * RIGHT_UNIT, 2.5 * RIGHT_UNIT);

		let x, y, counter;
		for (const alignment of [PLAYER, COMPUTER]) {
			y = 2.5 * RIGHT_UNIT;
			y += alignment == PLAYER ? (2.5 / 4) * RIGHT_UNIT : (-2.5 / 4) * RIGHT_UNIT;
			counter = -2;
			for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN]) {
				x = RIGHT_X_CENTER + (1.1 * counter + 0.25) * RIGHT_UNIT;
				this.texts[alignment][rank].setPosition(x, y);
				x = RIGHT_X_CENTER + (1.1 * counter - 0.25) * RIGHT_UNIT;
				this.images[alignment][rank].setPosition(x, y);

				fontsizeTexts(RIGHT_UNIT / 3, this.texts[alignment][rank]);
				this.images[alignment][rank].scale = RIGHT_UNIT / 60;

				counter += 1;
			}
		}
	}
	updatePanelColor(darkHex, lightHex, palette = "default") {
		if (this.box2) this.box2.setFillStyle(darkHex);
		if (this.box1) this.box1.setFillStyle(lightHex);
	
		// Safely update title text color
		if (this.titleText && this.titleText.setColor && this.titleText.visible) {
			try {
				this.titleText.setColor(palette === "light" ? "#3B3B3B" : "#FFFFFF");
			} catch (err) {
				console.warn("setColor failed on titleText:", err);
			}
		}
	}

	addPiece(i, j, rank, alignment) {
		this.piecesTaken[i][j] = new ChessPiece(this.scene, X_ANCHOR + i * 72, Y_ANCHOR + j * TILE_SIZE, rank, alignment);
		this.scene.add.existing(this.piecesTaken[i][j]);
		this.scene.add.text(X_ANCHOR + 15 + i * 72, Y_ANCHOR - 7 + j * TILE_SIZE, "x ", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 16,
			color: START_TEXT_ONE,
		});
	}

	takePiece(rank, alignment) {
		this.scores[alignment][rank] += 1;
		let text = this.scores[alignment][rank].toString().padStart(2, "0");
		this.texts[alignment][rank].text = text;
	}
}
