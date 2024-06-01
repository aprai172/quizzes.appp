import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuizAnalysis.module.css";

function QuizAnalysis() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quizzes", {
          headers: {
            Authorization: localStorage.getItem("authToken"), 
          },
        });
        const data = await response.json();

        setQuizzes(data);

        // Calculate totals
        const totals = data.reduce(
          (acc, quiz) => {
            acc.questionsCreated += quiz.questions.length;
            acc.totalImpressions += quiz.impressions;
            return acc;
          },
          { questionsCreated: 0, totalImpressions: 0 }
        );
        console.log(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAnalysisClick = (quizId, quizType) => {
    localStorage.setItem("quizId", quizId);
    if (quizType === "Q&A") {
      navigate("/q&A-analysis");
    } else {
      navigate("/poll-analysis");
    }
  };

  const handleEditClick = (quizId) => {
    localStorage.setItem("quizId", quizId);
    localStorage.setItem("edit", true);
    navigate("/create-quiz");
  };
  const shareHandler =(quizId)=>{
    localStorage.setItem("quizId", quizId);
    navigate("/share-link");
  }

  const handleDeleteClick = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });

      if (response.ok) {
        // Remove the deleted quiz from the state
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } else {
        console.error("Failed to delete the quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz Analysis</h1>
      <div className={styles.table}>
        <div className={styles.header}>
          <span>S.No</span>
          <span>Quiz Name</span>
          <span>Created on</span>
          <span>Impression</span>
          <span>Actions</span>
          <span>Analysis</span>
        </div>
        {quizzes.map((quiz, index) => (
          <div key={index} className={styles.row}>
            <span>{index + 1}</span>
            <span>{quiz.title}</span>
            <span>{formatDate(quiz.createdAt)}</span>
            <span>{quiz.impressions}</span>
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={() => handleEditClick(quiz._id)}
              ></button>
            <button
                className={styles.deleteButton}
                onClick={() => handleDeleteClick(quiz._id)}
              ></button>
              <button className={styles.shareButton}
              onClick={()=>shareHandler(quiz._id)}></button>
            </div>
            <span
              className={styles.analysisLink}
              onClick={() => handleAnalysisClick(quiz._id, quiz.type)}
            >
              Question Wise Analysis
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizAnalysis;
