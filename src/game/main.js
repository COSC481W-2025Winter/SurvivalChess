import { Game as MainGame } from "./scenes/Game";
import { Start as StartScene } from "./scenes/Start";
import { AUTO, Game } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [StartScene],
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;

