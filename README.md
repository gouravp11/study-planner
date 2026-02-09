# 📚 Study Planner

A comprehensive web-based study planning application designed to help students manage their subjects, schedule classes, track tasks, and monitor their academic progress effectively.

## 🌟 Features

### Dashboard
- **Quick Statistics**: View total subjects, completed tasks, pending tasks, and upcoming deadlines at a glance
- **Upcoming Deadlines**: Stay on track with a prioritized list of upcoming assignments and exams
- **Today's Schedule**: Quick view of today's classes and planned study sessions
- **Real-time Updates**: Dashboard updates automatically when you switch browser tabs

### Subject Management
- **Add/Edit/Delete Subjects**: Manage all your academic subjects with ease
- **Subject Details**: Track subject name and priority level (Low/Medium/High)
- **Subject Descriptions**: Add detailed notes and descriptions for each subject
- **Cascading Deletion**: Removing a subject automatically cleans up associated schedules and tasks

### Schedule Planner
- **Weekly Timetable**: View all your classes in a comprehensive weekly schedule
- **Daily Schedule**: Plan and review classes for specific dates
- **Session Details**: Input session time, duration, and subject
- **Easy Management**: Create, edit, and delete session schedules with an intuitive interface

### Task Manager
- **Multiple Task Types**: Support for assignments, exams, projects, and other task types
- **Categorized Views**:
  - Assignments Tab: Focus on homework and assignments
  - Exams Tab: Track all upcoming examinations
  - All Tasks Tab: Complete overview of all tasks
- **Task Details**: Include title, description, due date, due time, priority level, and subject
- **Task Completion**: Mark tasks as completed and track progress
- **Priority System**: Set tasks as Low, Medium, or High priority for better organization

### Progress Analytics
- **Study Progress**: Visual percentage of completed vs. pending tasks with a progress bar
- **Subject Performance**: See task completion rate for each subject
- **Weekly Activity**: View class distribution across weekdays
- **Completed Subjects**: Track which subjects are fully completed
- **Time Allocation**: Visualize how much study time is allocated to each subject

### Settings & Preferences
- **Dark Mode**: Toggle between light and dark themes for comfortable studying
- **Notifications**: Enable/disable notification preferences
- **Week Settings**: Configure whether your week starts on Sunday or Monday
- **Data Management**:
  - Export all your data as JSON files for backup
  - Import previously exported data to restore or migrate
  - Reset all data with double confirmation for safety

## 🚀 Getting Started

### Installation
1. Clone or download the project files
2. Ensure you have the following files in the same directory:
   - `index.html`
   - `script.js`
   - `style.css`

### Running the Application
1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. The application will load with an empty state ready for data entry
3. No server or additional dependencies required

## 📖 How to Use

### Adding a Subject
1. Navigate to the **Subjects** section from the sidebar
2. Click the **"+ Add Subject"** button
3. Fill in the required information:
   - **Subject Name** (required): e.g., "Mathematics", "Physics"
   - **Priority**: Choose Low, Medium, or High
   - **Description**: Additional notes about the subject
4. Click **"Save Subject"** to add it to your list

### Managing Classes
1. Go to the **Schedule** section
2. Click **"+ Add Session"** to create a new session entry
3. Select the subject, day, time, and duration
4. Switch between **Daily View** (see sessions for a specific date) and **Weekly View** (see all sessions in a table format)

### Creating Tasks
1. Navigate to **Tasks** section
2. Click **"+ Add Task"** to create a new task
3. Provide task details:
   - **Task Title** (required): What needs to be done
   - **Type** (required): Assignment, Exam, Project, or Other
   - **Subject** (required): Which subject the task belongs to
   - **Due Date** (required): When it's due
   - **Due Time**: Specific time (optional)
   - **Description**: Additional details (optional)
   - **Priority**: Set importance level
4. Save and view in the appropriate tab
5. Use the **✓ button** to mark tasks complete, or **↩️ button** to mark as incomplete

### Viewing Analytics
1. Go to **Analytics** section to see comprehensive progress data
2. Check different visualization sections:
   - **Study Progress**: Overall completion percentage
   - **Subject Performance**: Completion rate per subject
   - **Weekly Activity**: Classes per day of the week
   - **Completed Subjects**: List of fully completed subjects
   - **Time Allocation**: Study time distribution

### Customizing Settings
1. Navigate to **Settings**
2. **Preferences**:
   - Toggle dark mode for a comfortable viewing experience
   - Enable/disable notifications as needed
   - Choose week start day (Sunday or Monday)
3. **Data Management**:
   - **Export Data**: Download a backup of all your data as JSON
   - **Import Data**: Restore data from a previously exported file
   - **Reset All Data**: Clear everything (requires double confirmation)

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS variables, Flexbox, and Grid
- **Vanilla JavaScript**: Pure JS without any external dependencies
- **Local Storage**: Browser-based data persistence
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
study-planner/
├── index.html       # Main HTML structure
├── style.css        # Complete styling and themes
├── script.js        # All JavaScript functionality
└── README.md        # Documentation (this file)
```

## 📄 File Descriptions

### index.html
Contains the complete HTML structure including:
- **Sidebar Navigation**: Links to all main sections
- **Header**: Page title and theme toggle
- **Content Sections**:
  - Dashboard with statistics and upcoming items
  - Subject Management table
  - Schedule Planner with daily and weekly views
  - Task Manager with tabbed interface
  - Analytics with multiple visualizations
  - Settings panel
- **Modal Forms**: Pop-up dialogs for adding/editing subjects, schedules, and tasks

### script.js
Implements all application logic:
- **Data Management**: Create, read, update, delete operations with localStorage
- **UI Utilities**: Modal and section switching functions
- **Dashboard Logic**: Statistics calculation and updates
- **Subject Functions**: CRUD operations for subjects
- **Schedule Functions**: Class management and daily/weekly view rendering
- **Task Functions**: Task management and completion tracking
- **Analytics Logic**: Data aggregation and visualization generation
- **Settings**: Theme switching, preferences, import/export functionality
- **Event Listeners**: User interaction handlers

### style.css
Provides comprehensive styling:
- **CSS Variables**: Color scheme and theme management
- **Layout**: Flexbox and Grid-based responsive design
- **Components**: Cards, buttons, tables, modals, badges, progress bars
- **Dark Mode**: Complete dark theme support
- **Responsive Design**: Mobile optimization for smaller screens
- **Animations**: Smooth transitions and hover effects
- **Scrollbar Styling**: Custom scrollbar appearance

## 💾 Data Storage

All data is stored locally in the browser using **localStorage**:
- Data is automatically saved after every action
- Data persists between browser sessions
- Maximum storage varies by browser (typically 5-10 MB)
- Data is specific to the domain and browser
- Clearing browser storage will delete all data

### Data Structure
```json
{
  "subjects": [
    {
      "id": "timestamp",
      "name": "Subject Name",
      "priority": "high/medium/low",
      "description": "Description text"
    }
  ],
  "schedule": [
    {
      "id": "timestamp",
      "subjectId": "subject_timestamp",
      "day": "Monday",
      "time": "09:00",
      "duration": 60
    }
  ],
  "tasks": [
    {
      "id": "timestamp",
      "title": "Task Title",
      "type": "assignment/exam/project/other",
      "subjectId": "subject_timestamp",
      "dueDate": "2024-12-25",
      "dueTime": "23:59",
      "description": "Task details",
      "priority": "high/medium/low",
      "completed": false
    }
  ],
  "settings": {
    "darkMode": false,
    "notifications": true,
    "weekStartDay": 1
  }
}
```

## 🎨 Visual Features

### Color Scheme (Light Mode)
- **Primary**: Indigo (#6366f1) - Main interactive elements
- **Secondary**: Pink (#ec4899) - Accents
- **Accent**: Amber (#f59e0b) - Warnings
- **Success**: Green (#10b981) - Completed status
- **Danger**: Red (#ef4444) - Urgent/Errors

### Color Scheme (Dark Mode)
- Automatically adjusts all colors for comfortable night-time use
- Maintains full functionality and readability

### Responsive Design
- Works on desktop (1024px and above)
- Tablet optimized (768px to 1024px)
- Mobile friendly (below 768px)
- Sidebar converts to horizontal navigation on mobile

## 📊 Key Functionalities

### Task Priority System
- **High Priority** (Red badge): Urgent deadline or high importance
- **Medium Priority** (Orange badge): Standard importance
- **Low Priority** (Blue badge): Can be deferred

### Subject Priority Levels
- **High**: Core subjects requiring more focus
- **Medium**: Standard importance subjects
- **Low**: Elective or supplementary subjects

### Deadline Tracking
- **Overdue**: Past due date (shown in red)
- **Urgent**: Due within 1 day (red badge)
- **Soon**: Due within 3 days (orange badge)
- **Upcoming**: Future deadlines (normal display)

### Task Status Management
- **Pending**: Not yet completed task
- **Completed**: Finished task marked with ✓ symbol
- **Reversible**: Can toggle between pending and completed

## 🌐 Browser Compatibility

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Opera** 76+

## 🔒 Privacy & Security

- All data remains on your device - no cloud sync or server upload
- No tracking or analytics
- No external API calls
- Completely offline-capable application
- Data backup and export under your full control

## 💡 Tips for Best Usage

1. **Regular Backups**: Export your data monthly for safety
2. **Priority Assignment**: Assign realistic priorities to manage workload
3. **Daily Routine**: Check the dashboard each morning for today's schedule
4. **Analytics Review**: Weekly review of progress analytics to adjust study plan
5. **Schedule Management**: Keep your timetable updated for accurate analytics
6. **Task Tracking**: Promptly mark tasks complete to maintain accurate progress metrics

## 🐛 Known Limitations

- No recurring tasks or recurring sessions (must be manually re-entered)
- No notification system (browser notifications not implemented)
- No cloud synchronization between devices
- No room/location tracking for sessions
- Export file size limited by browser's download capabilities
- No image or file attachments for tasks and subjects

## 🚀 Future Enhancement Ideas

- Cloud synchronization for multi-device support
- Real browser notifications for deadlines
- Recurring events (weekly classes, repeated assignments)
- Built-in note-taking or markdown support for tasks
- Calendar view with visual scheduling
- Student grade tracking and GPA calculator
- Study session timer and Pomodoro integration
- AI-powered study recommendations
- Collaboration features for group projects
- Mobile app versions (iOS/Android)
- Integration with calendar APIs (Google Calendar, Outlook)

## 👨‍💻 Development Notes

### Adding New Features
The code is organized by functionality:
- UI utilities at the top
- Each major feature (subjects, schedule, tasks, analytics) has its own section
- Event listeners are consolidated at the bottom for easy modification

### Extending the Application
To add new features:
1. Add HTML elements to `index.html`
2. Create JavaScript functions in `script.js` following existing patterns
3. Add CSS styles to `style.css` using existing CSS variables
4. Update localStorage schema if adding new data fields
5. Remember to call `planner.saveData()` after any data changes

### Code Quality Notes
- Pure JavaScript with no framework dependencies
- Modular function design for maintainability
- CSS variables for consistent theming
- Responsive grid-based layouts
- Event delegation where applicable

## 📝 License

This project is created for educational purposes. Feel free to use, modify, and distribute as needed.

## 🤝 Support

If you encounter any issues:
1. Check browser console for error messages (F12 Developer Tools)
2. Verify all three files are in the same directory
3. Try clearing localStorage and restarting (note: this will clear all data)
4. Ensure you're using a supported modern browser

## 📞 Contact & Feedback

For suggestions, improvements, or bug reports, consider enhancing the application or creating an issue in your project management system.

---

**Happy Planning! 📚✨**

Start organizing your academic life today and watch your productivity soar!
