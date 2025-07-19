const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const demoData = require('../demo-data');

const router = express.Router();

// Demo mode flag - set to true to use demo data instead of database
const DEMO_MODE = true;

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        let user;
        
        if (DEMO_MODE) {
            // Demo mode - use demo data
            user = demoData.users.find(u => u.email === email);
            if (!user || user.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            // Database mode
            const [rows] = await pool.execute(
                'SELECT * FROM employees WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            user = rows[0];

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                employeeId: user.employee_id,
                employee_id: user.employee_id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                position: user.position
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                employeeId: user.employee_id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                position: user.position
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Get all employees (HR and admin only)
router.get('/employees', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'hr' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        let employees;
        
        if (DEMO_MODE) {
            employees = demoData.employees;
        } else {
            const [rows] = await pool.execute(
                'SELECT employee_id, name, email, position, department, role FROM employees'
            );
            employees = rows;
        }

        res.json({ employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Failed to fetch employees' });
    }
});

module.exports = router;
