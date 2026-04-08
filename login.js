/**
 * Login.js
 * Handles login form validation and authentication
 */

$(document).ready(function() {
    // Initialize local storage if needed
    initializeStorage();
    
    // Form submit handler
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Real-time email validation
    $('#email').on('blur', function() {
        validateEmail($(this).val());
    });

    // Real-time password validation
    $('#password').on('blur', function() {
        validatePassword($(this).val());
    });
});

/**
 * Initialize local storage with demo data
 */
function initializeStorage() {
    // Demo users with CLP (Chilean Pesos)
    const demoUsers = [
        {
            id: 1,
            email: 'usuario@email.com',
            password: '123456',
            name: 'Juan Pérez',
            balance: 1500000  // CLP
        },
        {
            id: 2,
            email: 'test@email.com',
            password: 'password',
            name: 'Maria García',
            balance: 1500000  // CLP
        }
    ];

    // Demo contacts
    const demoContacts = [
        { id: 1, name: 'Carlos López', email: 'carlos@email.com' },
        { id: 2, name: 'Ana Martinez', email: 'ana@email.com' },
        { id: 3, name: 'Roberto Fernández', email: 'roberto@email.com' }
    ];

    // Demo transactions for each user
    const demoTransactions = [
        // Juan Pérez transactions (id: 1)
        {
            id: 1,
            userId: 1,
            type: 'deposit',
            amount: 800000,
            paymentMethod: 'credit_card',
            description: 'Depósito inicial',
            date: new Date(2026, 0, 10).toLocaleString('es-ES'),
            status: 'completed'
        },
        {
            id: 2,
            userId: 1,
            type: 'transfer',
            amount: 150000,
            concept: 'Pago de servicios',
            recipient: 'carlos@email.com',
            date: new Date(2026, 0, 12).toLocaleString('es-ES'),
            status: 'completed'
        },
        {
            id: 3,
            userId: 1,
            type: 'received',
            amount: 200000,
            concept: 'Reembolso de préstamo',
            sender: 'ana@email.com',
            date: new Date(2026, 0, 13).toLocaleString('es-ES'),
            status: 'completed'
        },
        {
            id: 4,
            userId: 1,
            type: 'deposit',
            amount: 650000,
            paymentMethod: 'bank_transfer',
            description: 'Depósito de nómina',
            date: new Date(2026, 0, 14).toLocaleString('es-ES'),
            status: 'completed'
        },
        // Maria García transactions (id: 2)
        {
            id: 5,
            userId: 2,
            type: 'deposit',
            amount: 700000,
            paymentMethod: 'debit_card',
            description: 'Depósito inicial',
            date: new Date(2026, 0, 9).toLocaleString('es-ES'),
            status: 'completed'
        },
        {
            id: 6,
            userId: 2,
            type: 'transfer',
            amount: 100000,
            concept: 'Pago de arriendo',
            recipient: 'roberto@email.com',
            date: new Date(2026, 0, 11).toLocaleString('es-ES'),
            status: 'completed'
        },
        {
            id: 7,
            userId: 2,
            type: 'received',
            amount: 250000,
            concept: 'Transferencia de amigo',
            sender: 'carlos@email.com',
            date: new Date(2026, 0, 13).toLocaleString('es-ES'),
            status: 'completed'
        },
        {
            id: 8,
            userId: 2,
            type: 'deposit',
            amount: 650000,
            paymentMethod: 'digital_wallet',
            description: 'Depósito de verificación',
            date: new Date(2026, 0, 14).toLocaleString('es-ES'),
            status: 'completed'
        }
    ];

    // Always reset users with correct demo data to ensure proper balances
    localStorage.setItem('users', JSON.stringify(demoUsers));

    if (!localStorage.getItem('contacts')) {
        localStorage.setItem('contacts', JSON.stringify(demoContacts));
    }

    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify(demoTransactions));
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    const errorElement = $('#emailError');

    if (!isValid && email) {
        errorElement.text('Por favor, ingresa un email válido').removeClass('d-none');
        return false;
    } else {
        errorElement.addClass('d-none');
        return true;
    }
}

/**
 * Validate password
 */
function validatePassword(password) {
    const errorElement = $('#passwordError');

    if (password.length < 6 && password) {
        errorElement.text('La contraseña debe tener al menos 6 caracteres').removeClass('d-none');
        return false;
    } else {
        errorElement.addClass('d-none');
        return true;
    }
}

/**
 * Handle login process
 */
function handleLogin() {
    const email = $('#email').val().trim();
    const password = $('#password').val();

    // Validate inputs
    if (!validateEmail(email) || !validatePassword(password)) {
        showAlert('Por favor, completa todos los campos correctamente');
        return;
    }

    // Get users from storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to menu
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 500);
    } else {
        showAlert('Email o contraseña incorrectos');
    }
}

/**
 * Show alert message
 */
function showAlert(message) {
    const alertElement = $('#alertMessage');
    const alertText = $('#alertText');
    
    alertText.text(message);
    alertElement.removeClass('d-none').addClass('show');
    
    setTimeout(() => {
        alertElement.removeClass('show').addClass('d-none');
    }, 5000);
}

/**
 * Clear form
 */
function clearForm() {
    $('#loginForm')[0].reset();
    $('#emailError').addClass('d-none');
    $('#passwordError').addClass('d-none');
}
