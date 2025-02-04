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
  const [showOverlay, setShowOverlay] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [hasBeatenHighScore, setHasBeatenHighScore] = useState(false); // New state for tracking high score status

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
      setHasBeatenHighScore(false); // Reset high score status when a new game starts
    }
  };

  const generateColorOptions = (category, correctColor) => {
    const shuffledColors = [...colorGroups[category]].sort(() => Math.random() - 0.5);
    const correctIndex = Math.floor(Math.random() * shuffledColors.length);
    shuffledColors[correctIndex] = correctColor;
    return shuffledColors;
  };

  const handleGuess = (color) => {
    // Prevent interactions if a pop-up is active
    if (showOverlay || showGameOver) return;

    if (color === targetColor) {
      setScore((prevScore) => {
        const newScore = prevScore + 5;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("highScore", newScore);
          setHasBeatenHighScore(true); // Set that high score has been beaten
          setShowOverlay(true); // Show the high score pop-up
        }
        return newScore;
      });
      setGameStatus("✅ Correct! Keep Going!");
      setStatusClass("correct");
    } else {
      setScore((prevScore) => {
        const newScore = Math.max(prevScore - 2, 0);
        if (newScore === 0) {
          setShowGameOver(true); // Show the game over pop-up
        }
        return newScore;
      });
      setGameStatus("❌ Wrong! Try Again.");
      setStatusClass("wrong");

      // Reset the high score celebration if the player gets a wrong answer
      setHasBeatenHighScore(false);
    }

    // Delay next round only if no pop-up is active
    if (!showOverlay && !showGameOver) {
      setTimeout(() => generateNewGame(false), 1000);
    }
  };

  return (
    <div className="game-container">
      {showOverlay && hasBeatenHighScore && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>🎉 GREAT! YOU JUST BEAT THE HIGH SCORE!</h2>
            <p>NOW GO FOR MORE!</p>
            <button onClick={() => setShowOverlay(false)} className="continue-button">
              Continue Game
            </button>
          </div>
        </div>
      )}

      {showGameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>💀 GAME OVER</h2>
            <p>Your score dropped to zero!</p>
            <button onClick={() => generateNewGame(true)} className="continue-button">
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
    </div>
  );
};

export default Game;
