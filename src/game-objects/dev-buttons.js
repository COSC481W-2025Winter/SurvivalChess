import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING} from "./constants";
import {PLAYER, COMPUTER} from "./constants";
import {CREAMHEX, ONYXHEX} from "./constants";

import {configureButtons, paddingTexts, fontsizeTexts} from "./constants";
import {LEFT_X_CENTER, LEFT_UNIT} from "./constants";

const alignments = [PLAYER, COMPUTER];
const alignment_names = ["white", "black"];
const ranks = [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING];
const rank_names = ["♙", "♖", "♘", "♗", "♕", "♔"];

const BAM = "BAM";
const ZAP = "ZAP";
const STOP = "STOP";

const STYLE_OFF = {fill: CREAMHEX, backgroundColor: ONYXHEX, padding: {left: 2, right: 2, top: 2, bottom: 2}};
const STYLE_ON = {fill: ONYXHEX, backgroundColor: CREAMHEX, padding: {left: 2, right: 2, top: 2, bottom: 2}};

let DEV_MODE = false;

let dev_alignment = PLAYER,
	dev_rank = PAWN;
let dev_bamzap = null,
	prev_bamzap;
let dev_stopOn = false,
	prev_stopOn;
let dev_deadAI = false,
	prev_deadAI;

function dev_setAlignment(alignment) {
	dev_alignment = dev_alignment == alignment ? null : alignment;
}
function dev_setRank(rank) {
	dev_rank = dev_rank == rank ? null : rank;
}
function toggleDev() {
	DEV_MODE = !DEV_MODE;
}
function dev_toggleFeature(feature) {
	switch (feature) {
		case BAM:
		case ZAP:
			dev_bamzap = dev_bamzap == feature ? null : feature;
			break;
		case STOP:
			dev_stopOn = !dev_stopOn;
			break;
	}
}
export function dev_toggleAI() {
	dev_deadAI = !dev_deadAI;
}

export class DevButtons {
	#scene;
	#chessTiles;
	#devButton;
	#alignmentButtons = {};
	#rankButtons = {};
	#bamButton;
	#boinkButton;
	#zapButton;
	#zoinkButton;
	#flipButton;
	#stopButton;
	#aiButton;

	constructor(scene, chessTiles) {
		this.#scene = scene;
		this.#chessTiles = chessTiles;

		this.#devButton = this.#scene.add.text(0, 0, "Dev Mode", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
		});
		this.#devButton.on("pointerdown", () => {
			if (DEV_MODE == true) {
				prev_bamzap = dev_bamzap;
				prev_stopOn = dev_stopOn;
				prev_deadAI = dev_deadAI;
				dev_bamzap = dev_stopOn = dev_deadAI = false;
			} else {
				dev_bamzap = prev_bamzap;
				dev_stopOn = prev_stopOn;
				dev_deadAI = prev_deadAI;
			}
			toggleDev();
			for (let button of this.getNondevButtons()) button.visible = !button.visible;
		});

		for (let i = 0; i < alignments.length; i++) {
			this.#alignmentButtons[alignments[i]] = this.#scene.add.text(0, 0, alignment_names[i], STYLE_OFF);
			this.#alignmentButtons[alignments[i]].on("pointerdown", () => {
				if (dev_alignment != alignments[i]) {
					this.toggleButton(this.#alignmentButtons[dev_alignment]);
					dev_setAlignment(alignments[i]);
					this.toggleButton(this.#alignmentButtons[alignments[i]]);
				}
			});
		}

		for (let i = 0; i < ranks.length; i++) {
			this.#rankButtons[ranks[i]] = this.#scene.add.text(0, 0, rank_names[i], STYLE_OFF);
			this.#rankButtons[ranks[i]].on("pointerdown", () => {
				if (dev_rank != ranks[i]) {
					this.toggleButton(this.#rankButtons[dev_rank]);
					dev_setRank(ranks[i]);
					this.toggleButton(this.#rankButtons[ranks[i]]);
				}
			});
		}

		this.#bamButton = this.#scene.add.text(0, 0, "bam", STYLE_OFF);
		this.#zapButton = this.#scene.add.text(0, 0, "zap", STYLE_OFF);
		this.#boinkButton = this.#scene.add.text(0, 0, "boink", STYLE_OFF);
		this.#zoinkButton = this.#scene.add.text(0, 0, "zoink", STYLE_OFF);

		this.#bamButton.on("pointerdown", () => {
			if (dev_bamzap == ZAP) this.toggleButton(this.#zapButton);
			dev_toggleFeature(BAM);
			this.toggleButton(this.#bamButton);
		});
		this.#zapButton.on("pointerdown", () => {
			if (dev_bamzap == BAM) this.toggleButton(this.#bamButton);
			dev_toggleFeature(ZAP);
			this.toggleButton(this.#zapButton);
		});
		this.#boinkButton.on("pointerdown", () => {
			this.#chessTiles.unselect();
			this.#chessTiles.boardState.initializePieces(dev_alignment, true);
		});
		this.#zoinkButton.on("pointerdown", () => {
			this.#chessTiles.unselect();
			this.#chessTiles.boardState.zapPieces(dev_alignment);
		});

		this.#flipButton = this.#scene.add.text(0, 0, "Flip!", STYLE_OFF);
		this.#stopButton = this.#scene.add.text(0, 0, "Stop!", STYLE_OFF);

		this.#flipButton.on("pointerdown", () => {
			this.#chessTiles.unselect();
			this.#chessTiles.toggleTurn(true);
		});
		this.#stopButton.on("pointerdown", () => {
			dev_toggleFeature(STOP);
			this.toggleButton(this.#stopButton);
		});

		this.#aiButton = this.#scene.add.text(0, 0, "Disable AI", STYLE_OFF);

		this.#aiButton.on("pointerdown", () => {
			dev_toggleAI();
			if (dev_deadAI) this.#aiButton.setText("Enable AI");
			else this.#aiButton.setText("Disable AI");
		});

		configureButtons(this.#devButton, ...this.getNondevButtons());

		// Restore dev mode settings
		let toggled_buttons = [];
		if (!DEV_MODE) for (let button of this.getNondevButtons()) button.visible = !button.visible;
		if (dev_alignment) toggled_buttons.push(this.#alignmentButtons[dev_alignment]);
		if (dev_rank) toggled_buttons.push(this.#rankButtons[dev_rank]);
		if (DEV_MODE ? dev_bamzap == ZAP : prev_bamzap == ZAP) toggled_buttons.push(this.#zapButton);
		if (DEV_MODE ? dev_bamzap == BAM : prev_bamzap == BAM) toggled_buttons.push(this.#bamButton);
		if (DEV_MODE ? dev_stopOn : prev_stopOn) toggled_buttons.push(this.#stopButton);
		if (DEV_MODE ? dev_deadAI : prev_deadAI) this.#aiButton.setText("Enable AI");
		this.toggleButton(...toggled_buttons);
	}

	resize() {
		this.#devButton.setPosition(LEFT_X_CENTER, LEFT_UNIT);
		for (let i = 0; i < alignments.length; i++)
			this.#alignmentButtons[alignments[i]].setPosition((0.5 + i) * LEFT_X_CENTER, 2.5 * LEFT_UNIT);
		for (let i = 0; i < ranks.length; i++)
			this.#rankButtons[ranks[i]].setPosition(((1 + 2 * i) / 6) * LEFT_X_CENTER, 3.5 * LEFT_UNIT);
		this.#bamButton.setPosition(0.5 * LEFT_X_CENTER, 4.5 * LEFT_UNIT);
		this.#zapButton.setPosition(1.5 * LEFT_X_CENTER, 4.5 * LEFT_UNIT);
		this.#boinkButton.setPosition(0.5 * LEFT_X_CENTER, 5.5 * LEFT_UNIT);
		this.#zoinkButton.setPosition(1.5 * LEFT_X_CENTER, 5.5 * LEFT_UNIT);
		this.#flipButton.setPosition(0.5 * LEFT_X_CENTER, 7.5 * LEFT_UNIT);
		this.#stopButton.setPosition(1.5 * LEFT_X_CENTER, 7.5 * LEFT_UNIT);
		this.#aiButton.setPosition(1.0 * LEFT_X_CENTER, 9.5 * LEFT_UNIT);

		paddingTexts(LEFT_UNIT / 12, LEFT_UNIT / 12, this.#devButton, ...this.getNondevButtons());
		fontsizeTexts((LEFT_UNIT / 12) * 9, this.#devButton, ...this.getNondevButtons());
	}

	// Return list of all dev buttons excluding the dev mode button
	getNondevButtons() {
		return [
			...Object.values(this.#alignmentButtons),
			...Object.values(this.#rankButtons),
			this.#bamButton,
			this.#boinkButton,
			this.#zapButton,
			this.#zoinkButton,
			this.#flipButton,
			this.#stopButton,
			this.#aiButton,
		];
	}

	// Toggle visual on/off of dev buttons (does not change actual dev settings)
	toggleButton(...buttons) {
		for (let button of buttons)
			if (button.style.color == CREAMHEX) button.setStyle(STYLE_ON);
			else button.setStyle(STYLE_OFF);
	}
}

export {dev_alignment, dev_rank, dev_bamzap, dev_stopOn, dev_deadAI};
export {BAM, ZAP, STOP};
