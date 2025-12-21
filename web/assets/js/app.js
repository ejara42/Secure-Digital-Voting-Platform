// General app JS: validations, micro-animations, accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Form validation (age, required fields, date checks)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let valid = true;
            // Required checks
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.focus();
                    showAlert('Please fill all required fields.', 'danger');
                }
            });
            // Age check for voters
            const ageInput = form.querySelector('[name="age"]');
            if (ageInput && parseInt(ageInput.value) < 18) {
                valid = false;
                ageInput.focus();
                showAlert('Voter must be at least 18 years old (NEBE requirement).', 'danger');
            }
            // Date check for elections
            const startDate = form.querySelector('[name="startDate"]');
            const endDate = form.querySelector('[name="endDate"]');
            if (startDate && endDate && new Date(endDate.value) <= new Date(startDate.value)) {
                valid = false;
                endDate.focus();
                showAlert('End date must be after start date.', 'danger');
            }
            if (!valid) e.preventDefault();
        });
    });

    // Show alert/notification
    function showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `notification ${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);
        alert.style.display = 'block';
        setTimeout(() => alert.remove(), 5000);
    }

    // AJAX load utility
    window.loadData = function(url, containerId, renderFn) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById(containerId);
                container.innerHTML = renderFn(data);
            })
            .catch(error => showAlert('Error loading data: ' + error, 'danger'));
    };

    // Keyboard navigation enhancements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal[style*="flex"]').forEach(modal => modal.style.display = 'none');
        }
    });
});