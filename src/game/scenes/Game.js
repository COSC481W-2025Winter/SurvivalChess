import { Scene } from "phaser";
import { EventBus } from "../EventBus";

function getTileColor(i,j)
{
    return (i+j)%2==0 ? "0xE5AA70" : "0xC04000";
}

export class Game extends Scene {
    constructor() {
        super("MainGame");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
    }

    create() {
        this.add.image(512, 384, "background");
        this.add.image(512, 350, "star").setDepth(100);
        this.add
            .text(512, 490, "You are currently playing the game", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);



        const tileSize = 75;
        const pieceSize = 50;

        let chessTiles = []; // 8x8 array of chess tiles
        let boardState = []; // 8x8 array of chess pieces

        let xPiece;
        let yPiece;

        let colorGrey = "0x7D7F7C";

        // set up chessTiles & pointer behaviour, as well as interaction with pieces
        for (let i=0;i<8;i++)
        {
            chessTiles.push([]);
            for (let j=0;j<8;j++)
            {
                chessTiles[i][j] = this.add.rectangle(250+tileSize*i, 125+tileSize*j, tileSize, tileSize, getTileColor(i,j));
                chessTiles[i][j].setInteractive();

                // When the pointer hovers over a tile, highlight it grey
                chessTiles[i][j].on("pointerover", () => {
                    chessTiles[i][j].setFillStyle(colorGrey); // Set fill to grey
                });
                // When the pointer moves away from a tile, revert to original color
                chessTiles[i][j].on("pointerout", () => {
                    if (xPiece != i || yPiece != j) // if tile isn't selected
                        chessTiles[i][j].setFillStyle(getTileColor(i,j)); // Reset to original fill
                });
                // When the pointer pushes down a tile, select/move piece & highlight selected tile with grey
                chessTiles[i][j].on("pointerdown", () => {
                    if (boardState[i][j]) // select (pick up) piece
                    {
                        if (xPiece && yPiece) // if previously selected piece exists, revert corresponding tile to original color
                            chessTiles[xPiece][yPiece].setFillStyle(getTileColor(xPiece,yPiece)); 
                        chessTiles[i][j].setFillStyle(colorGrey); // set fill to grey
                        xPiece = i;
                        yPiece = j;
                    }
                    else if (xPiece && yPiece) // move (put down) selected piece
                    {
                        chessTiles[xPiece][yPiece].setFillStyle(getTileColor(xPiece,yPiece));
                        boardState[xPiece][yPiece].setPosition(250+tileSize*i, 125+tileSize*j);
                        boardState[i][j] = boardState[xPiece][yPiece];
                        boardState[xPiece][yPiece] = null;
                        xPiece = null
                        yPiece = null
                    }

                });
            }
        }

        // set up boardState & initialize placeholder player pieces
        for (let i=0;i<8;i++)
        {
            boardState.push([]);
            for (let j=0;j<8;j++)
                if (j==6 || j==7)
                    boardState[i][j] = this.add.ellipse(250+tileSize*i, 125+tileSize*j, pieceSize, pieceSize, "0xFFFFFF");
                else
                    boardState[i][j] = null;
        }
        

        
        const endButton = this.add.text(100, 100, "End Game!", {
            fill: "#0099ff",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        endButton.setPosition(425, 600);
        endButton.setInteractive();
        endButton.on(
            "pointerdown",
            function () {
                import("./Start") // Dynamically import the Game scene
                    .then((module) => {
                        // Only add the scene if it's not already registered
                        if (!this.scene.get("Game")) {
                            this.scene.add("Game", module.Game); // Add the MainGame scene dynamically
                        }

                        // Start the MainGame scene
                        this.scene.start("Game");
                    });
            },
            this
        );

        // When the pointer hovers over the button, scale it up
        endButton.on("pointerover", () => {
            endButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        endButton.on("pointerout", () => {
            endButton.setScale(1); // Reset to original size
        });

        EventBus.emit("current-scene-ready", this);
    }
}

