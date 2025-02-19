export class ChessPiece extends Phaser.GameObjects.Image {
    #rank;
    #alignment;
    #moveCounter;

    constructor(scene, x, y, rank, alignment) {
        super(scene, x, y, rank + alignment);
        this.#rank = rank;
        this.#alignment = alignment;
        this.#moveCounter = 0;
    }

    getRank() {
        return this.#rank;
    }

    getAlignment() {
        return this.#alignment;
    }

    getMoveCounter() {
        return this.#moveCounter;
    }

    incrementMoveCounter() {
        this.#moveCounter++;
    }
}  