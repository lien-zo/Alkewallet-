/**
 * Menu.js
 * Handles menu functionality and user dashboard
 */

$(document).ready(function() {
    // Check if user is logged in
    checkUserSession();
    
    // Load dashboard data
    loadDashboardData();
    
    // Logout handler
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        handleLogout();
    });

    // Add some animations on page load
    animateCards();
});

/**
 * Check if user session exists
 */
function checkUserSession() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Redirect to login if no session
        window.location.href = 'login.html';
    }
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    try {
        const currentUserData = localStorage.getItem('currentUser');
        const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

        if (currentUser) {
            // Update user name
            const userName = currentUser.name || 'Usuario';
            $('#userName').text(userName);
            
            // Update balance - ensure it's a number and valid
            let balance = parseInt(currentUser.balance, 10);
            if (isNaN(balance) || balance === undefined) {
                // If balance is invalid, get it from users list
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const userData = users.find(u => u.id === currentUser.id);
                balance = userData ? parseInt(userData.balance, 10) : 0;
                
                // Update currentUser with correct balance
                if (userData) {
                    currentUser.balance = userData.balance;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }
            
            updateBalanceDisplay(balance);
            
            // Count transactions for current user
            const userTransactions = transactions.filter(t => t.userId === currentUser.id);
            $('#totalTransactions').text(userTransactions.length || 0);
            
            // Count contacts
            $('#totalContacts').text(contacts.length || 0);
        } else {
            console.warn('No current user found');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Update balance display with animation
 */
function updateBalanceDisplay(balance) {
    const balanceElement = $('#balanceAmount');
    
    // Ensure balance is a valid number
    let numBalance = parseInt(balance, 10);
    if (isNaN(numBalance) || numBalance < 0) {
        numBalance = 0;
    }
    
    // Format balance with Chilean locale
    const formattedBalance = 'CLP $' + numBalance.toLocaleString('es-CL');
    
    // Update balance text
    balanceElement.text(formattedBalance);
}

/**
 * Animate cards on page load
 */
function animateCards() {
    const cards = $('.action-card');
    
    cards.each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        });
        
        $(this).delay(100 * index).animate({
            'opacity': '1'
        }, 400, function() {
            $(this).css('transform', 'translateY(0)');
        });
    });
}

/**
 * Handle logout
 */
function handleLogout() {
    // Confirm logout
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Clear session
        localStorage.removeItem('currentUser');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

/**
 * Refresh dashboard data
 */
function refreshDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Update user's balance from storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUser = users.find(u => u.id === currentUser.id);
        
        if (updatedUser) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            loadDashboardData();
        }
    }
}

// Export function for use in other modules
window.refreshDashboard = refreshDashboard;
