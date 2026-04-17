import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SignupScreen.module.css';

export default function SignupScreen({ onNavigateLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tosChecked, setTosChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Strength calculation
  const [strengthScore, setStrengthScore] = useState(0);

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    setStrengthScore(password.length === 0 ? 0 : score);
  }, [password]);

  const getStrengthLabel = () => {
    if (strengthScore === 0) return '';
    if (strengthScore === 1) return 'Weak';
    if (strengthScore === 2) return 'Fair';
    if (strengthScore === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strengthScore === 0) return '#4b5563'; // gray
    if (strengthScore === 1) return '#ef4444'; // red
    if (strengthScore === 2) return '#f97316'; // orange
    if (strengthScore === 3) return '#84cc16'; // yellow-green
    return '#22c55e'; // green
  };

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const validateEmail = (e) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (strengthScore < 3) {
      setError('Password is not strong enough.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!tosChecked) {
      setError('You must accept the Terms of Service.');
      return;
    }

    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      
      await updateProfile(cred.user, { displayName: `${firstName} ${lastName}` });
      await sendEmailVerification(cred.user, { url: window.location.origin });
      
      await setDoc(doc(db, "users", cred.user.uid), {
        firstName, 
        lastName, 
        email: trimmedEmail,
        emailVerified: false,
        createdAt: serverTimestamp(),
        role: "student",
        scores: {},
      });

      setIsSuccess(true);
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak.');
          break;
        default:
          setError('Sign up failed. Please try again.');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className={`${styles.card} ${styles.successCard} game-panel`}>
          <div className={styles.checkmarkWrapper}>
            <svg viewBox="0 0 52 52" className={styles.checkmarkSvg}>
              <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
              <motion.path 
                className={styles.checkmarkPath} 
                fill="none" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                initial={{ strokeDashoffset: 48 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
          </div>
          
          <h2 className={styles.successTitle} role="status">REGISTRATION COMPLETE</h2>
          <p className={styles.successText}>
            Operative credentials registered for:<br/>
            <span className={styles.successEmail}>{email}</span>
          </p>
          <p className={styles.successSubtext}>
            We have sent a verification link to your email. You must verify before accessing the system.
          </p>

          <button onClick={onNavigateLogin} className={styles.submitButton} style={{ marginTop: '1rem' }}>
            RETURN TO LOGIN
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className={`${styles.card} game-panel`}>
        <h2 className={styles.title}>NEW OPERATIVE REGISTRATION</h2>
        
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

        <form onSubmit={handleSignup} noValidate>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">FIRST NAME</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">LAST NAME</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">EMAIL VECTOR</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password">ENCRYPTION KEY</label>
              <span className={styles.strengthLabel} style={{ color: getStrengthColor() }}>
                {getStrengthLabel()}
              </span>
            </div>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={styles.input}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <div className={styles.strengthMeter}>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={styles.strengthSegment}
                  style={{
                    backgroundColor: password.length > 0 && strengthScore >= level ? getStrengthColor() : '#374151'
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">CONFIRM KEY</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className={`${styles.input} ${isPasswordMismatch ? styles.inputError : ''}`}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              id="tos"
              type="checkbox"
              checked={tosChecked}
              onChange={(e) => setTosChecked(e.target.checked)}
              disabled={isLoading}
              className={styles.checkbox}
            />
            <label htmlFor="tos" className={styles.checkboxLabel}>
              I accept the System Terms of Service and Protocols
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || strengthScore < 3 || isPasswordMismatch || !tosChecked}
          >
            {isLoading ? <span className={styles.spinner}></span> : "INITIALIZE OPERATIVE"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Existing operative?</span>
          <button type="button" onClick={onNavigateLogin} className={styles.linkButton}>
            Access Terminal
          </button>
        </div>
      </div>
    </motion.div>
  );
}
