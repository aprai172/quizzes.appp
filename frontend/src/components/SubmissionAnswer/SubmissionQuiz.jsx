import React, { useState, useEffect } from "react";
import styles from "./SubmissionQuiz.module.css";
import { useParams } from "react-router-dom";
import Poll from "./Poll";
import QA from "./QA";

const SubmissionQuiz = () => {
  const { id } = useParams();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${id}`);
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        setQuiz(data);
    
        if (data.questions && data.questions.length > 0) {
          setTimeLeft(parseInt(data.questions[0].timer, 10));
        }
    
        // Update the impression count
        await fetch(`http://localhost:5000/api/quizzes/${id}/impressions`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json'
          }
        });
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
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(parseInt(quiz.questions[currentQuestionIndex + 1].timer, 10));
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
        `http://localhost:5000/api/submissions/${id}/submit`,
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

  if (!quiz) {
    return <div>Loading...</div>;
  }
console.log(quiz.questions.length)
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const renderQuestionComponent = () => {
    if (quiz.type === "Poll") {
      return <Poll  />;
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
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
            </div>
          </div>
          <div className={styles.question}>{currentQuestion.questionText}</div>
          <div className={styles.options}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={styles.optionButton}
                onClick={() => handleOptionSelect(option.text)}
              >
                {(currentQuestion.optionType === "textImageUrl" ||
                  currentQuestion.optionType === "text" ||
                  currentQuestion.optionType === "imageUrl") && (
                  <>
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
                  </>
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
