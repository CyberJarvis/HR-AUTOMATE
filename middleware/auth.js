const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const demoData = require('../demo-data');

// Demo mode flag
const DEMO_MODE = true;

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user;
        
        if (DEMO_MODE) {
            // Demo mode - use demo data
            user = demoData.users.find(u => u.employee_id === decoded.employeeId);
            if (!user) {
                return res.status(403).json({ message: 'User not found' });
            }
            
            req.user = {
                employee_id: user.employee_id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                position: user.position
            };
        } else {
            // Database mode
            const [rows] = await pool.execute(
                'SELECT employee_id, name, email, role, department, position FROM employees WHERE employee_id = ?',
                [decoded.employeeId]
            );

            if (rows.length === 0) {
                return res.status(403).json({ message: 'User not found' });
            }

            req.user = rows[0];
        }
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    requireRole
};
