import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LoginScreen.module.css';

export default function LoginScreen({ onNavigateSignup, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rate Limiting State
  const [lockoutTime, setLockoutTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const savedLockoutInit = sessionStorage.getItem('loginLockoutTime');
    if (savedLockoutInit) {
      const lockoutEnd = parseInt(savedLockoutInit, 10) + 30 * 60 * 1000;
      if (Date.now() < lockoutEnd) {
        setLockoutTime(lockoutEnd);
      } else {
        sessionStorage.removeItem('loginAttempts');
        sessionStorage.removeItem('loginLockoutTime');
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (lockoutTime && Date.now() < lockoutTime) {
      interval = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setLockoutTime(null);
          setTimeRemaining(0);
          sessionStorage.removeItem('loginAttempts');
          sessionStorage.removeItem('loginLockoutTime');
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutTime) return;

    setError('');
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      // Reset attempts on success
      sessionStorage.removeItem('loginAttempts');
      sessionStorage.removeItem('loginLockoutTime');
    } catch (err) {
      const attempts = parseInt(sessionStorage.getItem('loginAttempts') || '0', 10) + 1;
      sessionStorage.setItem('loginAttempts', attempts.toString());
      
      if (attempts >= 5) {
        const lockoutStart = Date.now();
        sessionStorage.setItem('loginLockoutTime', lockoutStart.toString());
        setLockoutTime(lockoutStart + 30 * 60 * 1000);
        setError('Too many attempts. Account temporarily locked.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className={`${styles.card} game-panel`}>
        <h2 className={styles.title}>ACCESS TERMINAL</h2>
        
        <AnimatePresence>
          {error && (
            <motion.div
              className={styles.errorBanner}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="alert"
            >
              <div className={styles.errorContent}>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="email">EMAIL VECTOR</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || !!lockoutTime}
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">ENCRYPTION KEY</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!lockoutTime}
                className={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading || !!lockoutTime}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.forgotPassword}
            onClick={onForgotPassword}
            disabled={isLoading || !!lockoutTime}
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !!lockoutTime}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : lockoutTime ? (
              <span className={styles.lockoutText}>
                LOCKED <span className={styles.pulseTime} aria-live="polite">{formatTime(timeRemaining)}</span>
              </span>
            ) : (
              "AUTHENTICATE"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span>New operative?</span>
          <button type="button" onClick={onNavigateSignup} className={styles.linkButton}>
            Register Here
          </button>
        </div>
      </div>
    </motion.div>
  );
}
