import React from 'react'
import styles from './ClassFilter.module.css'

export default function ClassFilter({ courses, value, onChange }) {
  if (!courses || courses.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <label htmlFor="class-filter" className={styles.label}>
        Filter by class
      </label>
      <select
        id="class-filter"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All classes</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}
