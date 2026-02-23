import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { loadAssignmentsForUser, saveAssignmentsForUser } from './context/AuthContext'
import AddCoursePanel from './components/AddCoursePanel'
import AssignmentTable from './components/AssignmentTable'
import Summary from './components/Summary'
import Calendar from './components/Calendar'
import ClassFilter from './components/ClassFilter'
import AuthScreen from './components/AuthScreen'
import LandingPage from './components/LandingPage'
import { parseAssignments, sortByDueDate, getUniqueCourses, filterByCourse } from './utils/syllabusParser'
import styles from './App.module.css'

function AppContent() {
  const { user, loading, login, createAccount, logout } = useAuth()
  const [authMode, setAuthMode] = useState('signin')
  const [showLanding, setShowLanding] = useState(true)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [courseName, setCourseName] = useState('')
  const [assignments, setAssignments] = useState([])
  const [courseFilter, setCourseFilter] = useState('')
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    if (user?.email) {
      setAssignments(loadAssignmentsForUser(user.email))
    }
  }, [user?.email])

  useEffect(() => {
    if (user?.email && assignments.length >= 0) {
      saveAssignmentsForUser(user.email, assignments)
    }
  }, [user?.email, assignments])

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

  if (loading) {
    return (
      <div className={styles.loading}>
        <span>Loading...</span>
      </div>
    )
  }

  if (!user) {
    if (showLanding !== false) {
      return (
        <LandingPage
          onGetStarted={() => setShowLanding(false)}
        />
      )
    }
    return (
      <AuthScreen
        mode={authMode}
        onSwitchMode={() => setAuthMode((m) => (m === 'signin' ? 'create' : 'signin'))}
        onSuccess={{ login, createAccount }}
        onBack={() => setShowLanding(true)}
      />
    )
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>SMART SYLLABUS PLANNER</div>
        <button
          type="button"
          className={styles.sidebarAddBtn}
          onClick={() => setShowAddPanel(true)}
        >
          + Add Course
        </button>
      </aside>

      <div className={styles.mainScroll}>
        <div className={styles.main}>
          <nav className={styles.nav}>
          {assignments.length > 0 && (
            <>
              <ClassFilter
                courses={courses}
                value={courseFilter}
                onChange={setCourseFilter}
              />
              <button
                type="button"
                className={styles.navLink}
                onClick={() => setShowList(false)}
                data-active={!showList}
              >
                Calendar
              </button>
              <button
                type="button"
                className={styles.navLink}
                onClick={() => setShowList(true)}
                data-active={showList}
              >
                List
              </button>
            </>
          )}
          <button
            type="button"
            className={styles.navAddBtn}
            onClick={() => setShowAddPanel(true)}
          >
            + Add Course
          </button>
          <button
            type="button"
            className={styles.logoutCorner}
            onClick={logout}
            title="Sign out"
          >
            Sign Out
          </button>
          </nav>

          <div className={styles.content}>
            {assignments.length === 0 ? (
              <div className={styles.empty}>
                <p>Add a course to get started.</p>
                <p className={styles.emptyHint}>
                  Use the <strong>+ Add Course</strong> button. Paste your syllabus into ChatGPT with the prompt in that panel, then paste the JSON output here.
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
          </div>
          <footer className={styles.footer}>
            <p className={styles.footerText}>
              © {new Date().getFullYear()} Smart Syllabus Planner. All rights reserved.
            </p>
            <p className={styles.footerTagline}>
              Plan smarter, stress less.
            </p>
          </footer>
        </div>
      </div>

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

export default function App() {
  return <AppContent />
}
