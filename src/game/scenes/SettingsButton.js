import { SettingsScene } from "./SettingsScene.js"; // ✅ Corrected import

export class SettingsButton {
    constructor(scene) {
        this.scene = scene;
    }

    click() {
        const sceneManager = this.scene.scene; // ✅ Correct way to reference Scene Manager

        if (!sceneManager.get("SettingsScene")) {
            sceneManager.add("SettingsScene", SettingsScene); // ✅ Use correct method
        }
        sceneManager.launch("SettingsScene");
    }
}
