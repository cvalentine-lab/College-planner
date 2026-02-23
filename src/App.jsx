import React, { useState } from 'react'
import AddCoursePanel from './components/AddCoursePanel'
import AssignmentTable from './components/AssignmentTable'
import Summary from './components/Summary'
import Calendar from './components/Calendar'
import ClassFilter from './components/ClassFilter'
import { parseAssignments, sortByDueDate, getUniqueCourses, filterByCourse } from './utils/syllabusParser'
import styles from './App.module.css'

export default function App() {
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [courseName, setCourseName] = useState('')
  const [assignments, setAssignments] = useState([])
  const [courseFilter, setCourseFilter] = useState('')
  const [showList, setShowList] = useState(false)

  const courses = getUniqueCourses(assignments)
  const filteredAssignments = filterByCourse(assignments, courseFilter)
  const sortedAssignments = sortByDueDate(filteredAssignments)

  function handleAdd() {
    const parsed = parseAssignments(jsonInput, courseName)
    if (parsed === null) {
      alert('Invalid JSON. Please paste valid JSON from ChatGPT.')
      return
    }
    if (parsed.length === 0) {
      alert('No valid assignments found. Ensure the JSON has objects with "title" and "due".')
      return
    }

    const sorted = sortByDueDate(parsed)
    setAssignments((prev) => {
      const byKey = new Map()
      prev.forEach((a) => byKey.set(`${a.course}|${a.title}|${a.due}`, a))
      sorted.forEach((a) => byKey.set(`${a.course}|${a.title}|${a.due}`, a))
      return sortByDueDate(Array.from(byKey.values()))
    })
    setJsonInput('')
    setCourseName('')
    setShowAddPanel(false)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Smart Syllabus Planner</h1>
        <div className={styles.headerRight}>
          {assignments.length > 0 && (
            <>
              <ClassFilter
                courses={courses}
                value={courseFilter}
                onChange={setCourseFilter}
              />
              <button
                type="button"
                className={styles.listToggle}
                onClick={() => setShowList(!showList)}
              >
                {showList ? 'Calendar' : 'List'}
              </button>
            </>
          )}
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setShowAddPanel(true)}
          >
            + Add Course
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {assignments.length === 0 ? (
          <div className={styles.empty}>
            <p>Add a course to get started.</p>
            <p className={styles.emptyHint}>
              Use the <strong>+ Add Course</strong> button above. Paste your syllabus into ChatGPT with the prompt in that panel, then paste the JSON output here.
            </p>
            <button
              type="button"
              className={styles.addBtnLarge}
              onClick={() => setShowAddPanel(true)}
            >
              + Add Course
            </button>
          </div>
        ) : showList ? (
          <section className={styles.section}>
            <Summary assignments={sortedAssignments} />
            <AssignmentTable assignments={sortedAssignments} />
          </section>
        ) : (
          <Calendar assignments={filteredAssignments} />
        )}
      </main>

      {showAddPanel && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setShowAddPanel(false)}
            aria-hidden="true"
          />
          <AddCoursePanel
            courseName={courseName}
            jsonInput={jsonInput}
            onCourseChange={setCourseName}
            onJsonChange={setJsonInput}
            onAdd={handleAdd}
            onClose={() => setShowAddPanel(false)}
          />
        </>
      )}
    </div>
  )
}
