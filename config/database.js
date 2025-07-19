const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hr_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables
const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Create employees table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                department VARCHAR(50),
                position VARCHAR(50),
                hire_date DATE,
                role ENUM('employee', 'hr', 'admin') DEFAULT 'employee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create performance_reviews table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS performance_reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id VARCHAR(20) NOT NULL,
                reviewer_id VARCHAR(20) NOT NULL,
                review_period_start DATE NOT NULL,
                review_period_end DATE NOT NULL,
                overall_rating DECIMAL(3,2),
                technical_skills DECIMAL(3,2),
                communication DECIMAL(3,2),
                teamwork DECIMAL(3,2),
                leadership DECIMAL(3,2),
                punctuality DECIMAL(3,2),
                goals_achieved DECIMAL(3,2),
                comments TEXT,
                feedback TEXT,
                status ENUM('draft', 'submitted', 'reviewed', 'approved') DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
                FOREIGN KEY (reviewer_id) REFERENCES employees(employee_id)
            )
        `);

        // Create goals table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS goals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id VARCHAR(20) NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                target_date DATE,
                status ENUM('not_started', 'in_progress', 'completed', 'cancelled') DEFAULT 'not_started',
                progress DECIMAL(5,2) DEFAULT 0,
                created_by VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
                FOREIGN KEY (created_by) REFERENCES employees(employee_id)
            )
        `);

        // Create feedback table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id VARCHAR(20) NOT NULL,
                from_employee_id VARCHAR(20) NOT NULL,
                type ENUM('peer', 'supervisor', 'subordinate', 'self') NOT NULL,
                feedback_text TEXT NOT NULL,
                rating DECIMAL(3,2),
                is_anonymous BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
                FOREIGN KEY (from_employee_id) REFERENCES employees(employee_id)
            )
        `);

        // Insert sample data
        await connection.execute(`
            INSERT IGNORE INTO employees (employee_id, name, email, password, department, position, hire_date, role) VALUES
            ('EMP001', 'John Doe', 'john.doe@company.com', '$2a$10$8K1p/a0drtRrXeaETqwgKu7h9r1v0qpOjX4KHzFRgBhU9YW8MRyEO', 'Engineering', 'Software Developer', '2023-01-15', 'employee'),
            ('EMP002', 'Jane Smith', 'jane.smith@company.com', '$2a$10$8K1p/a0drtRrXeaETqwgKu7h9r1v0qpOjX4KHzFRgBhU9YW8MRyEO', 'Engineering', 'Senior Developer', '2022-03-20', 'employee'),
            ('HR001', 'Alice Johnson', 'alice.johnson@company.com', '$2a$10$8K1p/a0drtRrXeaETqwgKu7h9r1v0qpOjX4KHzFRgBhU9YW8MRyEO', 'Human Resources', 'HR Manager', '2021-05-10', 'hr')
        `);

        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = {
    pool,
    initDatabase
};
