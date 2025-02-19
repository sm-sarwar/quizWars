import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";

const QuizApp = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetch("/QuizData.json")
      .then((res) => res.json())
      .then((data) => setQuizData(data))
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  useEffect(() => {
    if (quizStarted && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (quizStarted) {
      handleNext();
    }
  }, [timer, quizStarted]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    if (quizData.length > 0 && quizData[currentQuestion]?.correct === answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimer(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
      setTimer(30);
    }
  };

  //  "Play Again" Function
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimer(30);
    setQuizCompleted(false);
    setQuizStarted(false);
  };

  //  Progress Bar Calculation
  const progressPercentage =
    quizData.length > 0 ? ((currentQuestion + 1) / quizData.length) * 100 : 0;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="my-10">
        <button className="px-5" onClick={handleReload}>
          <span className="text-3xl p-4 text-white rounded font-bold bg-gradient-to-r from-teal-500 to-blue-400">
            QuizWars
          </span>
        </button>
      </div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center mt-28 border">
        {!quizStarted ? (
          //  Start Button
          <div className="space-y-3">
            <h2 className="text-2xl font-bold my-4">
              Welcome to the <span className="text-teal-500">QuizWars</span>
            </h2>
            <button
              className="px-3 py-2 bg-gradient-to-r from-teal-500 to-blue-400 text-white rounded-lg text-lg"
              onClick={() => setQuizStarted(true)}
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <>
            {/*  Progress Bar */}
            <div className="w-full bg-gray-300 rounded-lg overflow-hidden mb-4">
              <div
                className="bg-blue-500 h-4 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {quizData.length > 0 && !quizCompleted ? (
              <>
                <h2 className="text-xl font-bold">
                  {quizData[currentQuestion]?.question || "Loading..."}
                </h2>
                {quizData[currentQuestion]?.options ? (
                  <div className="grid grid-cols-2 gap-4 my-4">
                    {Object.entries(quizData[currentQuestion]?.options).map(
                      ([key, option]) => (
                        <button
                          key={key}
                          className={`p-3 border rounded-lg ${
                            selectedAnswer === key
                              ? "bg-green-300"
                              : "bg-gray-200"
                          }`}
                          onClick={() => handleAnswerSelection(key)}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="p-2 border rounded-lg w-full mt-4"
                    placeholder="Type your answer"
                  />
                )}

                {/*  Timer Progress Bar */}
                <div className="w-full bg-gray-300 rounded-lg overflow-hidden mt-4">
                  <div
                    className="bg-teal-500 h-2"
                    style={{ width: `${(timer / 30) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2">Time Left: {timer}s</p>

                <div className="flex justify-between my-4">
                  <button
                    className="p-2 bg-teal-500 text-white rounded-lg flex items-center gap-2"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <FaArrowLeft /> Previous
                  </button>
                  <button
                    className="p-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                    onClick={handleNext}
                  >
                    Next <FaArrowRight />
                  </button>
                </div>
              </>
            ) : quizCompleted ? (
              <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-blue-500 flex items-center justify-center text-2xl font-bold">
                  {score} / {quizData.length}
                </div>
                <div className="text-lg text-gray-600 mt-2">
                  You can do better!
                </div>
                <div className="text-md text-gray-500 mt-4">
                  You have completed the Quiz and achieved {score} Marks!
                </div>
                {/*  "Play Again" Button */}
                <button
                  className="py-2 px-4 mt-6 bg-purple-500 text-white rounded-lg "
                  onClick={handleRestartQuiz}
                >
                  <span className="flex items-center gap-2">
                    <FaArrowRotateLeft /> Play Again
                  </span>
                </button>
              </div>
            ) : (
              <p>Loading Quiz...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
