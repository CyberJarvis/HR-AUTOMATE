# HR Management System - Performance Management Module

A comprehensive Performance Management System built with Node.js, Express, MySQL, HTML, CSS, and JavaScript. This system provides separate dashboards for employees and HR personnel to manage performance reviews, goals, and feedback.

## Features

### Employee Dashboard
- **Performance Overview**: View personal performance statistics and ratings
- **My Reviews**: Access all performance reviews received
- **My Goals**: Track assigned goals and update progress
- **Feedback**: View feedback received from supervisors and peers

### HR Dashboard
- **Dashboard**: Overview of organization-wide performance metrics
- **Performance Reviews**: Create and manage employee performance reviews
- **Goals Management**: Assign and track goals for all employees
- **Feedback**: View all feedback and provide feedback to employees
- **Employee Management**: View all employee information

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
├── config/
│   └── database.js          # Database configuration and initialization
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── performance.js       # Performance management routes
├── public/
│   ├── css/
│   │   └── styles.css       # Main stylesheet
│   ├── js/
│   │   └── common.js        # Shared JavaScript functions
│   ├── login.html           # Login page
│   ├── employee-dashboard.html  # Employee dashboard
│   └── hr-dashboard.html    # HR dashboard
├── server.js                # Main server file
├── init-db.js              # Database initialization script
└── package.json            # Dependencies and scripts
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone or Download the Project
```bash
# If you have the project files, navigate to the project directory
cd "Automated HR Management System"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up MySQL Database
1. Create a MySQL database named `hr_management`:
```sql
CREATE DATABASE hr_management;
```

2. Create a MySQL user (optional but recommended):
```sql
CREATE USER 'hr_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON hr_management.* TO 'hr_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hr_management
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### 5. Initialize the Database
```bash
npm run init-db
```

This will create all necessary tables and insert sample data.

### 6. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

### 7. Access the Application
Open your web browser and navigate to: `http://localhost:3000`

## Default Login Credentials

The system comes with sample users for testing:

### Employee Account
- **Email**: `john.doe@company.com`
- **Password**: `password123`

### HR Account  
- **Email**: `alice.johnson@company.com`
- **Password**: `password123`

## Database Schema

### Tables

1. **employees**: Store employee information and authentication
2. **performance_reviews**: Store performance review data
3. **goals**: Store employee goals and progress tracking
4. **feedback**: Store feedback between employees

### Key Features

- **Role-based Access**: Different interfaces for employees and HR
- **Secure Authentication**: JWT-based authentication system
- **Performance Tracking**: Comprehensive performance review system
- **Goal Management**: Goal setting and progress tracking
- **Feedback System**: Peer and supervisor feedback
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - User logout

### Performance Management
- `GET /api/performance/reviews/my` - Get user's reviews (Employee)
- `GET /api/performance/reviews/all` - Get all reviews (HR)
- `POST /api/performance/reviews` - Create new review (HR)
- `GET /api/performance/goals/my` - Get user's goals (Employee)
- `GET /api/performance/goals/all` - Get all goals (HR)
- `POST /api/performance/goals` - Create new goal
- `PUT /api/performance/goals/:id/progress` - Update goal progress
- `GET /api/performance/feedback/my` - Get user's feedback
- `GET /api/performance/feedback/all` - Get all feedback (HR)
- `POST /api/performance/feedback` - Submit feedback
- `GET /api/performance/employees` - Get all employees
- `GET /api/performance/dashboard/stats` - Get dashboard statistics

## Usage Guide

### For Employees
1. **Login**: Use your company email and password
2. **Dashboard**: View your performance summary and statistics
3. **Reviews**: Check your performance reviews and ratings
4. **Goals**: Track your assigned goals and update progress
5. **Feedback**: Read feedback from supervisors and colleagues

### For HR Personnel
1. **Login**: Use your HR account credentials
2. **Dashboard**: Monitor organization-wide performance metrics
3. **Create Reviews**: Conduct performance reviews for employees
4. **Assign Goals**: Set goals for employees and track progress
5. **Manage Feedback**: View all feedback and provide feedback to employees
6. **Employee Overview**: Access employee information and performance data

## Customization

### Adding New Features
1. Add new database tables in `config/database.js`
2. Create corresponding API routes in `routes/`
3. Update frontend interfaces in `public/`

### Styling
- Modify `public/css/styles.css` for visual customization
- The design uses a modern gradient theme with glassmorphism effects

### Database
- Update connection settings in `config/database.js`
- Modify table schemas as needed for your organization

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- SQL injection protection with parameterized queries
- CORS protection

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the project repository or contact the development team.
