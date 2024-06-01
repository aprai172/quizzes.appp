import React from 'react';
import styles from './QuizCard.module.css';

const QuizCard = ({ title, views, date }) => {
  return (
    <div className={styles.card}>
      <span className={styles.title}>{title}</span>
      <span className={styles.views}>{views}</span>
      <span className={styles.date}>Created on: {date}</span>
    </div>
  );
};

export default QuizCard;
