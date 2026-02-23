const COURSE_COLORS = [
  '#e87d4a',
  '#f0a066',
  '#f0c977',
  '#94b0d5',
  '#ee9988',
  '#e8b84a',
]

const colorMap = new Map()

export function getCourseColor(course) {
  if (!course) return COURSE_COLORS[0]
  if (!colorMap.has(course)) {
    colorMap.set(course, COURSE_COLORS[colorMap.size % COURSE_COLORS.length])
  }
  return colorMap.get(course)
}
