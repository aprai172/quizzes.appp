import React from 'react';
import styles from './Delete.module.css';

const Delete = ({ confirmDelete, cancelDelete }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <h2 className={styles.headerText}>Are you sure you want to delete?</h2>
        <div className={styles.btnsWrp}>
          <button className={styles.delModalBtn} onClick={confirmDelete}>
            Delete
          </button>
          <button className={styles.cancelModalBtn} onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
