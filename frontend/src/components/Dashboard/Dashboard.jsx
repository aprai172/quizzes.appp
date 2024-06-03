import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import QuizCard from "./QuizCard";
import styles from "./Dashboard.module.css";
import { PacmanLoader } from 'react-spinners';


const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    quizzesCreated: 0,
    questionsCreated: 0,
    totalImpressions: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quizzes`, {
          headers: {
            Authorization: localStorage.getItem("authToken"), // Assuming you pass the token here
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setTimeout(()=>{ setLoading(false)},2000)
        const data = await response.json();

        if (Array.isArray(data)) {
          setQuizzes(data);

          // Calculate totals
          const totals = data.reduce(
            (acc, quiz) => {
              acc.questionsCreated += quiz?.questions?.length ;
              acc.totalImpressions += quiz?.impressions || 0;
              return acc;
            },
            { questionsCreated: 0, totalImpressions: 0 }
          );
          

          setStats({
            quizzesCreated: data.length,
            questionsCreated: totals.questionsCreated,
            totalImpressions: totals.totalImpressions,
          });
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  // Filter trending quizzes
  const trendingQuizzes = quizzes.filter((quiz) => quiz?.impressions > 10) ?? [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  
  if (loading) {
    return  ( <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      color: "#8E8E8E",
    }}
  >
   <PacmanLoader color="#333" size={50} loading={loading} />
  </div>
 ) }
  

  return (
    <div className={styles.dashboard}>
   <div className={styles.stats}>
      <StatsCard title1="Quiz" title=" Created" value={stats.quizzesCreated} />
      <StatsCard
        title1="questions"
        title=" Created"
        value={stats.questionsCreated}
        style={{ color: 'blue' }}
      />
      <StatsCard
        title1="Total"
        title=" Impressions"
        value={stats.totalImpressions}
        style={{ color: 'green' }}
      />
    </div>
      <div className={styles.trendingQuizzes}>
        <h3>Trending Quizzes</h3>
        <div className={styles.quizzes}>
          {trendingQuizzes.length > 0 ? (
            trendingQuizzes.map((quiz, index) => (
              <div className={styles.quizItem} key={index}>
                <QuizCard
                  title={quiz.title}
                  views={quiz.impressions}
                  date={formatDate(quiz.createdAt)}
                />
              </div>
            ))
          ) : (
            <p>No trending quizzes available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
