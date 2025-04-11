// turn-counter.js
import {globalMoves, globalWaves} from "./global-stats";

export class TurnCounter {
	scene;
	turnCount;
	waveCount;

	constructor(scene) {
		this.scene = scene;
		this.turnCount = 0;
		this.waveCount = 0;

		if (this.scene?.add?.text) {
			this.turnCounterText = this.scene.add.text(1000, 375, `Turn: ${this.turnCount}`, {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 28,
				color: "#ffffff",
			});

			this.waveCounterText = this.scene.add.text(1000, 450, `Wave: ${this.waveCount}`, {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 28,
				color: "#ffffff",
			});
		} else {
			console.warn("TurnCounter initialized without valid scene — skipping text setup");
		}
	}

	updateTurnCounter() {
		if (this.turnCounterText && this.turnCounterText.setText) {
			this.turnCount = globalMoves;
			this.turnCounterText.setText(`Turn: ${this.turnCount}`);
		} else {
			console.error("turnCounterText is not a valid Phaser Text object");
		}
	}

	updateWaveCounterText() {
		if (this.waveCounterText && this.waveCounterText.setText) {
			this.waveCount = globalWaves;
			this.waveCounterText.setText(`Wave: ${this.waveCount}`);
		} else {
			console.error("waveCounterText is not a valid Phaser Text object");
		}
	}
}
