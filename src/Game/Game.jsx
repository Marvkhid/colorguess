import React, { useState, useEffect } from "react";
import "./Game.css";

const Game = () => {
  const colorGroups = {
    red: ["lightcoral", "salmon", "indianred", "crimson", "firebrick", "darkred"],
    blue: ["lightblue", "deepskyblue", "dodgerblue", "royalblue", "mediumblue", "darkblue"],
    green: ["lightgreen", "mediumseagreen", "forestgreen", "limegreen", "seagreen", "darkgreen"],
    yellow: ["lightyellow", "gold", "goldenrod", "yellow", "darkgoldenrod", "khaki"],
    purple: ["plum", "orchid", "mediumorchid", "purple", "darkorchid", "darkmagenta"],
    orange: ["peachpuff", "coral", "tomato", "orangered", "darkorange", "chocolate"],
  };

  const targetColors = Object.keys(colorGroups);
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Click the color that matches the target!");
  const [gameStatus, setGameStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");

  useEffect(() => {
    generateNewGame();
  }, []);

  const generateNewGame = (resetScore = false) => {
    const randomCategory = targetColors[Math.floor(Math.random() * targetColors.length)];
    const randomColor = colorGroups[randomCategory][Math.floor(Math.random() * 6)];
  
    setTargetColor(randomColor);
    setColorOptions(generateColorOptions(randomCategory, randomColor));
    setMessage("Click the color that matches the target!");
    setGameStatus("");
    setStatusClass("");
  
    if (resetScore) {
      setScore(0); // ✅ Only reset when explicitly told to (New Game)
    }
  };
  

  const generateColorOptions = (category, correctColor) => {
    const shuffledColors = [...colorGroups[category]].sort(() => Math.random() - 0.5);
    const correctIndex = Math.floor(Math.random() * 6);
    shuffledColors[correctIndex] = correctColor;
    return shuffledColors;
  };

  const handleGuess = (color) => {
    if (color === targetColor) {
      setScore((prevScore) => prevScore + 1); 
      setGameStatus("✅ Correct! Well done!");
      setStatusClass("correct");
    } else {
      setGameStatus("❌ Wrong! Try again.");
      setStatusClass("wrong");
    }
    setTimeout(generateNewGame, 1000); 
  };
  

  return (
    <div className="game-container">
         <h1 className="hng-title">HNG TASK: STAGE 1</h1>
      <h1 className="game-title">Color Guessing Game</h1>
      <p className="game-description">Try to guess the correct color by clicking on the matching shade!</p>

      <div className="color-box" data-testid="colorBox" style={{ backgroundColor: targetColor }}></div>
      <div className="game-instructions" data-testid="gameInstructions">{message}</div>

      <div className="color-options">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            data-testid="colorOption"
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => handleGuess(color)}
          ></button>
        ))}
      </div>

      <div className={`game-status ${statusClass}`} data-testid="gameStatus">{gameStatus}</div>
      <div className="score" data-testid="score">Score: {score}</div>

      <button className="new-game-button" data-testid="newGameButton" onClick={generateNewGame}>
        New Game
      </button>
    </div>
  );
};

export default Game;
