import React from 'react'
import styles from './JSONInput.module.css'

const JSON_PLACEHOLDER = `[
  { "title": "Quiz 1 - Chapters 1-3", "due": "2026-02-12", "content": "Cover material from textbook pp. 1-45" },
  { "title": "Essay 1 Draft", "due": "2026-02-19", "content": "First draft, 3-4 pages" },
  { "title": "Midterm Exam", "due": "2026-03-05", "content": "" }
]`

export default function JSONInput({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="json-input" className={styles.label}>
        Paste output from AI
      </label>
      <textarea
        id="json-input"
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={JSON_PLACEHOLDER}
        spellCheck={false}
      />
    </div>
  )
}
