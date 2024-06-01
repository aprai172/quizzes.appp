import React from 'react';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <span className={styles.value}>{value}</span>
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default StatsCard;
