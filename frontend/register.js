const API_URL = 'http://localhost:3000/api';

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (username.length < 3) {
        showError('Username must be at least 3 characters');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Registration successful');
            showSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            showError(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Error registering:', error);
        showError('Network error. Please try again.');
    }
});

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    
    successDiv.style.display = 'none';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    const errorDiv = document.getElementById('error-message');
    
    errorDiv.style.display = 'none';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

// Custom cursor
function setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}

document.addEventListener('DOMContentLoaded', setupCustomCursor);
