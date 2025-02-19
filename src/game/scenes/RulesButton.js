import { Scene} from "phaser";
import { EventBus } from "../EventBus";

export class RulesButton {
    constructor(s) {
        this.scene = s;
    }

    click() {
        import("./RulesOverlay").then((module) => {
            // Only add the scene if it's not already registered
            if (!this.scene.get("Rules")) {
                this.scene.add("Rules", module.RulesOverlay); // Add the scene dynamically
            }

            // Use launch to run scene in parallel to current
            this.scene.launch("Rules");
        });
    }

    // This was an attempt at DRY, but it seems to not work. Leaving in
    // commented as a possible thread to look into later
    /*
    addButton(scene) {
        const rulesButton = scene.add.text(100, 100, "See Rules", {
            fill: CREAMHEX, // Using CREAMHEX here
            backgroundColor: MAHOGANYHEX, // Using MAHOGANYHEX here
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        rulesButton.setPosition(870, 650);
        rulesButton.setInteractive();

        rulesButton.on(
            "pointerdown",
            click(),
            scene
        );

        return rulesButton;
    }
    */
}

