import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SignUpLoginForm.module.css';
import { useNavigate } from 'react-router-dom';

const SignUpLoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  const validate = () => {
    const errors = {};
    if (isSignUp && username.trim() === "") {
      errors.username = "Invalid name";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.email = "Invalid Email";
    }
    if (password.length < 3) {
      errors.password = "Weak password";
    }
    if (isSignUp && password !== confirmPassword) {
      errors.confirmPassword = "Password doesn't match";
    }
    return errors;
  };

  const signup = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/signup`, {
        username,
        email,
        password,
        confirmPassword
      });
      toast.success('Signup successful!');
      console.log(response.data);
    } catch (error) {
      toast.error('Signup failed!');
      console.error(error);
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/login`, {
        email,
        password
      });
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem('authToken', token);
      toast.success('Login successful!');
      navigate("/dashboard")
      console.log(response.data);
    } catch (error) {
      toast.error('Login failed!');
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      if (isSignUp) {
        signup();
      } else {
        login();
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.card}>
        <h1 className={styles.title}>QUIZZIE</h1>
        <div className={styles.toggleButtons}>
          <button
            onClick={toggleForm}
            className={`${styles.toggleButton} ${isSignUp ? styles.active : ''}`}
          >
            Sign Up
          </button>
          <button
            onClick={toggleForm}
            className={`${styles.toggleButton} ${!isSignUp ? styles.active : ''}`}
          >
            Log In
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder={errors.username ? errors.username : ""}
                  value={username}
                  onChange={handleInputChange(setUserName, 'username')}
                  className={`${styles.input} ${errors.username ? styles.errorInput : ''}`}
                  title={errors.username ? errors.username : ""}
                />
              </div>
              {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
            </div>
          )}
          <div>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                placeholder={errors.email ? errors.email : ""}
                value={email}
                onChange={handleInputChange(setEmail, 'email')}
                className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                title={errors.email ? errors.email : ""}
              />
            </div>
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>
          <div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                placeholder={errors.password ? errors.password : ""}
                value={password}
                onChange={handleInputChange(setPassword, 'password')}
                className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                title={errors.password ? errors.password : ""}
              />
            </div>
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
          </div>
          {isSignUp && (
            <div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder={errors.confirmPassword ? errors.confirmPassword : ""}
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
                  className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
                />
              </div>
              {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
            </div>
          )}
          <button type="submit" className={styles.submitButton}>
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpLoginForm;
