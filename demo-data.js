// Demo data for testing without MySQL
const demoData = {
    users: [
        {
            employee_id: 'EMP001',
            name: 'John Doe',
            email: 'john.doe@company.com',
            password: 'password123', // In real app, this would be hashed
            department: 'Engineering',
            position: 'Software Developer',
            role: 'employee'
        },
        {
            employee_id: 'HR001',
            name: 'Alice Johnson',
            email: 'alice.johnson@company.com',
            password: 'password123',
            department: 'Human Resources',
            position: 'HR Manager',
            role: 'hr'
        },
        {
            employee_id: 'ADMIN001',
            name: 'Alex Morgan',
            email: 'admin@company.com',
            password: 'admin123',
            department: 'Administration',
            position: 'System Administrator',
            role: 'admin'
        }
    ],
    
    reviews: [
        {
            id: 1,
            employee_id: 'EMP001',
            employee_name: 'John Doe',
            department: 'Engineering',
            reviewer_id: 'HR001',
            reviewer_name: 'Alice Johnson',
            review_period_start: '2024-01-01',
            review_period_end: '2024-06-30',
            overall_rating: 4.2,
            technical_skills: 4.5,
            communication: 4.0,
            teamwork: 4.3,
            leadership: 3.8,
            punctuality: 4.6,
            goals_achieved: 4.1,
            comments: 'Excellent technical skills and great team collaboration.',
            feedback: 'Continue to develop leadership skills for future growth.',
            status: 'approved',
            created_at: '2024-07-01'
        }
    ],
    
    goals: [
        {
            id: 1,
            employee_id: 'EMP001',
            employee_name: 'John Doe',
            department: 'Engineering',
            title: 'Complete React Certification',
            description: 'Obtain React.js professional certification to enhance frontend skills',
            progress: 75,
            status: 'in_progress',
            target_date: '2024-12-31',
            created_by: 'HR001',
            created_by_name: 'Alice Johnson',
            created_at: '2024-01-15'
        },
        {
            id: 2,
            employee_id: 'EMP001',
            employee_name: 'John Doe',
            department: 'Engineering',
            title: 'Lead Team Project',
            description: 'Take leadership role in the new mobile app development project',
            progress: 30,
            status: 'in_progress',
            target_date: '2024-10-30',
            created_by: 'HR001',
            created_by_name: 'Alice Johnson',
            created_at: '2024-06-01'
        }
    ],
    
    feedback: [
        {
            id: 1,
            employee_id: 'EMP001',
            employee_name: 'John Doe',
            department: 'Engineering',
            from_employee_id: 'HR001',
            from_employee_name: 'Alice Johnson',
            from_position: 'HR Manager',
            type: 'supervisor',
            feedback_text: 'John has shown exceptional growth in his role. His problem-solving skills and attention to detail are outstanding. He would benefit from taking on more leadership responsibilities.',
            rating: 4.3,
            is_anonymous: false,
            created_at: '2024-07-10'
        },
        {
            id: 2,
            employee_id: 'EMP001',
            employee_name: 'John Doe',
            department: 'Engineering',
            from_employee_id: 'EMP002',
            from_employee_name: null,
            from_position: null,
            type: 'peer',
            feedback_text: 'Great colleague to work with. Always willing to help and share knowledge with the team.',
            rating: 4.5,
            is_anonymous: true,
            created_at: '2024-07-05'
        }
    ],

    employees: [
        {
            employee_id: 'EMP001',
            name: 'John Doe',
            email: 'john.doe@company.com',
            department: 'Engineering',
            position: 'Software Developer',
            role: 'employee'
        },
        {
            employee_id: 'HR001',
            name: 'Alice Johnson',
            email: 'alice.johnson@company.com',
            department: 'Human Resources',
            position: 'HR Manager',
            role: 'hr'
        },
        {
            employee_id: 'ADMIN001',
            name: 'Alex Morgan',
            email: 'admin@company.com',
            department: 'Administration',
            position: 'System Administrator',
            role: 'admin'
        },
        {
            employee_id: 'EMP002',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@company.com',
            department: 'Marketing',
            position: 'Marketing Specialist',
            role: 'employee'
        },
        {
            employee_id: 'EMP003',
            name: 'Michael Brown',
            email: 'michael.brown@company.com',
            department: 'Sales',
            position: 'Sales Representative',
            role: 'employee'
        }
    ]
};

module.exports = demoData;
