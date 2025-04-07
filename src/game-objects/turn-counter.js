// turn-counter.js
export class TurnCounter {
	constructor(scene) {
		this.scene = scene;
		this.turnCount = 0;

		this.turnCounterText = this.scene.add.text(1000, 375, `Turn: ${this.turnCount}`, {
			fontSize: 28,
			color: "#ffffff",
		});
	}

	updateTurnCounter() {
		if (this.turnCounterText && this.turnCounterText.setText) {
			this.turnCounterText.setText(`Turn: ${this.turnCount}`);
		} else {
			console.error("turnCounterText is not a valid Phaser Text object");
		}
	}

	incrementTurnCounter() {
		this.turnCount++;
		this.updateTurnCounter();
	}
}
