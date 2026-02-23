import React from 'react'
import styles from './Summary.module.css'

export default function Summary({ assignments }) {
  if (!assignments || assignments.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.label}>Total Items</span>
        <span className={styles.value}>{assignments.length}</span>
      </div>
    </div>
  )
}
