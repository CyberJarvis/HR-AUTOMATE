// Common JavaScript functions for the HR Management System

const API_BASE_URL = '/api';

// Auth functions
function getAuthToken() {
    return localStorage.getItem('token');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Check authentication
function checkAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// API request helper with authentication
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            // Token expired or invalid
            logout();
            return;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'error', containerId = 'alertContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Clear existing alerts
    container.innerHTML = '';
    container.appendChild(alertDiv);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format rating with stars
function formatRating(rating) {
    if (!rating) return '<span class="text-muted">Not rated</span>';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="star">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += '<span class="star">☆</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="star empty">☆</span>';
    }
    
    starsHtml += ` <span style="margin-left: 5px;">${rating.toFixed(1)}</span>`;
    
    return `<div class="rating-container">${starsHtml}</div>`;
}

// Format status badge
function formatStatus(status) {
    const statusClass = `status-${status.replace('_', '-')}`;
    return `<span class="status-badge ${statusClass}">${status.replace('_', ' ')}</span>`;
}

// Format progress bar
function formatProgress(progress) {
    const percentage = Math.min(100, Math.max(0, progress || 0));
    return `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <small style="margin-top: 5px; display: block;">${percentage.toFixed(1)}%</small>
    `;
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Loading states
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="spinner"></div>';
    }
}

function hideLoading() {
    const spinners = document.querySelectorAll('.spinner');
    spinners.forEach(spinner => {
        if (spinner.parentElement) {
            spinner.parentElement.removeChild(spinner);
        }
    });
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(fields) {
    let isValid = true;
    let firstErrorField = null;
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#dc3545';
            isValid = false;
            if (!firstErrorField) firstErrorField = field;
        } else if (field) {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    if (!isValid && firstErrorField) {
        firstErrorField.focus();
    }
    
    return isValid;
}

// Tab functionality
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Initialize user info in header
function initUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    
    if (userNameElement) userNameElement.textContent = user.name;
    if (userRoleElement) userRoleElement.textContent = user.role;
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!checkAuth()) return;
    
    // Initialize user info
    initUserInfo();
    
    // Initialize tabs
    initTabs();
    
    // Add logout event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
});

// Export functions for use in other scripts
window.hrApp = {
    apiRequest,
    showAlert,
    formatDate,
    formatRating,
    formatStatus,
    formatProgress,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
    validateEmail,
    validateRequired,
    getCurrentUser,
    logout
};
