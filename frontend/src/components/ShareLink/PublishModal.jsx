import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './PublishModal.module.css';
import { useNavigate } from 'react-router-dom';

const PublishModal = () => {
  const navigate = useNavigate()
  let id  = localStorage.getItem("quizId")
  console.log(id)

  let link = `${import.meta.env.VITE_REACT_APP_FRONTEND_URL}/test/${id}`

  const handleShareClick = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to Clipboard');
    navigate("/quiz-analysis")

  };

  return (
    <div>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2>Congrats your Quiz is Published!</h2>
          <div> <p>your link is here </p>
         </div>
         
          <button className={styles.shareButton} onClick={handleShareClick}>
            Share
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PublishModal;
