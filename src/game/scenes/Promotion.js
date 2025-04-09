import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {QUEEN, BISHOP, ROOK, KNIGHT} from "../../game-objects/constants";

import {fontsizeTexts} from "../../game-objects/constants";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CENTER_WIDTH,
	CENTER_HEIGHT,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_WIDTH,
} from "../../game-objects/constants";
import {getPieceStyle} from "./PieceStyle";

export class Promotion extends Scene {
	constructor() {
		super("Promotion");
	}

	preload() {
		this.load.setPath("assets/ourChessPieces/");
		this.load.image("queen", "queenW" + getPieceStyle() + ".png");
		this.load.image("knight", "knightW" + getPieceStyle() + ".png");
		this.load.image("rook", "rookW" + getPieceStyle() + ".png");
		this.load.image("bishop", "bishopW" + getPieceStyle() + ".png");

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
		this.text = this.add
			.text(0, 0, "Select what piece to promote your pawn into", {
				fontFamily: "Pixelify Sans",
				color: "#ffffff",
				stroke: "#000000",
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.queen = this.add.image(0, 0, "queen");
		this.bishop = this.add.image(0, 0, "bishop");
		this.knight = this.add.image(0, 0, "knight");
		this.rook = this.add.image(0, 0, "rook");
		this.pieces = [this.queen, this.bishop, this.knight, this.rook];

		this.queen.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to this.queen
				EventBus.emit("PawnPromoted", QUEEN);
				this.scene.stop("Promotion");
			},
			this
		);

		this.rook.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to this.rook
				EventBus.emit("PawnPromoted", ROOK);
				this.scene.stop("Promotion");
			},
			this
		);

		this.bishop.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to this.bishop
				EventBus.emit("PawnPromoted", BISHOP);
				this.scene.stop("Promotion");
			},
			this
		);

		this.knight.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to this.knight
				EventBus.emit("PawnPromoted", KNIGHT);
				this.scene.stop("Promotion");
			},
			this
		);

		// make this.pieces larger when moused over to indicate selection
		for (const piece in this.pieces) {
			this.pieces[piece].setDepth(5).setScale(1.5).setInteractive();
			// When the pointer hovers over a piece, scale it up
			this.pieces[piece].on("pointerover", () => {
				this.pieces[piece].setScale(UNIT_WIDTH / 4);
			});

			// When the pointer moves away from the piece, reset the scale to normal
			this.pieces[piece].on("pointerout", () => {
				this.pieces[piece].setScale(UNIT_WIDTH / 6);
			});
		}

		// Creates a visual background that also blocks input on the scene underneath
		this.bg = this.add.rectangle(1, 1, 1, 1, 0x3b3b3b, 0.5);
		this.bg.setOrigin(0.5);
		this.bg.setInteractive();

		const scene = this;
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
		this.text.setPosition(CENTER_WIDTH, 3 * DOZEN_HEIGHT);
		this.text.setStroke("#000000", UNIT_WIDTH);
		fontsizeTexts(4 * UNIT_WIDTH, this.text);

		let counter = 0;
		for (let piece in this.pieces) {
			this.pieces[piece].setPosition((4.5 + counter) * DOZEN_WIDTH, CENTER_HEIGHT);
			this.pieces[piece].scale = UNIT_WIDTH / 6;
			counter += 1;
		}
	}
}
