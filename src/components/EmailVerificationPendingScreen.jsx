import React, { useState, useEffect } from 'react';
import { sendEmailVerification, reload, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EmailVerificationPendingScreen.module.css';

export default function EmailVerificationPendingScreen() {
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  
  const [cooldown, setCooldown] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(c => c - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await sendEmailVerification(auth.currentUser, { url: window.location.origin });
      setCooldown(60);
      setError('');
    } catch (err) {
      if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Try again later.');
      } else {
        setError('Failed to resend verification email.');
      }
    }
  };

  const handleCheckVerified = async () => {
    if (isReloading) return;
    setIsReloading(true);
    setError('');
    
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        setIsLeaving(true);
        // Force auth token refresh to trigger onAuthStateChanged in useAuth
        setTimeout(async () => {
          await auth.currentUser.getIdToken(true);
          window.location.reload(); // Fallback to ensure app proceeds
        }, 300);
      } else {
        setShake(true);
        setError('Email not verified yet. Please check your inbox.');
        setTimeout(() => setShake(false), 300);
      }
    } catch (err) {
      setError('Error verifying status. Try again.');
    } finally {
      setIsReloading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const formatCooldown = (secs) => {
    const s = secs % 60;
    return `0:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {!isLeaving && (
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className={`${styles.card} ${shake ? styles.shake : ''} game-panel`}>
            
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.inboxIcon}>
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
            </div>

            <h2 className={styles.title}>VERIFICATION REQUIRED</h2>
            
            <p className={styles.text}>
              A security clearance link has been dispatched to:
            </p>
            <div className={styles.emailWrapper} title={auth.currentUser?.email}>
              {auth.currentUser?.email}
            </div>

            <p className={styles.spamHint}>
              📫 Don't see it? Check your <strong>Spam</strong> or <strong>Junk</strong> folder.
            </p>

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

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleCheckVerified}
                disabled={isReloading}
              >
                {isReloading ? <span className={styles.spinner}></span> : "I'VE VERIFIED, CONTINUE"}
              </button>

              <button
                type="button"
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={handleResend}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? (
                  <span>
                    Resend in <span className={styles.pulseTime} aria-live="polite">{formatCooldown(cooldown)}</span>
                  </span>
                ) : (
                  "RESEND EMAIL"
                )}
              </button>
            </div>

            <div className={styles.footer}>
              <span>Wrong terminal?</span>
              <button type="button" onClick={handleSignOut} className={styles.linkButton}>
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
