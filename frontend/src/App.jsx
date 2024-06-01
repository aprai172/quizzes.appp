import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/sideBar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import QuizAnalysis from './components/Analytics/QuizAnalysis';
import QandAAnalystic from './components/Q&AAnalysts/QuizAnalysis';
import PollAnalysts from './components/PollAnalysts/PollAnalysts';
import SignupLogin from "./components/Signup&login/SignUpLoginForm";
import QuizForm from './components/createQuiz/QuizForm';
import PublishModal from "./components/ShareLink/PublishModal"
import SubmissionQuiz from './components/SubmissionAnswer/SubmissionQuiz';
import styles from './App.module.css';

const AppContent = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== '/' && !location.pathname.startsWith('/test');
  const appClass = showSidebar ? styles.app : styles.appNoSidebar;

  return (
    <div className={appClass}>
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<SignupLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz-analysis" element={<QuizAnalysis />} />
        <Route path="/q&A-analysis" element={<QandAAnalystic />} />
        <Route path="/poll-analysis" element={<PollAnalysts />} />
        <Route path="/Create-quiz" element={<QuizForm />} />
        <Route path="/share-link" element={<PublishModal />} />
        <Route path="/test/:id" element={<SubmissionQuiz />} />

      </Routes>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
