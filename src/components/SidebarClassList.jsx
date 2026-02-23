import React from 'react'
import { getCourseColor } from '../utils/courseColors'
import styles from './SidebarClassList.module.css'

export default function SidebarClassList({ courses, value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Classes</span>
      <ul className={styles.list} role="listbox" aria-label="Filter by class">
        <li
          role="option"
          aria-selected={!value}
          className={styles.option}
          data-selected={!value}
          onClick={() => onChange('')}
        >
          All classes
        </li>
        {(courses || []).map((c) => (
          <li
            key={c}
            role="option"
            aria-selected={value === c}
            className={styles.option}
            data-selected={value === c}
            onClick={() => onChange(c)}
          >
            <span
              className={styles.dot}
              style={{ backgroundColor: getCourseColor(c) }}
              aria-hidden
            />
            <span className={styles.name}>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
