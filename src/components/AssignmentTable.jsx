import React from 'react'
import { isDueWithin7Days } from '../utils/syllabusParser'
import styles from './AssignmentTable.module.css'

export default function AssignmentTable({ assignments }) {
  if (!assignments || assignments.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Class</th>
            <th>Assignment</th>
            <th>Due Date</th>
            <th>Content / Notes</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a, i) => {
            const urgent = isDueWithin7Days(a.due)
            return (
              <tr key={i} className={urgent ? styles.urgentRow : ''}>
                <td className={styles.course}>{a.course || '—'}</td>
                <td>{a.title}</td>
                <td className={urgent ? styles.urgentDate : ''}>{a.due}</td>
                <td className={styles.content}>{a.content || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
