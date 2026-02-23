import React from 'react'
import styles from './CourseInput.module.css'

export default function CourseInput({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="course-name" className={styles.label}>
        Course / Class name
      </label>
      <input
        id="course-name"
        type="text"
        placeholder="e.g. ENGL 101"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
    </div>
  )
}
