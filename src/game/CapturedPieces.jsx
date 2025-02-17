import React, { useState } from 'react';

// I am unfamiliar with Reactjs, so I requested help from StackOverflow and ChatGPT in creating the structures for this file
const CapturedPieces = () => {
    // Array of image objects with IDs, src, and loaded flag
        const images = [
            { id: 1, src: "assets/kingB.png", loaded: false },
            { id: 2, src: "asset/queenB.png", loaded: false },
            { id: 3, src: "asset/bishopB.png", loaded: false },
            { id: 4, src: "asset/knightB.png", loaded: false },
            { id: 5, src: "asset/rookB.png", loaded: false },
            { id: 6, src: "asset/pawnB.png", loaded: false },
    
            { id: 7, src: "assets/kingW.png", loaded: false },
            { id: 8, src: "asset/queenW.png", loaded: false },
            { id: 9, src: "asset/bishopW.png", loaded: false },
            { id: 10, src: "asset/knightW.png", loaded: false },
            { id: 11, src: "asset/rookW.png", loaded: false },
            { id: 12, src: "asset/pawnW.png", loaded: false },
    
        ];
    
        // State to track each image's loading condition
        const [imageConditions, setImageConditions] = useState(images);
    
        // Function to load a specific image
        const loadImage = (imageId) => {
            setImageConditions(prevConditions =>
                prevConditions.map(image =>
                    image.id === imageId ? { ...image, loaded: true } : image
                )
            );
        };
    
        return (
            <div
              style={{
                width: '200px',
                height: '200px',
                overflow: 'hidden',
                border: '2px solid black',
                padding: '10px',
                position: 'relative',
              }}
            >
              {/* Render each image and load it conditionally */}
              {imageConditions.map((image) => {
                return (
                  <div key={image.id} style={{ marginBottom: '10px' }}>
        
                    {/* Conditionally render the image inside the window */}
                    {image.loaded ? (
                      <img
                        src={image.src}
                        alt={`Dynamic ${image.id}`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          marginTop: '10px',
                        }}
                      />
                    ) : (
                      <p>Image {image.id} not loaded yet.</p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        };
export { CapturedPieces };