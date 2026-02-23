import React from 'react'
import styles from './TabBar.module.css'

export default function TabBar({ activeTab, onTabChange, tabs }) {
  return (
    <div className={styles.tabBar}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          className={activeTab === id ? styles.tabActive : styles.tab}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
