import React, { useState } from 'react'
import {
  getMonthGrid,
  getAssignmentsForDate,
  getWeekContaining,
  toDateKey,
  DAY_NAMES,
  MONTH_NAMES,
} from '../utils/calendarHelpers'
import { getCourseColor } from '../utils/courseColors'
import styles from './Calendar.module.css'

export default function Calendar({ assignments }) {
  const today = new Date()
  const [view, setView] = useState('month') // month | week | day
  const [focusDate, setFocusDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const filtered = assignments || []

  const year = focusDate.getFullYear()
  const month = focusDate.getMonth()

  function handleDayClick(date) {
    setFocusDate(new Date(date))
    setView('day')
  }

  function handleWeekClick(date) {
    setFocusDate(new Date(date))
    setView('week')
  }

  function goPrev() {
    if (view === 'month') {
      setFocusDate(new Date(year, month - 1, 1))
    } else if (view === 'week') {
      const week = getWeekContaining(focusDate)
      setFocusDate(new Date(week[0].getTime() - 7 * 24 * 60 * 60 * 1000))
    } else {
      setFocusDate(new Date(focusDate.getTime() - 24 * 60 * 60 * 1000))
    }
  }

  function goNext() {
    if (view === 'month') {
      setFocusDate(new Date(year, month + 1, 1))
    } else if (view === 'week') {
      const week = getWeekContaining(focusDate)
      setFocusDate(new Date(week[0].getTime() + 7 * 24 * 60 * 60 * 1000))
    } else {
      setFocusDate(new Date(focusDate.getTime() + 24 * 60 * 60 * 1000))
    }
  }

  function goToMonth() {
    setView('month')
    setFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1))
  }

  function goToWeek() {
    setView('week')
    const week = getWeekContaining(focusDate)
    setFocusDate(new Date(week[0]))
  }

  function goToDay() {
    setView('day')
  }

  function handleGoToDate(e) {
    const val = e.target.value
    if (!val) return
    const d = new Date(val + 'T12:00:00') // noon to avoid timezone issues
    if (isNaN(d.getTime())) return
    if (view === 'month') {
      setFocusDate(new Date(d.getFullYear(), d.getMonth(), 1))
    } else if (view === 'week') {
      const week = getWeekContaining(d)
      setFocusDate(new Date(week[0]))
    } else {
      setFocusDate(new Date(d))
    }
  }

  const goToDateStr =
    view === 'month'
      ? `${year}-${String(month + 1).padStart(2, '0')}-01`
      : view === 'week'
        ? (() => {
            const w = getWeekContaining(focusDate)
            return `${w[0].getFullYear()}-${String(w[0].getMonth() + 1).padStart(2, '0')}-${String(w[0].getDate()).padStart(2, '0')}`
          })()
        : `${focusDate.getFullYear()}-${String(focusDate.getMonth() + 1).padStart(2, '0')}-${String(focusDate.getDate()).padStart(2, '0')}`

  return (
    <div className={styles.calendar}>
      <div className={styles.flowerCorner} aria-hidden="true">
        <div className={styles.flowerCenter} />
        <div className={styles.petal} data-i="1" />
        <div className={styles.petal} data-i="2" />
        <div className={styles.petal} data-i="3" />
        <div className={styles.petal} data-i="4" />
        <div className={styles.petal} data-i="5" />
        <div className={styles.petal} data-i="6" />
      </div>
      <div className={styles.toolbar}>
        <div className={styles.viewSwitcher}>
          <button
            type="button"
            className={view === 'month' ? styles.viewActive : styles.viewBtn}
            onClick={goToMonth}
          >
            Month
          </button>
          <button
            type="button"
            className={view === 'week' ? styles.viewActive : styles.viewBtn}
            onClick={goToWeek}
          >
            Week
          </button>
          <button
            type="button"
            className={view === 'day' ? styles.viewActive : styles.viewBtn}
            onClick={goToDay}
          >
            Day
          </button>
        </div>
        <div className={styles.goTo}>
          <label htmlFor="go-to-date" className={styles.goToLabel}>
            Go to
          </label>
          <input
            id="go-to-date"
            type="date"
            className={styles.goToInput}
            value={goToDateStr}
            onChange={handleGoToDate}
          />
        </div>
        {(view === 'day' || view === 'week') && (
          <button
            type="button"
            className={styles.backBtn}
            onClick={goToMonth}
          >
            ← Month
          </button>
        )}
        <div className={styles.nav}>
          <button type="button" className={styles.navBtn} onClick={goPrev}>
            ←
          </button>
          <button
            type="button"
            className={styles.titleBtn}
            onClick={goToMonth}
            title="Back to month view"
          >
            {view === 'month' && `${MONTH_NAMES[month]} ${year}`}
            {view === 'week' && (() => {
              const week = getWeekContaining(focusDate)
              const start = week[0]
              const end = week[6]
              return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${year}`
            })()}
            {view === 'day' && `${MONTH_NAMES[focusDate.getMonth()]} ${focusDate.getDate()}, ${year}`}
          </button>
          <button type="button" className={styles.navBtn} onClick={goNext}>
            →
          </button>
        </div>
      </div>

      {view === 'month' && (
        <MonthView
          year={year}
          month={month}
          assignments={filtered}
          onDayClick={handleDayClick}
          onWeekClick={handleWeekClick}
        />
      )}
      {view === 'week' && (
        <WeekView
          focusDate={focusDate}
          assignments={filtered}
          onDayClick={handleDayClick}
        />
      )}
      {view === 'day' && (
        <DayView focusDate={focusDate} assignments={filtered} />
      )}
    </div>
  )
}

function MonthView({ year, month, assignments, onDayClick, onWeekClick }) {
  const grid = getMonthGrid(year, month)

  // Group into weeks (rows of 7)
  const weeks = []
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7))
  }

  return (
    <div className={styles.monthView}>
      <div className={styles.weekdayHeader}>
        {DAY_NAMES.map((d) => (
          <div key={d} className={styles.weekday}>
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div
          key={wi}
          className={styles.weekRow}
          onClick={() => onWeekClick(week[0].date)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onWeekClick(week[0].date)}
        >
          {week.map((cell, di) => {
            const items = getAssignmentsForDate(assignments, cell.date)
            const isToday =
              cell.date.toDateString() === new Date().toDateString()

            return (
              <div
                key={di}
                className={`${styles.dayCell} ${!cell.isCurrentMonth ? styles.otherMonth : ''} ${isToday ? styles.today : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDayClick(cell.date)
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                    onDayClick(cell.date)
                  }
                }}
              >
                <span className={styles.dayNum}>{cell.date.getDate()}</span>
                {items.length > 0 && (
                  <div className={styles.dayDots}>
                    {items.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className={styles.dot}
                        title={a.title}
                        style={{
                          backgroundColor: getCourseColor(a.course),
                        }}
                      />
                    ))}
                    {items.length > 3 && (
                      <span className={styles.more}>+{items.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function WeekView({ focusDate, assignments, onDayClick }) {
  const week = getWeekContaining(focusDate)

  return (
    <div className={styles.weekView}>
      <div className={styles.weekGrid}>
        {week.map((date) => {
          const items = getAssignmentsForDate(assignments, date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={toDateKey(date)}
              className={`${styles.weekDay} ${isToday ? styles.today : ''}`}
            >
              <div className={styles.weekDayHeader}>
                <span className={styles.weekDayName}>{DAY_NAMES[date.getDay()]}</span>
                <button
                  type="button"
                  className={styles.weekDayNum}
                  onClick={() => onDayClick(date)}
                >
                  {date.getDate()}
                </button>
              </div>
              <div className={styles.weekDayItems}>
                {items.map((a, i) => (
                  <div
                    key={i}
                    className={styles.weekItem}
                    style={{ borderLeftColor: getCourseColor(a.course) }}
                  >
                    <span className={styles.weekItemTitle}>{a.title}</span>
                    {a.course && (
                      <span className={styles.weekItemCourse}>{a.course}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayView({ focusDate, assignments }) {
  const items = getAssignmentsForDate(assignments, focusDate)

  return (
    <div className={styles.dayView}>
      <div className={styles.dayViewList}>
        {items.length === 0 ? (
          <p className={styles.empty}>No assignments due this day.</p>
        ) : (
          items.map((a, i) => (
            <div
              key={i}
              className={styles.dayItem}
              style={{ borderLeftColor: getCourseColor(a.course) }}
            >
              <div className={styles.dayItemHeader}>
                <span className={styles.dayItemTitle}>{a.title}</span>
                {a.course && (
                  <span className={styles.dayItemCourse}>{a.course}</span>
                )}
              </div>
              {a.content && (
                <p className={styles.dayItemContent}>{a.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

