import React, { useState, useEffect } from "react";
import styles from "./SubmissionQuiz.module.css";
import { useParams } from "react-router-dom";
import Poll from "./Poll";
import QA from "./QA";
import { PacmanLoader } from "react-spinners";

const SubmissionQuiz = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes/${id}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);

        const data = await response.json();
        setQuiz(data);

        if (data.questions && data.questions.length > 0) {
          const initialTimeLeft = parseInt(data.questions[0].timer, 10);
          if (!isNaN(initialTimeLeft)) {
            setTimeLeft(initialTimeLeft);
          }
        }

        // Update the impression count
        await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/quizzes/${id}/impressions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz?.questions?.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextTimeLeft = parseInt(quiz.questions[nextIndex].timer, 10);
      if (!isNaN(nextTimeLeft)) {
        setTimeLeft(nextTimeLeft);
      } else {
        setTimeLeft(0);
      }
    }
  };

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      question: quiz.questions[currentQuestionIndex].questionText,
      selectedOption: option,
    };
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/submissions/${id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setScore(data.score);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          color: "#8E8E8E",
        }}
      >
        <PacmanLoader color="#333" size={50} loading={loading} />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const renderQuestionComponent = () => {
    if (quiz.type === "Poll") {
      return <Poll />;
    }
    return <QA score={score} quiz={quiz} />;
  };

  return (
    <div className={styles.App}>
      {!isSubmitted ? (
        <div className={styles.quizContainer}>
          <div className={styles.header}>
            <div>
              {currentQuestionIndex + 1}/{quiz.questions.length}
            </div>
            <div className={styles.timer}>
              {quiz.type === "Q&A"
                ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}s`
                : ""}
            </div>
          </div>
          <div className={styles.question}>{currentQuestion.questionText}</div>
          <div className={styles.options}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={styles.optionButton}
                onClick={() => handleOptionSelect(option.imageUrl || option.text)}
              >
                {currentQuestion.optionType === "textImageUrl" && (
                  <>
                    <img
                      src={option.imageUrl}
                      alt={`Option ${index + 1}`}
                      className={styles.optionImage}
                    />
                    <div>{option.text}</div>
                  </>
                )}
                {currentQuestion.optionType === "text" && (
                  <div>{option.text}</div>
                )}
                {currentQuestion.optionType === "imageUrl" && (
                  <img
                    src={option.imageUrl}
                    alt={`Option ${index + 1}`}
                    className={styles.optionImage}
                  />
                )}
              </button>
            ))}
          </div>
          {currentQuestionIndex < quiz?.questions?.length - 1 ? (
            <button className={styles.nextButton} onClick={handleNextQuestion}>
              NEXT
            </button>
          ) : (
            <button className={styles.nextButton} onClick={handleSubmit}>
              SUBMIT
            </button>
          )}
        </div>
      ) : (
        renderQuestionComponent()
      )}
    </div>
  );
};

export default SubmissionQuiz;
