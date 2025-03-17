import { Game as MainGame } from "./scenes/Game.js";
import { Start as StartScene } from "./scenes/Start.js";
import { SettingsScene } from "./scenes/SettingsScene.js";
import { AUTO, Game } from "phaser";

const config = {
    type: AUTO,
    width: 1250,
    height: 768,
    parent: "game-container",
    scene: [StartScene, MainGame, SettingsScene], // ✅ No need to add it dynamically
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;

