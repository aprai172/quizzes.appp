import React, { useState } from "react";
import styles from "./CreateQuizModal.module.css";
import { useNavigate } from "react-router-dom";

const CreateQuizModal = ({ setIsShow, quizData, updateQuizData, isEdit }) => {
  const initialOptions = quizData.type === "Poll"
    ? [{ text: "", imageUrl: "" }, { text: "", imageUrl: "" }, { text: "", imageUrl: "" }, { text: "", imageUrl: "" }]
    : [{ text: "", imageUrl: "" }];

  const [questions, setQuestions] = useState(quizData.questions.length ? quizData.questions : [
    { questionText: "", options: initialOptions, answer: "", timer: "off", optionType: "text" }
  ]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0); // Track the selected question
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", imageUrl: "" });
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value, type) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex][type] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: initialOptions, answer: "", timer: "off", optionType: "text" }]);
    setSelectedQuestionIndex(questions.length); // Set the new question as selected
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleTimerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = value;
    setQuestions(newQuestions);
  };

  const handleOptionTypeChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].optionType = value;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      setError("At least one question is required");
      return;
    }
    if (questions.length > 5) {
      setError("Cannot have more than 5 questions");
      return;
    }
    if (quizData.type === "Q&A" && questions.some(q => !q.answer)) {
      setError("All questions must have an answer for Q&A type quizzes");
      return;
    }
    if (questions.some(q => q.options.length < 2)) {
      setError("Each question must have at least two options");
      return;
    }

    const newQuiz = {
      title: quizData.title,
      type: quizData.type,
      questions
    };

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `http://localhost:5000/api/quizzes/${localStorage.getItem("quizId")}` : 'http://localhost:5000/api/quizzes';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("authToken")
        },
        body: JSON.stringify(newQuiz)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong');
        return;
      }

      const savedQuiz = await response.json();
      localStorage.setItem('quizId', savedQuiz._id); // Store the _id in local storage
      updateQuizData(savedQuiz);
      navigate("/share-link");

    } catch (error) {
      setError('Something went wrong');
    }
  };


  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          {questions.map((_, index) => (
            <span
              key={index}
              className={`${styles.step} ${selectedQuestionIndex === index ? styles.selected : ""}`}
              onClick={() => setSelectedQuestionIndex(index)}
            >
              {index + 1}
            </span>
          ))}
          <button className={styles.addButton} onClick={handleAddQuestion}>+</button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {questions.map((question, index) => (
          selectedQuestionIndex === index && (
            <div key={index} className={styles.question}>
              <label>Question {index + 1}</label>
              <input
                type="text"
                className={styles.input}
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
              <label>Option Type</label>
              <div className={styles.optionType}>
                <label>
                  <input
                    type="radio"
                    value="text"
                    checked={question.optionType === "text"}
                    onChange={() => handleOptionTypeChange(index, "text")}
                  />
                  Text
                </label>
                <label>
                  <input
                    type="radio"
                    value="imageUrl"
                    checked={question.optionType === "imageUrl"}
                    onChange={() => handleOptionTypeChange(index, "imageUrl")}
                  />
                  Image URL
                </label>
                <label>
                  <input
                    type="radio"
                    value="textImageUrl"
                    checked={question.optionType === "textImageUrl"}
                    onChange={() => handleOptionTypeChange(index, "textImageUrl")}
                  />
                  Text & Image URL
                </label>
              </div>
              <label>Options</label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className={styles.option}>
                  {question.optionType === "text" && (
                    <input
                      type="text"
                      className={styles.optionInput}
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value, "text")}
                    />
                  )}
                  {question.optionType === "imageUrl" && (
                    <input
                      type="text"
                      className={styles.optionInput}
                      value={option.imageUrl}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value, "imageUrl")}
                    />
                  )}
                  {question.optionType === "textImageUrl" && (
                    <>
                      <input
                        type="text"
                        className={styles.optionInput}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value, "text")}
                        placeholder="Text"
                      />
                      <input
                        type="text"
                        className={styles.optionInput}
                        value={option.imageUrl}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value, "imageUrl")}
                        placeholder="Image URL"
                      />
                    </>
                  )}
                </div>
              ))}
              <button className={styles.addOption} onClick={() => handleAddOption(index)}>
                Add option
              </button>
              {quizData.type === "Q&A" && (
                <>
                  <label>Answer</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={question.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                </>
              )}
              {quizData.type === "Q&A" && (
                <>
                  <label>Timer</label>
                  <div className={styles.timer}>
                    <button
                      className={question.timer === "off" ? styles.selectedTimer : styles.timerButton}
                      onClick={() => handleTimerChange(index, "off")}
                    >
                      OFF
                    </button>
                    <button
                      className={question.timer === "5" ? styles.selectedTimer : styles.timerButton}
                      onClick={() => handleTimerChange(index, "5")}
                    >
                      5 sec
                    </button>
                    <button
                      className={question.timer === "10" ? styles.selectedTimer : styles.timerButton}
                      onClick={() => handleTimerChange(index, "10")}
                    >
                      10 sec
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        ))}
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={() => setIsShow(false)}>
            Back
          </button>
          <button className={styles.createButton} onClick={handleSave}>
            {isEdit ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreateQuizModal;