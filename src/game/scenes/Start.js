import { Scene } from "phaser";
import { EventBus } from "../EventBus.js";
import { SettingsButton } from "./SettingsButton.js";
import { RulesButton } from "./RulesButton.js";
import {
    START_BACKGROUND_COLOR,
    START_TEXT_ONE,
    START_TEXT_TWO,
} from "../../game-objects/constants.js";

export class Start extends Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("logo", "logo.png");

        WebFont.load({
            google: {
                families: ["Pixelify Sans"],
            },
            active: () => {
                this.fontLoaded = true;
            },
        });
    }

    create() {
        this.cameras.main.setBackgroundColor(START_BACKGROUND_COLOR);

        this.add
            .text(630, 230, "Survival Chess", {
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 130,
                color: START_TEXT_ONE,
                stroke: START_TEXT_TWO,
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(
                630,
                525,
                "Survival Chess is an arcade-style chess game. In this game, you play chess against a computer while trying to survive waves of incoming pieces. Capture as many pieces as you can while avoiding checkmate. Good Luck!",
                {
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontSize: 20,
                    color: START_TEXT_TWO,
                    backgroundColor: START_TEXT_ONE,
                    stroke: START_TEXT_TWO,
                    strokeThickness: 0,
                    align: "center",
                    padding: 15,
                    fixedWidth: 570,
                    wordWrap: { width: 560 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        // 🎮 Start Game Button
        const startButton = this.add.text(550, 370, "Start Game", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fill: START_TEXT_ONE,
            backgroundColor: START_TEXT_TWO,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive();

        startButton.on("pointerdown", () => {
            import("./Game.js").then((module) => {
                if (!this.scene.get("MainGame")) {
                    this.scene.add("MainGame", module.Game);
                }
                this.scene.start("MainGame");
            });
        });

        // ⚙️ Settings Button (FIXED)
        const settingsButton = this.add.text(1100, 70, "Settings", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fill: START_TEXT_ONE,
            backgroundColor: START_TEXT_TWO,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive();

        settingsButton.on("pointerdown", () => {
            import("./SettingsScene.js").then((module) => {
                if (!this.scene.get("SettingsScene")) {
                    this.scene.add("SettingsScene", module.SettingsScene);
                }
                this.scene.launch("SettingsScene"); // ✅ Now launches on click
            });
        });

        // 📜 Rules Button
        const rulesButton = this.add.text(1100, 600, "Rules", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fill: START_TEXT_ONE,
            backgroundColor: START_TEXT_TWO,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setInteractive();

        rulesButton.on("pointerdown", new RulesButton(this).click, this);
        rulesButton.on("pointerover", () => rulesButton.setScale(1.2));
        rulesButton.on("pointerout", () => rulesButton.setScale(1));

        EventBus.emit("current-scene-ready", this);
    }
}
