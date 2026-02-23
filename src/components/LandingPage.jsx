import React, { useRef, useState, useEffect } from 'react'
import styles from './LandingPage.module.css'

const SLIDES = [
  { title: 'Paste Your Syllabus', description: 'Use AI to turn any syllabus into a formatted list. One paste, and your entire semester is imported.', icon: '📋' },
  { title: 'Calendar & List Views', description: 'Switch between calendar and list views. See assignments by month, week, or day—however you prefer to plan.', icon: '📅' },
  { title: 'Filter by Class', description: 'Focus on one course or see everything at once. Your assignments stay organized automatically.', icon: '🎯' },
  { title: 'Your Data, Secured', description: 'Sign in to save your plans. Your courses and assignments sync per account—never lose track.', icon: '🔐' },
]

export default function LandingPage({ onGetStarted, onSignIn }) {
  const scrollRef = useRef(null)
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

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToSlideshow() {
    const el = document.getElementById('slideshow')
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
          <button type="button" className={styles.navLink} onClick={scrollToSlideshow}>
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

      <section id="slideshow" className={styles.slidesSection}>
        <div className={`${styles.slideCard} ${isTransitioning ? styles.slideOut : ''}`} key={slideIndex}>
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

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} College Planner</p>
      </footer>
    </div>
  )
}
