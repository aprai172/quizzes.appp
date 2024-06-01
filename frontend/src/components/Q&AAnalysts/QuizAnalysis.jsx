import React, { useEffect, useState } from "react";
import styles from "./QuizAnalysis.module.css";

const QuizAnalysis = () => {
  const [data, setData] = useState({});
  const quizId = localStorage.getItem("quizId"); // Retrieve the quiz ID from local storage
  const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

  useEffect(() => {
    const fetchData = async () => {
      if (!quizId) {
        console.error("Quiz ID not found in local storage");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/submissions/qa/${quizId}`, {
          headers: {
            "Authorization": token, // Include the token in the request headers
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        
        if (result.quizStats && result.quizStats[quizId]) {
          const quizData = result.quizStats[quizId];
          setData(quizData);
          console.log(quizData);
        } else {
          console.error("Quiz data not found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [quizId, token]);

  return (
    <div className={styles.quizAnalysis}>
      <h1 className={styles.title}>{data.title} Question Analysis</h1>
      <div className={styles.info}>
        <p>Created on: 04 Sep, 2023</p>
        <p>Impressions: 667</p>
      </div>
      {data?.questions?.map((question, index) => (
        <div key={index} className={styles.questionStatsContainer}>
          <div className={styles.questionStats}>
            <div className={styles.header}>
              <h2 className={styles.questionTitle}>{`Q.${index + 1} ${question.questionText}`}</h2>
            </div>
            <div className={styles.statsContainer}>
              <div className={styles.statBox}>
                <p className={styles.statNumber}>{question.totalAttendees}</p>
                <p>people Attempted the question</p>
              </div>
              <div className={styles.statBox}>
                <p className={styles.statNumber}>{question.totalCorrectAnswers}</p>
                <p>people Answered Correctly</p>
              </div>
              <div className={styles.statBox}>
                <p className={styles.statNumber}>{question.totalWrongAnswers}</p>
                <p>people Answered Incorrectly</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizAnalysis;
