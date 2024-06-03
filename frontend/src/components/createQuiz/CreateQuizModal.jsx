import React, { useState } from "react";
import styles from "./CreateQuizModal.module.css";
import { useNavigate } from "react-router-dom";
import Delete from "../../assets/Delete.png";

const CreateQuizModal = ({ setIsShow, quizData, updateQuizData, isEdit }) => {
  const initialOptions = quizData.type === "Poll"
    ? [{ text: "", imageUrl: "" }, { text: "", imageUrl: "" }, { text: "", imageUrl: "" }, { text: "", imageUrl: "" }]
    : [{ text: "", imageUrl: "" }];

  const initialQuestions = quizData.questions && quizData.questions.length
    ? quizData.questions
    : [{ questionText: "", options: initialOptions, answer: "", timer: "off", optionType: "text" }];

  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
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

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", options: initialOptions, answer: "", timer: "off", optionType: "text" }]);
    setSelectedQuestionIndex(questions.length);
  };

  const handleDeleteQuestion = (questionIndex) => {
    const newQuestions = questions.filter((_, index) => index !== questionIndex);
    setQuestions(newQuestions);
    setSelectedQuestionIndex(Math.max(0, questionIndex - 1));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answer = value;
    setQuestions(newQuestions);
  };

  const handleTimerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].timer = value === "off" ? "00" : value;
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
      const url = isEdit ? `http://localhost:5000/api/quizzes/${localStorage.getItem("quizId")}` : `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes`;

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
      localStorage.setItem('quizId', savedQuiz._id);
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
          <div className={styles.addquiz}>
            {questions.map((_, index) => (
              <span
                key={index}
                className={`${styles.step} ${selectedQuestionIndex === index ? styles.selected : ""}`}
                onClick={() => setSelectedQuestionIndex(index)}
              >
                {index + 1}
                {index > 0 && (
                  <span className={styles.cross} onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(index); }}>x</span>
                )}
              </span>
            ))}
            <button className={styles.addButton} onClick={handleAddQuestion}>+</button>
          </div>
          <p>Max 5 questions</p>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {questions.map((question, qIndex) => (
          selectedQuestionIndex === qIndex && (
            <div key={qIndex} className={styles.question}>
              <input
                placeholder={quizData.type === "Q&A" ? "Q&A Question " : "Poll Question "}
                type="text"
                className={styles.input}
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />
              <div className={styles.optionType}>
                <label>Option Type</label>
                <label>
                  <input
                    type="radio"
                    value="text"
                    checked={question.optionType === "text"}
                    onChange={() => handleOptionTypeChange(qIndex, "text")}
                  />
                  Text
                </label>
                <label>
                  <input
                    type="radio"
                    value="imageUrl"
                    checked={question.optionType === "imageUrl"}
                    onChange={() => handleOptionTypeChange(qIndex, "imageUrl")}
                  />
                  Image URL
                </label>
                <label>
                  <input
                    type="radio"
                    value="textImageUrl"
                    checked={question.optionType === "textImageUrl"}
                    onChange={() => handleOptionTypeChange(qIndex, "textImageUrl")}
                  />
                  Text & Image URL
                </label>
              </div>
              <div className={styles.optionsAndTimer}>
                <div className={styles.options}>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className={styles.option}>
                      <input
                        type="radio"
                        name={`option${qIndex}`}
                        className={styles.optionRadio}
                        onChange={() => handleAnswerChange(qIndex, option.text)}
                        checked={question.answer === option.text}
                      />
                      {question.optionType === "text" && (
                        <input
                          type="text"
                          className={styles.optionInput}
                          value={option.text}
                          onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value, "text")}
                        />
                      )}
                      {question.optionType === "imageUrl" && (
                        <input
                          type="text"
                          className={styles.optionInput}
                          value={option.imageUrl}
                          onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value, "imageUrl")}
                        />
                      )}
                      {question.optionType === "textImageUrl" && (
                        <>
                          <input
                            type="text"
                            className={styles.optionInput}
                            value={option.text}
                            onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value, "text")}
                            placeholder="Text"
                          />
                          <input
                            type="text"
                            className={styles.optionInput}
                            value={option.imageUrl}
                            onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value, "imageUrl")}
                            placeholder="Image URL"
                          />
                        </>
                      )}
                      {optionIndex > 1 && (
                        <button
                          className={styles.removeOption}
                          onClick={() => handleRemoveOption(qIndex, optionIndex)}
                        >
                          <img src={Delete} alt="Remove Icon" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className={styles.addOption} onClick={() => handleAddOption(qIndex)}>
                    Add option
                  </button>
                </div>
                {quizData.type === "Q&A" && (
                  <div className={styles.timer}>
                    <label>Timer</label>
                    <button
                      className={question.timer === "off" ? styles.selectedTimer : styles.timerButton}
                      onClick={() => handleTimerChange(qIndex, "00")}
                    >
                      OFF
                    </button>
                    <button
                      className={question.timer === "5" ? styles.selectedTimer : styles.timerButton}
                      onClick={() => handleTimerChange(qIndex, "5")}
                    >
                      5 sec
                    </button>
                    <button
                      className={question.timer === "10" ? styles.selectedTimer : styles.timerButton}
                      onClick={() => handleTimerChange(qIndex, "10")}
                    >
                      10 sec
                    </button>
                  </div>
                )}
              </div>
              {quizData.type === "Q&A" && (
                <>
                  <label>Answer</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={question.answer}
                    onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                  />
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
