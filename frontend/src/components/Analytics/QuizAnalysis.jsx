import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuizAnalysis.module.css";
import Delete from "./Delete";
import { PacmanLoader } from "react-spinners";

function QuizAnalysis() {
  const [quizzes, setQuizzes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes`, {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
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

  const shareHandler = (quizId) => {
    localStorage.setItem("quizId", quizId);
    navigate("/share-link");
  };

  const handleDeleteClick = (quizId) => {
    setShowDeleteModal(true);
    setQuizToDelete(quizId);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes/${quizToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });

      if (response.ok) {
        // Remove the deleted quiz from the state
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete));
      } else {
        console.error("Failed to delete the quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setShowDeleteModal(false);
      setQuizToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
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
      {showDeleteModal && (
        <Delete confirmDelete={confirmDelete} cancelDelete={cancelDelete} />
      )}
    </div>
  );
}

export default QuizAnalysis;
