import React from "react";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const LogoutHandler = (path) => {
    localStorage.clear();
    navigate(path);
  };

  const handleNavigation = (path) => {
    if (localStorage.getItem("edit")) {
      localStorage.removeItem("edit");
    }
    navigate(path);
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.header}>QUIZZIE</h1>
      <nav>
        <ul>
          <li onClick={() => handleNavigation("/dashboard")}>Dashboard</li>
          <li onClick={() => handleNavigation("/quiz-analysis")}>Analytics</li>
          <li onClick={() => handleNavigation("/Create-quiz")}>Create Quiz</li>
        </ul>
      </nav>
      <button className={styles.logout} onClick={() => LogoutHandler("/")}>LOGOUT</button>
    </div>
  );
};

export default Sidebar;
