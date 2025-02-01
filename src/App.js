import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/Uw5CrX') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => { 
        setQuizData(data.questions || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error); 
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (showResult && score > 60) {
      createBalloonExplosion();
    }
  }, [showResult, score]);

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 10);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < quizData.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  if (loading) {
    return <h2>Loading quiz...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  if (quizData.length === 0) {
    return <h2>No quiz questions available.</h2>;
  }

  return (
    <div className="app">
      <h1>Gamified Quiz Application</h1>

      {showResult ? (
        <div className="result">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} points</p>
          {score > 60 && <p>Great!</p>}
          {score < 40 && <p>Not Good</p>}
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <div className="quiz">
          <h2>Question {currentQuestionIndex + 1} of {quizData.length}</h2>
          <p>{quizData[currentQuestionIndex]?.description || "No question text"}</p>
          <div className="options">
            {quizData[currentQuestionIndex]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option.is_correct)}
                className="option-btn"
              >
                {option.description || "No Answer Text"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function createBalloonExplosion() {
  const container = document.querySelector('.result');
  const usedPositions = new Set(); 

  for (let i = 0; i < 40; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';

      // Generate a unique left position for each balloon
      let leftPosition;
      do {
          leftPosition = Math.floor(Math.random() * 90) + 5; 
      } while (usedPositions.has(leftPosition));

      usedPositions.add(leftPosition);
      balloon.style.left = `${leftPosition}%`;
      balloon.style.backgroundColor = getRandomColor();
      container.appendChild(balloon);

      
      balloon.addEventListener('animationend', () => {
          balloon.remove();
      });
  }
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default App;
