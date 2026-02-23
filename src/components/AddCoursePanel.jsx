import React from 'react'
import CourseInput from './CourseInput'
import JSONInput from './JSONInput'
import styles from './AddCoursePanel.module.css'

const AI_PROMPT = `I will give you a course syllabus. Extract EVERYTHING that needs to be done for the semester—anything a student would put on a calendar. Output a JSON array with objects in this format: [{ "title": "Assignment Name", "due": "YYYY-MM-DD", "content": "Brief description or requirements" }]
Requirements:
1. Create an EXHAUSTIVE list. Include every assignment, quiz, exam, paper, reading due, discussion post, project milestone—anything with a due date or deadline.
2. List each item separately. Do NOT summarize (e.g., list "Quiz 1", "Quiz 2", "Quiz 3", not "Quizzes").
3. Use "title" for the assignment name, "due" for the date (YYYY-MM-DD), and "content" for a short description, requirements, or notes. Use empty string for content if none.
4. If a date is not specified, use 'TBD'.
5. Output valid JSON only, nothing else.
6. No weights or percentages—just date, name, and content.
7. Example: [{ "title": "Quiz 1 - Chapters 1-3", "due": "2026-02-12", "content": "Cover material from textbook pp. 1-45" }, { "title": "Essay 1 Draft", "due": "2026-02-19", "content": "First draft, 3-4 pages" }, { "title": "Midterm Exam", "due": "2026-03-05", "content": "" }]`

export default function AddCoursePanel({ courseName, jsonInput, onCourseChange, onJsonChange, onAdd, onClose }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Add Course</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <p className={styles.hint}>
        Paste the output from AI here. Use the prompt below in AI first, then copy what it gives you.
      </p>
      <CourseInput value={courseName} onChange={onCourseChange} />
      <div className={styles.jsonWrap}>
        <JSONInput value={jsonInput} onChange={onJsonChange} />
      </div>
      <button type="button" className={styles.addBtn} onClick={onAdd}>
        Add to Calendar
      </button>
      <details className={styles.promptDetails}>
        <summary>Copy this prompt for AI</summary>
        <pre>{AI_PROMPT}</pre>
      </details>
    </div>
  )
}
