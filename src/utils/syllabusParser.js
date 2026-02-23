/**
 * Parse and validate assignment JSON from AI syllabus output.
 * Expected format: { title, due, content }
 * @param {string} jsonStr - Raw JSON string
 * @param {string} courseName - Name of the course to tag assignments with
 * @returns {Array|null} - Array of assignments (with course) or null if invalid
 */
export function parseAssignments(jsonStr, courseName = '') {
  try {
    const parsed = JSON.parse(jsonStr.trim());
    if (!Array.isArray(parsed)) return null;

    const course = String(courseName || 'Unnamed').trim();

    return parsed
      .filter((item) => item && typeof item.title === 'string')
      .map((item) => ({
        title: String(item.title).trim(),
        due: item.due && String(item.due).trim() !== '' ? String(item.due).trim() : 'TBD',
        content: item.content != null ? String(item.content).trim() : '',
        course,
      }));
  } catch {
    return null;
  }
}

/**
 * Sort assignments by due date (earliest first).
 * TBD dates go to the end.
 */
export function sortByDueDate(assignments) {
  const withDate = [];
  const tbd = [];

  for (const a of assignments) {
    if (a.due === 'TBD') {
      tbd.push(a);
      continue;
    }
    const date = parseDate(a.due);
    if (date && !isNaN(date.getTime())) {
      withDate.push({ ...a, _parsedDate: date });
    } else {
      tbd.push(a);
    }
  }

  withDate.sort((a, b) => a._parsedDate - b._parsedDate);
  return withDate.map(({ _parsedDate, ...rest }) => rest).concat(tbd);
}

function parseDate(str) {
  if (str === 'TBD' || !str) return null;
  return new Date(str);
}

/**
 * Check if due date is within the next 7 days (or overdue).
 */
export function isDueWithin7Days(dueStr) {
  if (!dueStr || dueStr === 'TBD') return false;
  const due = new Date(dueStr);
  if (isNaN(due.getTime())) return false;
  const now = new Date();
  const diff = due - now;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return diff <= sevenDaysMs;
}

/**
 * Get unique course names from assignments.
 */
export function getUniqueCourses(assignments) {
  if (!assignments || assignments.length === 0) return [];
  const set = new Set(assignments.map((a) => a.course).filter(Boolean));
  return Array.from(set).sort();
}

/**
 * Filter assignments by course. Empty string = all courses.
 */
export function filterByCourse(assignments, courseFilter) {
  if (!assignments) return [];
  if (!courseFilter) return assignments;
  return assignments.filter((a) => a.course === courseFilter);
}
