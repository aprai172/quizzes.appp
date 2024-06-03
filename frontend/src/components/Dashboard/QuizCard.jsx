import React from 'react';
import styles from './QuizCard.module.css';
import EyeIcon from "../../assets/eye-icon.png";

const QuizCard = ({ title, views, date }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.views}>
          {views}
          <img src={EyeIcon} alt="views icon" className={styles.icon} />
        </span>
      </div>
      <span className={styles.date}>Created on: {date}</span>
    </div>
  );
};

export default QuizCard;
