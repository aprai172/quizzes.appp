import React from 'react';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, title1, value, style }) => {
  return (
    <div className={styles.card} >
      <div className={styles.numberText} style={style}>
        <span className={styles.value}  style={style}>{value}</span>
        <span className={styles.quiz}  style={style}>{title1}</span>
      </div>
      <span className={styles.title} style={style}>{title}</span>
    </div>
  );
};

export default StatsCard;
