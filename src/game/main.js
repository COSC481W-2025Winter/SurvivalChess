import { Game as MainGame } from "./scenes/Game";
import { Start as StartScene } from "./scenes/Start";
import Phaser, { AUTO,Game } from "phaser";
import { ONYX } from "../game-objects/constants";
import { GameOver } from "./scenes/GameOver";



//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: ONYX,
    scene: [StartScene, MainGame, GameOver],
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;

