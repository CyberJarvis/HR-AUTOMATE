const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const demoData = require('../demo-data');

const router = express.Router();

// Demo mode flag
const DEMO_MODE = true;

// Get performance reviews for current user (Employee view)
router.get('/reviews/my', authenticateToken, async (req, res) => {
    try {
        let reviews;
        
        if (DEMO_MODE) {
            reviews = demoData.reviews.filter(r => r.employee_id === req.user.employee_id);
        } else {
            const [rows] = await pool.execute(`
                SELECT pr.*, e.name as reviewer_name
                FROM performance_reviews pr
                JOIN employees e ON pr.reviewer_id = e.employee_id
                WHERE pr.employee_id = ?
                ORDER BY pr.created_at DESC
            `, [req.user.employee_id]);
            reviews = rows;
        }

        res.json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// Get all performance reviews (HR view)
router.get('/reviews/all', authenticateToken, requireRole(['hr', 'admin']), async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT pr.*, e1.name as employee_name, e1.department, e1.position,
                   e2.name as reviewer_name
            FROM performance_reviews pr
            JOIN employees e1 ON pr.employee_id = e1.employee_id
            JOIN employees e2 ON pr.reviewer_id = e2.employee_id
            ORDER BY pr.created_at DESC
        `);

        res.json({ reviews: rows });
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

// Create new performance review (HR only)
router.post('/reviews', authenticateToken, requireRole(['hr', 'admin']), async (req, res) => {
    try {
        const {
            employeeId,
            reviewPeriodStart,
            reviewPeriodEnd,
            overallRating,
            technicalSkills,
            communication,
            teamwork,
            leadership,
            punctuality,
            goalsAchieved,
            comments,
            feedback
        } = req.body;

        if (DEMO_MODE) {
            // In demo mode, simulate review creation
            const newReview = {
                id: Date.now(), // Simple ID generation for demo
                employee_id: employeeId,
                reviewer_id: req.user.employee_id,
                review_period_start: reviewPeriodStart,
                review_period_end: reviewPeriodEnd,
                overall_rating: overallRating,
                technical_skills: technicalSkills,
                communication: communication,
                teamwork: teamwork,
                leadership: leadership,
                punctuality: punctuality,
                goals_achieved: goalsAchieved,
                comments: comments,
                feedback: feedback,
                status: 'submitted',
                created_at: new Date().toISOString().split('T')[0]
            };
            
            // Add to demo data (this won't persist between server restarts)
            demoData.reviews.push(newReview);
            
            res.status(201).json({ 
                message: 'Performance review created successfully',
                reviewId: newReview.id 
            });
        } else {
            const [result] = await pool.execute(`
                INSERT INTO performance_reviews 
                (employee_id, reviewer_id, review_period_start, review_period_end,
                 overall_rating, technical_skills, communication, teamwork, 
                 leadership, punctuality, goals_achieved, comments, feedback, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
            `, [
                employeeId, req.user.employee_id, reviewPeriodStart, reviewPeriodEnd,
                overallRating, technicalSkills, communication, teamwork,
                leadership, punctuality, goalsAchieved, comments, feedback
            ]);

            res.status(201).json({ 
                message: 'Performance review created successfully',
                reviewId: result.insertId 
            });
        }
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Failed to create review' });
    }
});

// Get goals for current user
router.get('/goals/my', authenticateToken, async (req, res) => {
    try {
        let goals;
        
        if (DEMO_MODE) {
            goals = demoData.goals.filter(g => g.employee_id === req.user.employee_id);
        } else {
            const [rows] = await pool.execute(`
                SELECT g.*, e.name as created_by_name
                FROM goals g
                LEFT JOIN employees e ON g.created_by = e.employee_id
                WHERE g.employee_id = ?
                ORDER BY g.created_at DESC
            `, [req.user.employee_id]);
            goals = rows;
        }

        res.json({ goals });
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Failed to fetch goals' });
    }
});

// Get all goals (HR view)
router.get('/goals/all', authenticateToken, requireRole(['hr', 'admin']), async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT g.*, e1.name as employee_name, e1.department,
                   e2.name as created_by_name
            FROM goals g
            JOIN employees e1 ON g.employee_id = e1.employee_id
            LEFT JOIN employees e2 ON g.created_by = e2.employee_id
            ORDER BY g.created_at DESC
        `);

        res.json({ goals: rows });
    } catch (error) {
        console.error('Error fetching all goals:', error);
        res.status(500).json({ message: 'Failed to fetch goals' });
    }
});

// Create new goal
router.post('/goals', authenticateToken, async (req, res) => {
    try {
        const { employeeId, title, description, targetDate } = req.body;
        
        // If HR is creating for another employee, use provided employeeId
        // If employee is creating for themselves, use their own ID
        const finalEmployeeId = req.user.role === 'hr' ? employeeId : req.user.employee_id;

        if (DEMO_MODE) {
            // In demo mode, simulate goal creation
            const newGoal = {
                id: Date.now(), // Simple ID generation for demo
                employee_id: finalEmployeeId,
                title: title,
                description: description,
                target_date: targetDate,
                status: 'pending',
                progress: 0,
                created_by: req.user.employee_id,
                created_at: new Date().toISOString().split('T')[0]
            };
            
            // Add to demo data (this won't persist between server restarts)
            demoData.goals.push(newGoal);
            
            res.status(201).json({ 
                message: 'Goal created successfully',
                goalId: newGoal.id 
            });
        } else {
            const [result] = await pool.execute(`
                INSERT INTO goals (employee_id, title, description, target_date, created_by)
                VALUES (?, ?, ?, ?, ?)
            `, [finalEmployeeId, title, description, targetDate, req.user.employee_id]);

            res.status(201).json({ 
                message: 'Goal created successfully',
                goalId: result.insertId 
            });
        }
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Failed to create goal' });
    }
});

// Update goal progress
router.put('/goals/:id/progress', authenticateToken, async (req, res) => {
    try {
        const { progress, status } = req.body;
        const goalId = req.params.id;

        if (DEMO_MODE) {
            // In demo mode, find and update the goal in demoData
            const goalIndex = demoData.goals.findIndex(g => g.id == goalId);
            if (goalIndex !== -1) {
                demoData.goals[goalIndex].progress = progress;
                demoData.goals[goalIndex].status = status;
                demoData.goals[goalIndex].updated_at = new Date().toISOString().split('T')[0];
                
                res.json({ message: 'Goal progress updated successfully' });
            } else {
                res.status(404).json({ message: 'Goal not found' });
            }
        } else {
            await pool.execute(`
                UPDATE goals 
                SET progress = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND (employee_id = ? OR ? IN (SELECT employee_id FROM employees WHERE role IN ('hr', 'admin')))
            `, [progress, status, goalId, req.user.employee_id, req.user.employee_id]);

            res.json({ message: 'Goal progress updated successfully' });
        }
    } catch (error) {
        console.error('Error updating goal progress:', error);
        res.status(500).json({ message: 'Failed to update goal progress' });
    }
});

// Get feedback for current user
router.get('/feedback/my', authenticateToken, async (req, res) => {
    try {
        let feedback;
        
        if (DEMO_MODE) {
            feedback = demoData.feedback.filter(f => f.employee_id === req.user.employee_id);
        } else {
            const [rows] = await pool.execute(`
                SELECT f.*, e.name as from_employee_name, e.position as from_position
                FROM feedback f
                LEFT JOIN employees e ON f.from_employee_id = e.employee_id
                WHERE f.employee_id = ?
                ORDER BY f.created_at DESC
            `, [req.user.employee_id]);
            feedback = rows;
        }

        res.json({ feedback });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
});

// Get all feedback (HR view)
router.get('/feedback/all', authenticateToken, requireRole(['hr', 'admin']), async (req, res) => {
    try {
        if (DEMO_MODE) {
            // Return all feedback with employee details from demo data
            const allFeedback = demoData.feedback.map(f => {
                const employee = demoData.employees.find(e => e.employee_id === f.employee_id);
                const fromEmployee = demoData.employees.find(e => e.employee_id === f.from_employee_id);
                return {
                    ...f,
                    employee_name: employee?.name || 'Unknown',
                    department: employee?.department || 'Unknown',
                    from_employee_name: fromEmployee?.name || 'Anonymous',
                    from_position: fromEmployee?.position || 'Unknown'
                };
            });
            res.json({ feedback: allFeedback });
        } else {
            const [rows] = await pool.execute(`
                SELECT f.*, e1.name as employee_name, e1.department,
                       e2.name as from_employee_name, e2.position as from_position
                FROM feedback f
                JOIN employees e1 ON f.employee_id = e1.employee_id
                LEFT JOIN employees e2 ON f.from_employee_id = e2.employee_id
                ORDER BY f.created_at DESC
            `);

            res.json({ feedback: rows });
        }
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
});

// Submit feedback
router.post('/feedback', authenticateToken, async (req, res) => {
    try {
        const { employeeId, type, feedbackText, rating, isAnonymous } = req.body;

        if (DEMO_MODE) {
            // In demo mode, simulate feedback creation
            const newFeedback = {
                id: Date.now(), // Simple ID generation for demo
                employee_id: employeeId,
                from_employee_id: req.user.employee_id,
                type: type,
                feedback_text: feedbackText,
                rating: rating,
                is_anonymous: isAnonymous,
                created_at: new Date().toISOString().split('T')[0]
            };
            
            // Add to demo data (this won't persist between server restarts)
            demoData.feedback.push(newFeedback);
            
            res.status(201).json({ 
                message: 'Feedback submitted successfully',
                feedbackId: newFeedback.id 
            });
        } else {
            const [result] = await pool.execute(`
                INSERT INTO feedback (employee_id, from_employee_id, type, feedback_text, rating, is_anonymous)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [employeeId, req.user.employee_id, type, feedbackText, rating, isAnonymous]);

            res.status(201).json({ 
                message: 'Feedback submitted successfully',
                feedbackId: result.insertId 
            });
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
});

// Get all employees (for dropdowns and selections)
router.get('/employees', authenticateToken, async (req, res) => {
    try {
        let employees;
        
        if (DEMO_MODE) {
            employees = demoData.users;
        } else {
            const [rows] = await pool.execute(`
                SELECT employee_id, name, email, department, position, role
                FROM employees
                ORDER BY name
            `);
            employees = rows;
        }

        res.json({ employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Failed to fetch employees' });
    }
});

// Get performance dashboard statistics
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        let stats = {};

        if (DEMO_MODE) {
            // Demo mode statistics
            if (req.user.role === 'hr' || req.user.role === 'admin') {
                // HR Dashboard stats
                stats = {
                    totalEmployees: 1,
                    totalReviews: 1,
                    avgRating: '4.2',
                    pendingReviews: 0,
                    totalGoals: 2,
                    completedGoals: 0,
                    avgProgress: '52.5'
                };
            } else {
                // Employee Dashboard stats
                stats = {
                    totalReviews: 1,
                    avgRating: '4.2',
                    totalGoals: 2,
                    completedGoals: 0,
                    avgProgress: '52.5',
                    totalFeedback: 2
                };
            }
        } else {
            // Database mode (existing code)
            if (req.user.role === 'hr' || req.user.role === 'admin') {
                // HR Dashboard stats
                const [reviewStats] = await pool.execute(`
                    SELECT 
                        COUNT(*) as total_reviews,
                        AVG(overall_rating) as avg_rating,
                        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending_reviews
                    FROM performance_reviews
                `);

                const [goalStats] = await pool.execute(`
                    SELECT 
                        COUNT(*) as total_goals,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_goals,
                        AVG(progress) as avg_progress
                    FROM goals
                `);

                const [employeeStats] = await pool.execute(`
                    SELECT COUNT(*) as total_employees FROM employees WHERE role = 'employee'
                `);

                stats = {
                    totalReviews: reviewStats[0].total_reviews,
                    avgRating: parseFloat(reviewStats[0].avg_rating || 0).toFixed(2),
                    pendingReviews: reviewStats[0].pending_reviews,
                    totalGoals: goalStats[0].total_goals,
                    completedGoals: goalStats[0].completed_goals,
                    avgProgress: parseFloat(goalStats[0].avg_progress || 0).toFixed(1),
                    totalEmployees: employeeStats[0].total_employees
                };
            } else {
                // Employee Dashboard stats
                const [reviewStats] = await pool.execute(`
                    SELECT 
                        COUNT(*) as total_reviews,
                        AVG(overall_rating) as avg_rating
                    FROM performance_reviews
                    WHERE employee_id = ?
                `, [req.user.employee_id]);

                const [goalStats] = await pool.execute(`
                    SELECT 
                        COUNT(*) as total_goals,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_goals,
                        AVG(progress) as avg_progress
                    FROM goals
                    WHERE employee_id = ?
                `, [req.user.employee_id]);

                const [feedbackStats] = await pool.execute(`
                    SELECT COUNT(*) as total_feedback
                    FROM feedback
                    WHERE employee_id = ?
                `, [req.user.employee_id]);

                stats = {
                    totalReviews: reviewStats[0].total_reviews,
                    avgRating: parseFloat(reviewStats[0].avg_rating || 0).toFixed(2),
                    totalGoals: goalStats[0].total_goals,
                    completedGoals: goalStats[0].completed_goals,
                    avgProgress: parseFloat(goalStats[0].avg_progress || 0).toFixed(1),
                    totalFeedback: feedbackStats[0].total_feedback
                };
            }
        }

        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
});

module.exports = router;
