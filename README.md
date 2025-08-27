# Levi’s Course Dashboard

A comprehensive course management dashboard for tracking assignments, schedules, and deadlines across multiple courses.

## Features

- **Upcoming Tasks**: View tasks due this week and upcoming assignments
- **Schedule View**: Detailed minute-by-minute schedule planning with inline time editing
- **Calendar View**: Monthly calendar with task overview
- **Course Filtering**: Filter by specific courses (Math, Composition, US History)
- **Search Functionality**: Search through all tasks and assignments
- **Progress Tracking**: Week and overall progress bars
- **Quick Add Task**: Add tasks directly from the dashboard
- **One-click .ics Export**: Export all due dates and schedule blocks to iCalendar
- **Responsive Design**: Works on desktop and mobile devices

## Courses Supported

- **College Algebra** (Math)
- **Composition**
- **US History**

## Usage

1. **Dashboard View**: See upcoming tasks organized by due date
2. **Schedule View**: Plan your day with detailed time blocks (edit times inline)
3. **Calendar View**: Get a monthly overview of all deadlines
4. **Course Filter**: Focus on specific subjects
5. **Search**: Find specific assignments quickly
6. **Export .ics**: Click the calendar button in Schedule view

## Local Storage

The dashboard uses browser localStorage to save your progress, completed tasks, and edited schedule block times. Your data stays on your device.

## Deployment

This project is configured for easy deployment to Netlify. Connect your GitHub repository and deploy automatically. See `DEPLOYMENT.md` for a step-by-step guide.

## Customization

- Edit the `scheduleBlocks` array in `js/script.js` to customize your daily schedule blocks
- Update `seedTasks` in `js/script.js` to change initial tasks

## Project Structure

```
index.html
css/
  styles.css
js/
  script.js
netlify.toml
README.md
DEPLOYMENT.md
```
