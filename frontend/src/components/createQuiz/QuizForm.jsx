import React, { useState, useEffect } from "react";
import styles from "./QuizForm.module.css";
import { useNavigate } from "react-router-dom";
import CreateQuizModal from "./CreateQuizModal";

const QuizForm = () => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    type: "",
    questions: [],
  });
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const editFlag = localStorage.getItem("edit");
    const quizId = localStorage.getItem("quizId");
    if (editFlag && quizId) {
      setIsEdit(true);
      fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes/${quizId}`, {
        headers: {
          'Authorization': localStorage.getItem("authToken") // Assuming you pass the token here
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setQuizData(data);
        })
        .catch((error) => {
          console.error("Error fetching quiz data:", error);
        });
    }
  }, []);

  const handleQuizTypeSelection = (type) => {
    setQuizData({ ...quizData, type });
  };

  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!quizData.title) {
      setError("Quiz title is required");
      return false;
    }

    if (!quizData.type) {
      setError("Quiz type is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setIsShow(true);
    }
  };

  const updateQuizData = (newData) => {
    setQuizData({ ...quizData, ...newData });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {error && <p className={styles.error}>{error}</p>}
        <label>Quiz Title</label>
        <input
          type="text"
          name="title"
          className={styles.input}
          value={quizData.title}
          onChange={handleChange}
        />

        <label>Quiz Type</label>
        <div className={styles.quizType}>
          <button
            className={`${styles.button} ${
              quizData.type === "Q&A" ? styles.selected : ""
            }`}
            onClick={() => handleQuizTypeSelection("Q&A")}
          >
            Q&A
          </button>
          <button
            className={`${styles.button} ${
              quizData.type === "Poll" ? styles.selected : ""
            }`}
            onClick={() => handleQuizTypeSelection("Poll")}
          >
            Poll
          </button>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
          <button className={styles.continueButton} onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
      {isShow && (
        <CreateQuizModal
          setIsShow={setIsShow}
          quizData={quizData}
          updateQuizData={updateQuizData}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default QuizForm;
