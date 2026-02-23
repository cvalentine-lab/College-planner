import React, { useState, useEffect } from 'react'
import styles from './LandingPage.module.css'

const SLIDES = [
  {
    title: 'Paste Your Syllabus',
    description: 'Use ChatGPT to turn any syllabus into structured JSON. One paste, and your entire semester is imported.',
    icon: '📋',
  },
  {
    title: 'Calendar & List Views',
    description: 'Switch between calendar and list views. See assignments by month, week, or day—however you prefer to plan.',
    icon: '📅',
  },
  {
    title: 'Filter by Class',
    description: 'Focus on one course or see everything at once. Your assignments stay organized automatically.',
    icon: '🎯',
  },
  {
    title: 'Your Data, Secured',
    description: 'Sign in to save your plans. Your courses and assignments sync per account—never lose track.',
    icon: '🔐',
  },
]

export default function LandingPage({ onGetStarted }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setSlideIndex((i) => (i + 1) % SLIDES.length)
        setIsTransitioning(false)
      }, 300)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  function goToSlide(i) {
    if (i === slideIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setSlideIndex(i)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgShapes} aria-hidden="true">
        <div className={styles.shape1} />
        <div className={styles.shape2} />
        <div className={styles.shape3} />
        <div className={styles.shape4} />
      </div>

      <header className={styles.header}>
        <span className={styles.logo}>SMART SYLLABUS PLANNER</span>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Plan smarter, <span className={styles.heroAccent}>stress less.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Turn your syllabi into a visual calendar and never miss a deadline.
          </p>
        </section>

        <section className={styles.slides}>
          <div
            className={`${styles.slideCard} ${isTransitioning ? styles.slideOut : ''}`}
            key={slideIndex}
          >
            <div className={styles.slideIcon}>{SLIDES[slideIndex].icon}</div>
            <h2 className={styles.slideTitle}>{SLIDES[slideIndex].title}</h2>
            <p className={styles.slideDesc}>{SLIDES[slideIndex].description}</p>
          </div>

          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={styles.dot}
                aria-label={`Go to slide ${i + 1}`}
                data-active={i === slideIndex}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <button
            type="button"
            className={styles.ctaBtn}
            onClick={onGetStarted}
          >
            Get Started
          </button>
          <p className={styles.ctaHint}>Free — create an account to begin</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Smart Syllabus Planner</p>
      </footer>
    </div>
  )
}
