/**
 * Transactions.js
 * Handles transaction history display and filtering
 */

$(document).ready(function() {
    // Check user session
    checkUserSession();
    
    // Load transactions
    loadTransactions();
    
    // Filter handlers
    $('#filterType').on('change', function() {
        loadTransactions();
    });

    $('#sortOrder').on('change', function() {
        loadTransactions();
    });

    // Logout handler
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        handleLogout();
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
 * Load and display transactions
 */
function loadTransactions() {
    try {
        const currentUserData = localStorage.getItem('currentUser');
        const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const filterType = $('#filterType').val();
        const sortOrder = $('#sortOrder').val();

        // Filter transactions for current user
        let userTransactions = allTransactions.filter(t => t.userId === currentUser.id);

        // Apply type filter
        if (filterType) {
            userTransactions = userTransactions.filter(t => t.type === filterType);
        }

        // Apply sort order - Default is descending (most recent first)
        if (sortOrder === 'asc') {
            userTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        // Display transactions
        displayTransactions(userTransactions);
        
        // Update summary stats
        updateSummaryStats(allTransactions, currentUser.id);
    } catch (error) {
        console.error('Error loading transactions:', error);
        displayTransactions([]);
    }
}

/**
 * Display transactions in table
 */
function displayTransactions(transactions) {
    const tbody = $('#transactionsBody');
    const emptyState = $('#emptyState');

    if (transactions.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    No hay movimientos registrados
                </td>
            </tr>
        `);
        emptyState.removeClass('d-none');
        return;
    }

    emptyState.addClass('d-none');
    tbody.empty();

    transactions.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tbody.append(row);
    });

    // Add animation
    tbody.find('tr').each(function(index) {
        $(this).css('opacity', '0').delay(index * 50).animate({ opacity: 1 }, 300);
    });
}

/**
 * Create transaction row HTML
 */
function createTransactionRow(transaction) {
    const amount = parseInt(transaction.amount);
    let typeLabel = '';
    let typeBadge = '';
    let amountClass = '';

    if (transaction.type === 'deposit') {
        typeLabel = 'Depósito';
        typeBadge = '<span class="badge badge-success">Depósito</span>';
        amountClass = 'text-success';
    } else if (transaction.type === 'transfer') {
        typeLabel = 'Transferencia Enviada';
        typeBadge = '<span class="badge badge-danger">Enviado</span>';
        amountClass = 'text-danger';
    } else if (transaction.type === 'received') {
        typeLabel = 'Transferencia Recibida';
        typeBadge = '<span class="badge badge-success">Recibido</span>';
        amountClass = 'text-success';
    }

    const row = $(`
        <tr>
            <td>
                <small>${transaction.date}</small>
            </td>
            <td>
                ${typeBadge}
            </td>
            <td>
                <strong>${transaction.concept}</strong>
                <br>
                <small class="text-muted">
                    ${transaction.recipient ? 'A: ' + transaction.recipient : ''}
                    ${transaction.sender ? 'De: ' + transaction.sender : ''}
                </small>
            </td>
            <td class="${amountClass}">
                <strong>
                    ${transaction.type === 'transfer' ? '- ' : '+ '}
                    CLP $${amount.toLocaleString('es-CL')}
                </strong>
            </td>
            <td>
                <span class="badge badge-success">${transaction.status === 'completed' ? 'Completada' : 'Pendiente'}</span>
            </td>
        </tr>
    `);

    return row;
}

/**
 * Update summary statistics
 */
function updateSummaryStats(allTransactions, userId) {
    let totalDeposited = 0;
    let totalTransferred = 0;
    let totalReceived = 0;

    allTransactions.forEach(transaction => {
        if (transaction.userId === userId) {
            if (transaction.type === 'deposit') {
                totalDeposited += parseInt(transaction.amount);
            } else if (transaction.type === 'transfer') {
                totalTransferred += parseInt(transaction.amount);
            } else if (transaction.type === 'received') {
                totalReceived += parseInt(transaction.amount);
            }
        }
    });

    $('#totalDeposited').text('CLP $' + totalDeposited.toLocaleString('es-CL'));
    $('#totalTransferred').text('CLP $' + totalTransferred.toLocaleString('es-CL'));
    $('#totalReceived').text('CLP $' + totalReceived.toLocaleString('es-CL'));

    // Animate numbers
    animateNumbers();
}

/**
 * Animate number updates
 */
function animateNumbers() {
    const cards = $('.col-md-4');
    
    cards.each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'scale(0.95)'
        }).animate({
            'opacity': '1'
        }, 400, function() {
            $(this).css('transform', 'scale(1)');
        });
    });
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

/**
 * Export transactions to CSV (utility function)
 */
function exportTransactionsToCSV() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    let csv = 'Fecha,Tipo,Concepto,Monto,Estado\n';
    
    allTransactions
        .filter(t => t.userId === currentUser.id)
        .forEach(t => {
            csv += `"${t.date}","${t.type}","${t.concept}","${t.amount}","${t.status}"\n`;
        });

    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `transacciones_${Date.now()}.csv`);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
