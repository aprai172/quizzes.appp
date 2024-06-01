import React, { useEffect, useState } from "react";
import styles from "./PollAnalysts.module.css";

const PollAnalysts = () => {
  const [data, setData] = useState(null); // Initialize with null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
        const quizId = localStorage.getItem("quizId"); // Retrieve the quizId from localStorage

        if (!token) {
          console.error("No auth token found in localStorage");
          return;
        }

        if (!quizId) {
          console.error("No quiz ID found in localStorage");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/submissions/poll/${quizId}`,
          {
            headers: {
              Authorization: token, // Set the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const quizStats = result.quizStats;

        if (quizStats && Object.keys(quizStats).length > 0) {
          const quizData = quizStats[quizId]; // Access the quiz data using the quizId
          setData(quizData);
          console.log(quizData);
        } else {
          console.error("No quizStats found in the response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const parseOptionText = (option) => {
    const match = option.match(/\{ text: '([^']+)' \}/);
    return match ? match[1] : option;
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.quizAnalysis}>
      <h1 className={styles.title}>{data.title} Question Analysis</h1>
      <div className={styles.info}>
        <p>{data.createdAt}</p>
        <p>Impressions: 667</p>
      </div>
      {data.questions.map((question, index) => (
        <div key={index} className={styles.questionStatsContainer}>
          <div className={styles.questionStats}>
            <div className={styles.header}>
              <h2 className={styles.questionTitle}>{`Q.${index + 1} ${
                question.questionText
              }`}</h2>
            </div>
            <div className={styles.statsContainer}>
              {Object.entries(question.optionsSelected).map(
                ([option, count], idx) => (
                  <div key={idx} className={styles.statBox}>
                    <p className={styles.statNumber}>{count}</p>
                    <p>{`option ${idx + 1}`}</p> 
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PollAnalysts;
