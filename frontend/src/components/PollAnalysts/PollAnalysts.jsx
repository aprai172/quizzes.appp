import React, { useEffect, useState } from "react";
import styles from "./PollAnalysts.module.css";
import { PacmanLoader } from "react-spinners";
const PollAnalysts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const quizId = localStorage.getItem("quizId");
  const token = localStorage.getItem("authToken"); // Initialize with null

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) {
        console.error("Quiz ID not found in local storage");
        setError("Quiz ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/submissions/poll/${quizId}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);

        const result = await response.json();

        if (result.quizStats && result.quizStats[quizId]) {
          const quizData = result.quizStats[quizId];
          setData((prevData) => ({ ...prevData, ...quizData }));
        } else {
          throw new Error("Quiz data not found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes/${quizId}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);

        const quizDetails = await response.json();
        setData((prevData) => ({ ...prevData, ...quizDetails }));
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        setError(error.message);
      }
    };

    fetchQuizData();
    fetchQuizDetails();
  }, [quizId, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
  return (
    <div className={styles.quizAnalysis}>
      <h1 className={styles.title}>{data.title} Question Analysis</h1>
      <div className={styles.info}>
      <p>Created on: {formatDate(data?.createdAt)}</p>
        <p>Impressions: {data?.impressions}</p>
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
