import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import QuizCard from "./QuizCard";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    quizzesCreated: 0,
    questionsCreated: 0,
    totalImpressions: "0",
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quizzes", {
          headers: {
            Authorization: localStorage.getItem("authToken"), // Assuming you pass the token here
          },
        });
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
  const trendingQuizzes = quizzes.filter((quiz) => quiz?.impressions > 0) ?? [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.stats}>
        <StatsCard title="Quizzes Created" value={stats.quizzesCreated} />
        <StatsCard title="Questions Created" value={stats.questionsCreated} />
        <StatsCard title="Total Impressions" value={stats.totalImpressions} />
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
