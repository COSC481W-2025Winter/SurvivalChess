export class ChessPiece extends Phaser.GameObjects.Image {
    constructor(scene, x, y, rank, alignment) {
        super(scene, x, y, rank+alignment);
        this.rank = rank;
        this.alignment = alignment;
    }

    getRank()
    {
        return this.rank;
    }

    getAlignment()
    {
        return this.alignment;
    }
}  