import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizCard.css';  // Import custom CSS for animations and styling
import 'animate.css';  // For animations

const QuizCard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);  // Track if answers are submitted
  const [showModal, setShowModal] = useState(false);  // Track modal visibility

  useEffect(() => {
    axios.get('http://localhost:8080/api/quizzes')  // Adjust URL if needed
      .then((res) => {
        setQuizzes(res.data);
      })
      .catch((err) => console.error('Error fetching quizzes:', err));
  }, []);

  const handleAnswerChange = (questionIndex, selectedAnswerIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = selectedAnswerIndex;
    setUserAnswers(updatedAnswers);
  };

  const submitAnswers = () => {
    const token = localStorage.getItem('jwt'); // Retrieve token from localStorage
    axios.post(
      `http://localhost:8080/api/quizzes/${selectedQuiz.id}/answers`,
      {
        questionAnswers: selectedQuiz.questions.map((q, index) => ({
          questionText: q.questionText,
          selectedAnswerIndex: userAnswers[index] || null,
        })),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((response) => {
      // Adjusting the feedback structure
      const answerFeedback = response.data.map((answer, index) => ({
        isCorrect: answer.isCorrect,
        explanation: selectedQuiz.questions[index].explanation,
        correctAnswer: selectedQuiz.questions[index].options[selectedQuiz.questions[index].correctAnswerIndex],
      }));
      setFeedback(answerFeedback);
      setAnswerSubmitted(true);  // Mark as submitted
      setShowModal(true);  // Show the feedback modal
    }).catch((error) => {
      console.error('Error submitting answers:', error);
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="quiz-container p-4">
      {selectedQuiz ? (
        <div className="quiz-view">
          <h1 className="text-2xl font-bold">{selectedQuiz.quizName}</h1>
          {selectedQuiz.questions.map((question, index) => (
            <div key={index} className="question mb-4">
              <p>{question.questionText}</p>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className={`option ${feedback[index]?.isCorrect === false && userAnswers[index] === optionIndex ? 'incorrect' : ''}`}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionIndex}
                    onChange={() => handleAnswerChange(index, optionIndex)}
                    checked={userAnswers[index] === optionIndex}
                  />
                  <label>{option}</label>
                </div>
              ))}
              {answerSubmitted && feedback[index] && (
                <div className={`feedback ${feedback[index].isCorrect ? 'correct' : 'incorrect'} animate__animated animate__fadeIn`}>
                  <p className={feedback[index].isCorrect ? 'text-green-500' : 'text-red-500'}>
                    {feedback[index].isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className={`explanation ${feedback[index].isCorrect ? 'show' : ''}`}>
                    {feedback[index].explanation}
                  </p>
                  {!feedback[index].isCorrect && (
                    <p className="text-red-500">The correct answer was: {feedback[index].correctAnswer}</p>
                  )}
                </div>
              )}
            </div>
          ))}
          <button onClick={submitAnswers} className="submit-btn bg-blue-500 text-white py-2 px-4 rounded">Submit Answers</button>
          <button onClick={() => setSelectedQuiz(null)} className="go-back-btn bg-gray-500 text-white py-2 px-4 rounded">Go Back</button>
        </div>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="quiz-card border p-4 rounded shadow cursor-pointer"
              onClick={() => setSelectedQuiz(quiz)}
            >
              <h2 className="text-xl font-bold">{quiz.quizName}</h2>
              <p>{quiz.questions.length} Questions</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for feedback */}
      {showModal && (
        <div className="modal animate__animated animate__fadeIn">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4">Quiz Feedback</h2>
            {feedback.map((item, index) => (
              <div key={index} className="feedback-item mb-2">
                <p>{selectedQuiz.questions[index].questionText}</p>
                <p className={item.isCorrect ? 'text-green-500' : 'text-red-500'}>
                  {item.isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p>{item.explanation}</p>
                {!item.isCorrect && (
                  <p className="text-red-500">The correct answer was: {item.correctAnswer}</p>
                )}
              </div>
            ))}
            <button onClick={closeModal} className="close-btn bg-gray-500 text-white py-2 px-4 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
