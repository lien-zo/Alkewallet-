/**
 * Deposit.js
 * Handles deposit functionality
 */

$(document).ready(function() {
    // Check user session
    checkUserSession();
    
    // Load current balance
    loadCurrentBalance();
    
    // Form submit handler
    $('#depositForm').on('submit', function(e) {
        e.preventDefault();
        processDeposit();
    });

    // Real-time validation for amount
    $('#depositAmount').on('input', function() {
        // Prevent decimal input
        let value = $(this).val();
        if (value && !Number.isInteger(Number(value))) {
            $(this).val(Math.floor(value));
        }
        const amount = extractDepositAmount();
        validateDepositAmount(amount);
    });
});

/**
 * Check if user is logged in
 */
function checkUserSession() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

/**
 * Load current user balance
 */
function loadCurrentBalance() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const formattedBalance = 'CLP $' + parseInt(currentUser.balance).toLocaleString('es-CL');
        $('#currentBalance').text(formattedBalance);
    }
}

/**
 * Extract and parse deposit amount
 */
function extractDepositAmount() {
    const amountInput = String($('#depositAmount').val()).trim();
    if (!amountInput) return null;
    const amount = parseInt(amountInput, 10);
    return isNaN(amount) ? null : amount;
}

/**
 * Validate deposit amount
 */
function validateDepositAmount(amount) {
    const errorElement = $('#amountError');
    
    if (amount === null || isNaN(amount)) {
        errorElement.text('Ingresa un monto válido').removeClass('d-none');
        return false;
    }
    if (amount < 1) {
        errorElement.text('El monto debe ser mínimo CLP $1').removeClass('d-none');
        return false;
    }
    if (amount > 100000000) {
        errorElement.text('El monto no puede exceder CLP $100,000,000').removeClass('d-none');
        return false;
    }
    errorElement.addClass('d-none');
    return true;
}

/**
 * Process deposit
 */
function processDeposit() {
    const amount = extractDepositAmount();
    const paymentMethod = $('#paymentMethod').val();
    const description = $('#depositDescription').val();

    // Validate inputs
    if (!validateDepositAmount(amount) || !paymentMethod) {
        showErrorMessage('Por favor, completa todos los campos requeridos');
        return;
    }
    
    // Ensure it's a whole number (no decimals)
    if (amount % 1 !== 0) {
        showErrorMessage('Solo se aceptan números enteros sin decimales');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Update user balance
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].balance += amount;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in session
        currentUser.balance = users[userIndex].balance;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Create transaction record
    const transaction = {
        id: Date.now(),
        userId: currentUser.id,
        type: 'deposit',
        amount: amount,
        paymentMethod: paymentMethod,
        description: description || 'Depósito',
        date: new Date().toLocaleString('es-ES'),
        status: 'completed'
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Show success message
    showSuccessMessage(`¡Depósito de CLP $${amount.toLocaleString('es-CL')} realizado exitosamente!`);

    // Update balance display
    setTimeout(() => {
        loadCurrentBalance();
        clearForm();
    }, 1500);
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const successElement = $('#successMessage');
    const successText = $('#successText');
    
    successText.text(message);
    successElement.removeClass('d-none').addClass('show');
    
    setTimeout(() => {
        successElement.removeClass('show').addClass('d-none');
    }, 4000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const errorElement = $('#errorMessage');
    const errorText = $('#errorText');
    
    errorText.text(message);
    errorElement.removeClass('d-none').addClass('show');
    
    setTimeout(() => {
        errorElement.removeClass('show').addClass('d-none');
    }, 4000);
}

/**
 * Clear form
 */
function clearForm() {
    $('#depositForm')[0].reset();
    $('#amountError').addClass('d-none');
}
