import { TILE_SIZE, X_ANCHOR, Y_ANCHOR } from "./constants";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "./constants";
import { PLAYER, COMPUTER } from "./constants";
import { CREAMHEX, ONYXHEX } from "./constants";

const BAM = "BAM";
const ZAP = "ZAP";
const STOP = "STOP";

const STYLE_OFF = { fill: CREAMHEX, backgroundColor: ONYXHEX, 
                    padding: { left: 2, right: 2, top: 2, bottom: 2 } };
const STYLE_ON = { fill: ONYXHEX, backgroundColor: CREAMHEX, 
                   padding: { left: 2, right: 2, top: 2, bottom: 2 } };

let DEV_MODE = false;

let dev_alignment = PLAYER, dev_rank = PAWN;
let dev_bamzap = null, prev_bamzap;
let dev_stopOn = false, prev_stopOn;

function dev_setAlignment(alignment) {
    dev_alignment = (dev_alignment == alignment) ? null : alignment;
}
function dev_setRank(rank) {
    dev_rank = (dev_rank == rank) ? null : rank;
}
function toggleDev() {
    DEV_MODE = !DEV_MODE;
}
function dev_toggleFeature(feature) {
    switch (feature) {
        case BAM:
        case ZAP:
            dev_bamzap = (dev_bamzap == feature) ? null : feature;
            break;
        case STOP:
            dev_stopOn = !dev_stopOn;
            break;
    }
}

export class DEV_BUTTONS {
    
    constructor(scene, chessTiles) {
        this.scene = scene;
        this.chessTiles = chessTiles;

        let dev_x_anchor = (X_ANCHOR - TILE_SIZE) / 2;
        let dev_y_anchor = (Y_ANCHOR - 0.5 * TILE_SIZE) / 2;
        
        const alignments = [PLAYER, COMPUTER];
        const alignment_names = ["white", "black"];
        const ranks = [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING];
        const rank_names = ["♙", "♖", "♘", "♗", "♕", "♔"];

        this.devButton;
        this.alignmentButtons = {};
        this.rankButtons = {};
        this.bamButton, this.boinkButton;
        this.zapButton, this.zoinkButton;
        this.flipButton, this.stopButton;

        this.devButton = this.scene.add.text(dev_x_anchor, dev_y_anchor, "Dev Mode", {
            fill: CREAMHEX,
            backgroundColor: ONYXHEX,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        this.devButton.on("pointerdown", () => {
            if (DEV_MODE == true) {
                prev_bamzap = dev_bamzap;
                prev_stopOn = dev_stopOn;
                dev_bamzap = dev_stopOn = false;
            } else {
                dev_bamzap = prev_bamzap;
                dev_stopOn = prev_stopOn;
            }
            toggleDev();
            for (let button of this.getNonDevButtons())
                button.visible = !button.visible;
        });

        for (let i = 0; i < alignments.length; i++) {
            this.alignmentButtons[alignments[i]] = this.scene.add.text((0.5 + i) * dev_x_anchor, 2.5 * dev_y_anchor, alignment_names[i], STYLE_OFF);
            this.alignmentButtons[alignments[i]].on("pointerdown", () => {
                if (dev_alignment != alignments[i]) {
                    this.toggleButton(this.alignmentButtons[dev_alignment]);
                    dev_setAlignment(alignments[i]);
                    this.toggleButton(this.alignmentButtons[alignments[i]]);
                }
            })
        };

        for (let i = 0; i < ranks.length; i++) {
            this.rankButtons[ranks[i]] = this.scene.add.text(((1 + 2 * i) / 6) * dev_x_anchor, 3.5 * dev_y_anchor, rank_names[i], STYLE_OFF);
            this.rankButtons[ranks[i]].on("pointerdown", () => {
                if (dev_rank != ranks[i]) {
                    this.toggleButton(this.rankButtons[dev_rank]);
                    dev_setRank(ranks[i]);
                    this.toggleButton(this.rankButtons[ranks[i]]);
                }
            })
        };

        this.bamButton = this.scene.add.text(0.5 * dev_x_anchor, 4.5 * dev_y_anchor, "bam", STYLE_OFF);
        this.zapButton = this.scene.add.text(1.5 * dev_x_anchor, 4.5 * dev_y_anchor, "zap", STYLE_OFF);
        this.boinkButton = this.scene.add.text(0.5 * dev_x_anchor, 5.5 * dev_y_anchor, "boink", STYLE_OFF);
        this.zoinkButton = this.scene.add.text(1.5 * dev_x_anchor, 5.5 * dev_y_anchor, "zoink", STYLE_OFF);

        this.bamButton.on("pointerdown", () => {
            if (dev_bamzap == ZAP)
                this.toggleButton(this.zapButton);
            dev_toggleFeature(BAM);
            this.toggleButton(this.bamButton);
        });
        this.zapButton.on("pointerdown", () => {
            if (dev_bamzap == BAM)
                this.toggleButton(this.bamButton);
            dev_toggleFeature(ZAP);
            this.toggleButton(this.zapButton);
        });
        this.boinkButton.on("pointerdown", () => {
            this.chessTiles.unselect();
            this.chessTiles.boardState.initializePieces(dev_alignment, true);
        });
        this.zoinkButton.on("pointerdown", () => {
            this.chessTiles.unselect();
            this.chessTiles.boardState.zapPieces(dev_alignment);
        });

        this.flipButton = this.scene.add.text(0.5 * dev_x_anchor, 7.5 * dev_y_anchor, "Flip!", STYLE_OFF);
        this.stopButton = this.scene.add.text(1.5 * dev_x_anchor, 7.5 * dev_y_anchor, "Stop!", STYLE_OFF);

        this.flipButton.on("pointerdown", () => {
            this.chessTiles.unselect();
            this.chessTiles.toggleTurn(true);
        });
        this.stopButton.on("pointerdown", () => {
            dev_toggleFeature(STOP);
            this.toggleButton(this.stopButton);
        });

        this.configureButton(this.devButton, ...this.getNonDevButtons());

        // Restore dev mode settings
        let toggled_buttons = [];
        if (!DEV_MODE)
            for (let button of this.getNonDevButtons())
                button.visible = !button.visible;
        if (dev_alignment)
            toggled_buttons.push(this.alignmentButtons[dev_alignment]);
        if (dev_rank)
            toggled_buttons.push(this.rankButtons[dev_rank]);
        if (DEV_MODE ? dev_bamzap == ZAP : prev_bamzap == ZAP)
            toggled_buttons.push(this.zapButton);
        if (DEV_MODE ? dev_bamzap == BAM : prev_bamzap == BAM)
            toggled_buttons.push(this.bamButton);
        if (DEV_MODE ? dev_stopOn : prev_stopOn)
            toggled_buttons.push(this.stopButton);
        this.toggleButton(...toggled_buttons);
    }

    // Return list of all dev buttons excluding the dev mode button
    getNonDevButtons() {
        return [...Object.values(this.alignmentButtons), 
                ...Object.values(this.rankButtons), 
                this.bamButton, this.boinkButton, 
                this.zapButton, this.zoinkButton, 
                this.flipButton, this.stopButton];
    }
    
    // Configure default behaviors for all dev buttons
    configureButton(...buttons) {
        for (let button of buttons)
            button
                .setInteractive()
                .setOrigin(0.5)
                .on("pointerover", () => { button.setScale(1.2) }) // Increase the scale (grow the button by 20%)
                
                .on("pointerout", () => { button.setScale(1) }); // Reset to original size
    }

    // Toggle visual on/off of dev buttons (does not change actual dev settings)
    toggleButton(...buttons) {
        for (let button of buttons)
            if (button.style.color == CREAMHEX)
                button.setStyle(STYLE_ON);
            else
                button.setStyle(STYLE_OFF);
    }
}

export { dev_alignment, dev_rank, dev_bamzap, dev_stopOn };
export { BAM, ZAP, STOP };