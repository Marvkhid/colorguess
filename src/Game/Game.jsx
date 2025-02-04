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
    pink: ["lightpink", "hotpink", "deeppink", "mediumvioletred", "palevioletred", "crimson"],
  };

  const targetColors = Object.keys(colorGroups);
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem("highScore") || 0);
  const [message, setMessage] = useState("Click the color that matches the target!");
  const [gameStatus, setGameStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);

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
      setScore(0);
      setShowGameOver(false);
    }
  };

  const generateColorOptions = (category, correctColor) => {
    const shuffledColors = [...colorGroups[category]].sort(() => Math.random() - 0.5);
    const correctIndex = Math.floor(Math.random() * shuffledColors.length);
    shuffledColors[correctIndex] = correctColor;
    return shuffledColors;
  };

  const handleGuess = (color) => {
    if (showGameOver) return; // Prevent guess handling if game over pop-up is visible

    if (color === targetColor) {
      setScore((prevScore) => prevScore + 5);
      setGameStatus("✅ Correct! Keep Going!");
      setStatusClass("correct");
    } else {
      setScore((prevScore) => {
        const newScore = Math.max(prevScore - 2, 0);
        if (newScore === 0) {
          setShowGameOver(true); // Show game over pop-up when score hits 0
        }
        return newScore;
      });
      setGameStatus("❌ Wrong! Try Again.");
      setStatusClass("wrong");
    }

    // Delay next round only if no pop-up is active
    if (!showGameOver) {
      setTimeout(() => generateNewGame(false), 1000);
    }
  };

  const resetHighScore = () => {
    setHighScore(0);
    localStorage.setItem("highScore", 0);
  };

  return (
    <div className="game-container">
      {showGameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>💀 GAME OVER</h2>
            <p>Your score dropped to zero!</p>
            <button
              onClick={() => {
                generateNewGame(true); // Reset the game on game over
                setShowGameOver(false);
              }}
              className="continue-button"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      <div className="score-container">
        <div className="high-score">High Score: {highScore}</div>
        <div className="current-score">Score: {score}</div>
      </div>

      <h1 className="game-title">Color Guessing Game</h1>
      <p className="game-description">Try to guess the correct color!</p>

      <div className="color-box" style={{ backgroundColor: targetColor }}></div>
      <div className="game-instructions">{message}</div>

      <div className="color-options">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => handleGuess(color)}
          ></button>
        ))}
      </div>

      <div className={`game-status ${statusClass}`}>{gameStatus}</div>

      <button className="new-game-button" onClick={() => generateNewGame(true)}>
        New Game
      </button>

      <button className="reset-high-score-button" onClick={resetHighScore}>
        Reset High Score
      </button>
    </div>
  );
};

export default Game;
