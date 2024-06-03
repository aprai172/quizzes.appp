import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  const LogoutHandler = (path) => {
    localStorage.clear();
    navigate(path);
  };

  const handleNavigation = (path) => {
    if (localStorage.getItem("edit")) {
      localStorage.removeItem("edit");
    }
    setSelectedPath(path);
    navigate(path);
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.header}>QUIZZIE</h1>
      <nav>
        <ul>
          <li
            className={selectedPath === "/dashboard" ? styles.selected : ""}
            onClick={() => handleNavigation("/dashboard")}
          >
            Dashboard
          </li>
          <li
            className={selectedPath === "/quiz-analysis" ? styles.selected : ""}
            onClick={() => handleNavigation("/quiz-analysis")}
          >
            Analytics
          </li>
          <li
            className={selectedPath === "/Create-quiz" ? styles.selected : ""}
            onClick={() => handleNavigation("/Create-quiz")}
          >
            Create Quiz
          </li>
        </ul>
      </nav>
     <div className={styles.divider}></div>
      <button className={styles.logout} onClick={() => LogoutHandler("/")}>
        LOGOUT
      </button>
    </div>
  );
};

export default Sidebar;
