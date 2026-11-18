import useQuizProctoring from "../hooks/useQuizProctoring";
import React, { useState, useEffect } from "react";
import "./styles/QuizPage.css";
import Navbar from "../components/Navbar";
import API_BASE from "../config";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState({});
  const [difficulty, setDifficulty] = useState("All");
// Stores submitted answers by question index
const [answers, setAnswers] = useState({});
const [quizCompleted, setQuizCompleted] = useState(false);
const [submitting, setSubmitting] = useState(false);

// Proctoring states
const [proctoringEnded, setProctoringEnded] = useState(false);

// End quiz after maximum violations
const handleMaximumViolations = () => {
  setProctoringEnded(true);
  setQuizCompleted(true);
};

const {
  isStarted,
  isFullscreen,
  violationCount,
  warning,
  setWarning,
  startProctoredQuiz,
  stopProctoring
} = useQuizProctoring({
  maxViolations: 3,
  onMaxViolations: handleMaximumViolations
});

const userId = localStorage.getItem("userId");

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/api/mcq/meta/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch questions when filters change
  useEffect(() => {
    if (Object.keys(categories).length === 0) return;

    setLoading(true);

    let endpoint = `${API_BASE}/api/mcq/all`;

    if (category !== "All") {
      endpoint = `${API_BASE}/api/mcq/category/${category}`;
    }

    if (difficulty !== "All") {
      endpoint = `${API_BASE}/api/mcq/difficulty/${difficulty}`;
    }

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setQuestions(data.data);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setAnswers({});
          setQuizCompleted(false);
        }
      })
      .catch((err) => console.error("Error fetching questions:", err))
      .finally(() => setLoading(false));
  }, [category, difficulty, categories]);

  // Handle answer selection
  const handleAnswerSelect = (index) => {
    if (answers[currentQuestionIndex] || submitting) return;

    setSelectedAnswer(index);
  };

  // Submit one answer without revealing correctness
  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) {
      alert("Please select an answer");
      return;
    }

    if (answers[currentQuestionIndex]) return;

    try {
      setSubmitting(true);

      const currentQuestion = questions[currentQuestionIndex];
      const questionId = currentQuestion.questionId;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/api/mcq/submit-answer/${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedAnswerIndex: selectedAnswer,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to submit answer");
        return;
      }

      // Save answer for final review
      setAnswers((previous) => ({
        ...previous,
        [currentQuestionIndex]: {
          selectedAnswerIndex: selectedAnswer,
          isCorrect: data.isCorrect,
          userSelected: currentQuestion.options[selectedAnswer]?.text,
          correctAnswer:
            currentQuestion.options[currentQuestion.correctAnswerIndex]?.text,
          explanation: currentQuestion.explanation,
        },
      }));
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Error submitting answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (!answers[currentQuestionIndex]) {
      alert("Please submit your answer first.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;

      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(
        answers[nextIndex]?.selectedAnswerIndex ?? null
      );
    }
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const previousIndex = currentQuestionIndex - 1;

      setCurrentQuestionIndex(previousIndex);
      setSelectedAnswer(
        answers[previousIndex]?.selectedAnswerIndex ?? null
      );
    }
  };

// Finish quiz and show all answers
const handleFinishQuiz = async () => {
  if (Object.keys(answers).length !== questions.length) {
    alert("Please answer all questions before finishing the quiz.");
    return;
  }

  await stopProctoring();

  setQuizCompleted(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  // Reset quiz
const resetQuiz = async () => {
  await stopProctoring();

  setProctoringEnded(false);
  setCurrentQuestionIndex(0);
  setSelectedAnswer(null);
  setAnswers({});
  setQuizCompleted(false);
  setCategory("All");
  setDifficulty("All");
};

  // Loading screen
  if (loading) {
    return (
      <div className="quiz-container loading">
        Loading questions...
      </div>
    );
  }
  // Proctored quiz start screen
if (!isStarted && !quizCompleted) {
  return (
    <>
      <Navbar />

      <div className="proctor-start-screen">
        <div className="proctor-card">
          <h2>Proctored Quiz</h2>

          <p>
            This quiz monitors full-screen mode and tab switching.
            Please keep the quiz window active until you finish.
          </p>

          <ul>
            <li>Stay in full-screen mode.</li>
            <li>Do not switch tabs or minimize the browser.</li>
            <li>Three detected violations will end the quiz.</li>
          </ul>

          {warning && (
            <p className="proctor-warning">{warning}</p>
          )}

          <button
            className="btn btn-primary"
            onClick={startProctoredQuiz}
          >
            Start Proctored Quiz
          </button>
        </div>
      </div>
    </>
  );
}

  // No questions
  if (!questions.length) {
    return (
      <>
        <Navbar />
        <div className="quiz-container">
          <div className="no-questions">
            <p>No questions available for the selected filters.</p>
            <button
              onClick={() => setCategory("All")}
              className="btn btn-primary"
            >
              View All Questions
            </button>
          </div>
        </div>
      </>
    );
  }

  // Calculate statistics
  const attempted = Object.keys(answers).length;

  const correct = Object.values(answers).filter(
    (answer) => answer.isCorrect
  ).length;

  const incorrect = attempted - correct;

  const accuracy =
    attempted > 0
      ? ((correct / attempted) * 100).toFixed(2)
      : "0.00";

  const progressPercentage =
    (attempted / questions.length) * 100;

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  // Final result screen
  if (quizCompleted) {
    return (
      <>
        <Navbar />

        <div className="quiz-container">
          <div className="quiz-header">
            <h2 className="page-title">Quiz Results</h2>
            {proctoringEnded && (
  <div className="proctor-warning">
    <h3>Quiz Terminated</h3>
    <p>
      Your quiz was ended because you exceeded the allowed
      number of proctoring violations.
    </p>
    <p>Recorded violations: {violationCount}</p>
  </div>
)}
            <div className="quiz-stats">
              <div className="stat">
                <span className="stat-label">Correct</span>
                <span className="stat-value correct">{correct}</span>
              </div>

              <div className="stat">
                <span className="stat-label">Incorrect</span>
                <span className="stat-value incorrect">{incorrect}</span>
              </div>

              <div className="stat">
                <span className="stat-label">Attempted</span>
                <span className="stat-value">{attempted}</span>
              </div>

              <div className="stat">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
            </div>
          </div>

          <div className="final-result-card">
            <h2>
  {proctoringEnded ? "⚠️ Quiz Terminated" : "🎉 Quiz Completed!"}
</h2>

{proctoringEnded && (
  <p>
    Your quiz was terminated because you exceeded the maximum
    allowed full-screen violations.
  </p>
)}

            <h1>{accuracy}%</h1>
            <p>Overall Accuracy</p>
          </div>

          <h2 className="review-heading">Answer Review</h2>

          {questions.map((question, questionIndex) => {
  const answer = answers[questionIndex];

  return (
    <div
      className="question-card review-card"
      key={question.questionId || questionIndex}
    >
      <h3>
        Question {questionIndex + 1}: {question.question}
      </h3>

      <div className="options-container">
        {question.options.map((option, optionIndex) => {
          const isCorrect =
            optionIndex === question.correctAnswerIndex;

          const isSelected =
            answer != null &&
            optionIndex === answer.selectedAnswerIndex;

          let optionClass = "option";

          if (isCorrect) {
            optionClass += " correct";
          } else if (isSelected) {
            optionClass += " incorrect";
          }

          return (
            <div key={optionIndex} className={optionClass}>
              <span className="option-letter">
                {String.fromCharCode(65 + optionIndex)}
              </span>

              <span className="option-text">
                {typeof option === "string" ? option : option.text}
              </span>

              {isCorrect && <span>✓</span>}
              {isSelected && !isCorrect && <span>✗</span>}
            </div>
          );
        })}
      </div>

      {!answer ? (
        <p className="answer-saved-message">
          Not attempted — quiz terminated before this question was answered.
        </p>
      ) : (
        <>
          <p>
            {answer.isCorrect
              ? "✓ Your answer is correct"
              : "✗ Your answer is incorrect"}
          </p>

          {question.explanation && (
            <div className="explanation">
              <h4>Explanation:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
})}

          <button
            onClick={resetQuiz}
            className="btn btn-primary"
          >
            Try Another Quiz
          </button>
        </div>
      </>
    );
  }

  const isLastQuestion =
    currentQuestionIndex === questions.length - 1;

  const isCurrentQuestionAnswered = Boolean(currentAnswer);

  return (
    <>
      <Navbar />

      <div className="quiz-container">

  {/* Proctoring status */}
  <div className="proctor-status">
    <span>
      {isFullscreen
        ? "🟢 Full-screen active"
        : "🔴 Full-screen inactive"}
    </span>

    <span>
      Violations: {violationCount}/3
    </span>
  </div>

  {warning && (
    <div className="proctor-warning">
      <p>{warning}</p>
      <button onClick={() => setWarning("")}>
        Dismiss
      </button>
    </div>
  )}
        <div className="quiz-header">
          <h2 className="page-title">MCQ Quiz</h2>

          <div className="quiz-stats">
            <div className="stat">
              <span className="stat-label">Correct</span>
              <span className="stat-value correct">{correct}</span>
            </div>

            <div className="stat">
              <span className="stat-label">Incorrect</span>
              <span className="stat-value incorrect">{incorrect}</span>
            </div>

            <div className="stat">
              <span className="stat-label">Done</span>
              <span className="stat-value">{attempted}</span>
            </div>

            <div className="stat">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="quiz-filters">
          <div className="filter-group">
            <label>Category:</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>

              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty:</label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <button
            onClick={resetQuiz}
            className="btn btn-secondary"
          >
            Reset Quiz
          </button>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
            {" | "}
            {attempted} submitted
          </p>
        </div>

        <div className="question-card">
          <div
            className={`difficulty-badge ${
              currentQuestion.difficulty.toLowerCase()
            }`}
          >
            {currentQuestion.difficulty}
          </div>

          <div className="question-meta">
            <span className="category">{currentQuestion.category}</span>
            <span className="topic">{currentQuestion.topic}</span>
          </div>

          <h2 className="question-text">
            {currentQuestion.question}
          </h2>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              let optionClass = "option";

              if (isSelected) {
                optionClass += " selected";
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isCurrentQuestionAnswered || submitting}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="option-text">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {isCurrentQuestionAnswered && (
            <div className="answer-saved-message">
              ✓ Answer submitted successfully. Correct answers will be
              revealed after the quiz.
            </div>
          )}
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
            className="btn btn-outline"
          >
            ← Previous
          </button>

          {!isCurrentQuestionAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? "Submitting..." : "Submit Answer"}
            </button>
          ) : isLastQuestion ? (
            <button
              onClick={handleFinishQuiz}
              disabled={attempted !== questions.length}
              className="btn btn-primary"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn btn-primary"
            >
              Next Question →
            </button>
          )}
        </div>

        <div className="quiz-tips">
          <p>
            💡 Your answers and explanations will be revealed after
            completing the quiz.
          </p>
        </div>
      </div>
    </>
  );
};

export default QuizPage;
