import React, { useRef } from 'react'
import styles from './LandingPage.module.css'

export default function LandingPage({ onGetStarted, onSignIn }) {
  const scrollRef = useRef(null)

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToAbout() {
    const el = document.getElementById('about')
    const container = scrollRef.current
    if (!el || !container) return
    const target = el.offsetTop - 20
    const start = container.scrollTop
    const distance = target - start
    const duration = 1400
    let startTime = null

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      container.scrollTop = start + distance * easeInOutCubic(progress)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <div ref={scrollRef} className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span>COLLEGE PLANNER</span>
        </div>
        <nav className={styles.nav}>
          <button type="button" className={styles.navLink} onClick={scrollToTop}>
            Home
          </button>
          <button type="button" className={styles.navLink} onClick={scrollToAbout}>
            About
          </button>
          <button type="button" className={styles.navLink} onClick={onSignIn}>
            Sign In
          </button>
        </nav>
      </header>

      <div className={styles.split}>
        <section className={styles.left}>
          <h1 className={styles.headline}>
            College
            <br />
            Planner
          </h1>
          <div className={styles.accentLine} />
          <p className={styles.bodyText}>
            Turn your syllabi into a visual calendar. Use AI to import your assignments in one paste—never miss a deadline again.
          </p>
          <button type="button" className={styles.ctaBtn} onClick={onGetStarted}>
            Get Started
          </button>
          {onSignIn && (
            <button
              type="button"
              className={styles.signInLink}
              onClick={onSignIn}
            >
              Already have an account? Sign in
            </button>
          )}
          <div className={styles.codeIcon} aria-hidden="true">
            {'</>'}
          </div>
        </section>

        <section className={styles.right}>
          <div className={styles.foliage}>
            <div className={styles.flowerCenter} />
            <div className={styles.petal} data-i="1" />
            <div className={styles.petal} data-i="2" />
            <div className={styles.petal} data-i="3" />
            <div className={styles.petal} data-i="4" />
            <div className={styles.petal} data-i="5" />
            <div className={styles.petal} data-i="6" />
            <div className={styles.petal} data-i="7" />
            <div className={styles.petal} data-i="8" />
            <div className={styles.petal} data-i="9" />
            <div className={styles.petal} data-i="10" />
            <div className={styles.petal} data-i="11" />
            <div className={styles.petal} data-i="12" />
          </div>
        </section>
      </div>

      <section id="about" className={styles.about}>
        <h2 className={styles.aboutTitle}>About College Planner</h2>
        <p className={styles.aboutText}>
          College Planner helps you turn messy syllabi into a clear visual calendar. Paste your syllabus into AI, copy the output, and we'll organize your assignments by due date. View everything in a calendar or list, filter by class, and stay on top of deadlines.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} College Planner</p>
      </footer>
    </div>
  )
}
