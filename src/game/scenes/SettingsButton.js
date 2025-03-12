import { Scene} from "phaser";
import { EventBus } from "../EventBus";

export class SettingsButton {
    constructor(s) {
        this.scene = s;
    }

    click() {
        import("./settings").then((module) => {
            // Only add the scene if it's not already registered
            if (!this.scene.get("Settings")) {
                this.scene.add("Settings", module.Settings); // Add the scene dynamically
            }

            // Use launch to run scene in parallel to current
            this.scene.launch("Settings");
            this.scene.moveAbove("MainGame", "Settings");
        });
    }
}