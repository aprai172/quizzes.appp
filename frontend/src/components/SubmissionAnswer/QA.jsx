import React from 'react'
import styles from "./SubmissionQuiz.module.css";
import Victory  from "../../assets/Victory.png"

const QA = ({score,quiz}) => {

  return (
    <div className={styles.quizContainer} style={{justifyContent:"center",fontFamily:"Poppins" , fontSize:"40px" }}>
    <h2 >Congrats Quiz is completed</h2>
    <img src={Victory} alt='Victory' />
    <h2>Your Score is <span style={{color:"#60B84B"}}>0{score}/0{quiz?.questions?.length}</span> </h2>

    </div>
  )
}

export default QA