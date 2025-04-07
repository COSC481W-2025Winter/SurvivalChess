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
		this.turnCounterText.setText(`Turn: ${this.turnCount}`);
	}

	incrementTurnCounter() {
		this.turnCount++;
		this.updateTurnCounter();
	}
}
