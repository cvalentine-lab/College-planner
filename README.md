# College Planner

A React web app that helps students plan assignments and calculate the minimum score needed on each assignment to reach their target grade.

## How to Use

1. **Copy your course syllabus** and paste it into AI with the prompt shown in the app.
2. **Copy the JSON output** from AI and paste it into the app's JSON text area.
3. **Enter your target grade** (and optionally your current grade).
4. **Click "Generate Planner"** to see your personalized plan.

The app will:
- Sort assignments by due date (earliest first)
- Highlight assignments due within 7 days in red
- Calculate the minimum percentage needed for each assignment to reach your target grade
- Display a summary with total weight, number of assignments, and overall grade info

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```
