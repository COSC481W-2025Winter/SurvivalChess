import { Game as MainGame } from "./scenes/Game";
import { Start as StartScene } from "./scenes/Start";
import { AUTO, Game } from "phaser";
import { BACKGROUND_COLOR } from "../game-objects/constants";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: AUTO,
    width: 1250,
    height: 768,
    parent: "game-container",
<<<<<<< HEAD
    backgroundColor: "#000000",
=======
    backgroundColor: BACKGROUND_COLOR,
>>>>>>> f3a7818a105925361879056e6054c588d22984a9
    scene: [StartScene],
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
};

export default StartGame;

