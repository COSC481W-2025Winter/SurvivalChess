import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {QUEEN, BISHOP, ROOK, KNIGHT, X_ANCHOR, Y_ANCHOR, TILE_SIZE} from "../../game-objects/constants";

export class Promotion extends Scene {
	constructor() {
		super("Promotion");
	}

	preload() {
		this.load.setPath("assets/drummyfish chess/");
		this.load.image("queen", "queenW.png");
		this.load.image("knight", "knightW.png");
		this.load.image("rook", "rookW.png");
		this.load.image("bishop", "bishopW.png");
	}

	create() {
		const bgX = this.cameras.main.width;
		const bgY = this.cameras.main.height;
		this.add
			.text(500, 490, "Select what piece to promote your pawn into", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const queen = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE - 150, Y_ANCHOR + 3.5 * TILE_SIZE, "queen")
			.setDepth(5)
			.setScale(1.5);
		const bishop = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE - 50, Y_ANCHOR + 3.5 * TILE_SIZE, "bishop")
			.setDepth(5)
			.setScale(1.5);
		const knight = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE + 50, Y_ANCHOR + 3.5 * TILE_SIZE, "knight")
			.setDepth(5)
			.setScale(1.5);
		const rook = this.add
			.image(X_ANCHOR + 3.5 * TILE_SIZE + 150, Y_ANCHOR + 3.5 * TILE_SIZE, "rook")
			.setDepth(5)
			.setScale(1.5);
		const pieces = [queen, bishop, knight, rook];

		queen.setInteractive();
		queen.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to queen
				EventBus.emit("PawnPromoted", QUEEN);
				this.scene.stop("Promotion");
			},
			this
		);

		rook.setInteractive();
		rook.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to rook
				EventBus.emit("PawnPromoted", ROOK);
				this.scene.stop("Promotion");
			},
			this
		);

		bishop.setInteractive();
		bishop.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to bishop
				EventBus.emit("PawnPromoted", BISHOP);
				this.scene.stop("Promotion");
			},
			this
		);

		knight.setInteractive();
		knight.on(
			"pointerdown",
			function () {
				// sends event telling promotion is to knight
				EventBus.emit("PawnPromoted", KNIGHT);
				this.scene.stop("Promotion");
			},
			this
		);

		// make pieces larger when moused over to indicate selection
		for (const piece in pieces) {
			// When the pointer hovers over a piece, scale it up
			pieces[piece].on("pointerover", () => {
				pieces[piece].setScale(2);
			});

			// When the pointer moves away from the piece, reset the scale to normal
			pieces[piece].on("pointerout", () => {
				pieces[piece].setScale(1.5);
			});
		}

		// Creates a visual background that also blocks input on the scene underneath
		const bg = this.add.rectangle(bgX / 2, bgY / 2, bgX, bgY, 0x3b3b3b, 0.5);
		bg.setOrigin(0.5);
		bg.setInteractive();

		EventBus.emit("current-scene-ready", this);
	}
}
