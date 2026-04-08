/**
 * SendMoney.js
 * Handles money transfer functionality with contact management
 */

$(document).ready(function() {
    // Check user session
    checkUserSession();
    
    // Load send balance
    loadSendBalance();
    
    // Load saved contacts
    loadSavedContacts();
    
    // Form submit handler
    $('#sendMoneyForm').on('submit', function(e) {
        e.preventDefault();
        processTransfer();
    });

    // Contact search with autocomplete
    setupContactAutocomplete();

    // Real-time validations
    $('#transferAmount').on('input', function() {
        // Prevent decimal input
        let value = $(this).val();
        if (value && !Number.isInteger(Number(value))) {
            $(this).val(Math.floor(value));
        }
        const amount = extractTransferAmount();
        validateTransferAmount(amount);
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
 * Load current user balance for transfer
 */
function loadSendBalance() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const formattedBalance = 'CLP $' + parseInt(currentUser.balance).toLocaleString('es-CL');
        $('#sendBalance').text(formattedBalance);
    }
}

/**
 * Setup contact autocomplete with jQuery UI
 */
function setupContactAutocomplete() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactNames = contacts.map(c => ({ label: c.name, value: c.email, name: c.name }));

    $('#searchContact').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        if (searchTerm.length > 0) {
            const filtered = contactNames.filter(c => 
                c.label.toLowerCase().includes(searchTerm) || 
                c.value.toLowerCase().includes(searchTerm)
            );

            if (filtered.length > 0) {
                showContactSuggestions(filtered);
            } else {
                hideContactSuggestions();
            }
        } else {
            hideContactSuggestions();
        }
    });

    // Handle suggestion click
    $(document).on('click', '.contact-suggestion', function() {
        const email = $(this).data('email');
        const name = $(this).data('name');
        
        $('#searchContact').val(name);
        $('#recipientEmail').val(email);
        hideContactSuggestions();
    });
}

/**
 * Show contact suggestions
 */
function showContactSuggestions(suggestions) {
    const suggestionsList = $('#contactSuggestions');
    suggestionsList.empty();

    suggestions.forEach(contact => {
        const item = $(`
            <div class="contact-suggestion list-group-item" data-email="${contact.value}" data-name="${contact.label}">
                <div class="fw-bold">${contact.label}</div>
                <small class="text-muted">${contact.value}</small>
            </div>
        `);
        suggestionsList.append(item);
    });

    suggestionsList.removeClass('d-none');
}

/**
 * Hide contact suggestions
 */
function hideContactSuggestions() {
    $('#contactSuggestions').addClass('d-none').empty();
}

/**
 * Extract and parse transfer amount
 */
function extractTransferAmount() {
    const amountInput = String($('#transferAmount').val()).trim();
    if (!amountInput) return null;
    const amount = parseInt(amountInput, 10);
    return isNaN(amount) ? null : amount;
}

/**
 * Validate transfer amount
 */
function validateTransferAmount(amount) {
    const errorElement = $('#amountError');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (amount === null || isNaN(amount)) {
        errorElement.text('Ingresa un monto válido').removeClass('d-none');
        return false;
    }
    if (amount < 1) {
        errorElement.text('El monto debe ser mínimo CLP $1').removeClass('d-none');
        return false;
    }
    if (amount > currentUser.balance) {
        errorElement.text(`Saldo insuficiente. Tu saldo es CLP $${currentUser.balance.toLocaleString('es-CL')}`).removeClass('d-none');
        return false;
    }
    if (amount > 100000000) {
        errorElement.text('El monto no puede exceder CLP $100,000,000 por transferencia').removeClass('d-none');
        return false;
    }
    errorElement.addClass('d-none');
    return true;
}

/**
 * Process money transfer
 */
function processTransfer() {
    const recipientEmail = $('#recipientEmail').val().trim();
    const amount = extractTransferAmount();
    const concept = $('#transferConcept').val();

    // Validate inputs
    if (!recipientEmail || !validateTransferAmount(amount)) {
        showErrorMessage('Por favor, completa todos los campos correctamente');
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

    // Find recipient
    const recipient = users.find(u => u.email === recipientEmail);

    if (recipient && recipient.id === currentUser.id) {
        showErrorMessage('No puedes enviar dinero a tu propia cuenta');
        return;
    }

    // Update balances
    const senderIndex = users.findIndex(u => u.id === currentUser.id);
    const recipientIndex = recipient ? users.findIndex(u => u.id === recipient.id) : -1;

    if (senderIndex !== -1) {
        users[senderIndex].balance -= amount;
        if (recipientIndex !== -1) {
            users[recipientIndex].balance += amount;
        }
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user session
        currentUser.balance = users[senderIndex].balance;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Create transaction records
    const senderTransaction = {
        id: Date.now(),
        userId: currentUser.id,
        type: 'transfer',
        amount: amount,
        concept: concept || 'Transferencia',
        recipient: recipientEmail,
        date: new Date().toLocaleString('es-ES'),
        status: recipient ? 'completed' : 'pending'
    };

    transactions.push(senderTransaction);
    
    if (recipient) {
        const recipientTransaction = {
            id: Date.now() + 1,
            userId: recipient.id,
            type: 'received',
            amount: amount,
            concept: concept || 'Transferencia recibida',
            sender: currentUser.email,
            date: new Date().toLocaleString('es-ES'),
            status: 'completed'
        };
        transactions.push(recipientTransaction);
    }
    
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Show success message
    const recipientName = recipient ? recipient.name : recipientEmail;
    showSuccessMessage(`¡Transferencia de CLP $${amount.toLocaleString('es-CL')} a ${recipientName} realizada exitosamente!`);

    // Update balance and clear form
    setTimeout(() => {
        loadSendBalance();
        clearForm();
    }, 1500);
}

/**
 * Load saved contacts for display
 */
function loadSavedContacts() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactsList = $('#savedContactsList');

    if (contacts.length === 0) {
        contactsList.html('<p class="text-muted col-12">No hay contactos guardados</p>');
        return;
    }

    contactsList.empty();

    contacts.forEach(contact => {
        const contactCard = $(`
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 bg-light cursor-pointer quick-contact" data-email="${contact.email}">
                    <div class="card-body text-center">
                        <div class="mb-2">
                            <i class="bi bi-person-circle" style="font-size: 2rem; color: #007bff;"></i>
                        </div>
                        <p class="card-title fw-bold mb-1">${contact.name}</p>
                        <small class="text-muted">${contact.email}</small>
                    </div>
                </div>
            </div>
        `);
        contactsList.append(contactCard);
    });

    // Quick contact click handler
    $(document).on('click', '.quick-contact', function() {
        const email = $(this).data('email');
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        const contact = contacts.find(c => c.email === email);

        if (contact) {
            $('#searchContact').val(contact.name);
            $('#recipientEmail').val(contact.email);
            
            // Scroll to form
            $('html, body').animate({
                scrollTop: $('#sendMoneyForm').offset().top - 100
            }, 500);
        }
    });
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
    $('#sendMoneyForm')[0].reset();
    $('#recipientEmail').val('');
    $('#amountError').addClass('d-none');
}
