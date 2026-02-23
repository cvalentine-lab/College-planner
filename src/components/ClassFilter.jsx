import React, { useState, useRef, useEffect } from 'react'
import { getCourseColor } from '../utils/courseColors'
import styles from './ClassFilter.module.css'

export default function ClassFilter({ courses, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!courses || courses.length === 0) return null

  const displayValue = value || 'All classes'

  return (
    <div className={styles.wrapper} ref={ref}>
      <label htmlFor="class-filter-btn" className={styles.label}>
        Filter by class
      </label>
      <button
        id="class-filter-btn"
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.triggerContent}>
          {value && (
            <span
              className={styles.optionDot}
              style={{ backgroundColor: getCourseColor(value) }}
              aria-hidden
            />
          )}
          <span>{displayValue}</span>
        </span>
        <span className={styles.chevron}>▼</span>
      </button>
      {open && (
        <ul
          className={styles.dropdown}
          role="listbox"
          aria-label="Filter by class"
        >
          <li
            role="option"
            aria-selected={!value}
            className={styles.option}
            data-selected={!value}
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
          >
            All classes
          </li>
          {courses.map((c) => (
            <li
              key={c}
              role="option"
              aria-selected={value === c}
              className={styles.option}
              data-selected={value === c}
              onClick={() => {
                onChange(c)
                setOpen(false)
              }}
            >
              <span className={styles.optionDot} style={{ backgroundColor: getCourseColor(c) }} aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
