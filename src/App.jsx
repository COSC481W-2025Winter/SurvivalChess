import { useRef } from "react";

import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const startGame = () => {
        const startScene = phaserRef.current.scene;
        if (startScene) {
            //logic for scene change
        }
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <div></div>
            </div>
        </div>
    );
}

export default App;

