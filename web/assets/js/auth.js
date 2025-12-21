// Auth JS: login/register validations, anonymity prompts
function validateLogin(formId) {
    const form = document.getElementById(formId);
    const username = form.querySelector('[name="username"]');
    const password = form.querySelector('[name="password"]');
    if (!username.value || !password.value) {
        showAlert('Username and password required.', 'danger');
        return false;
    }
    return true;
}

function validateRegistration(formId) {
    const form = document.getElementById(formId);
    const voterId = form.querySelector('[name="voterId"]');
    if (voterId && !/^[A-Z0-9]{10}$/.test(voterId.value)) {
        showAlert('Voter ID must be 10 alphanumeric characters (NEBE format).', 'danger');
        return false;
    }
    return true;
}

// Anonymity prompt for voting
function confirmVote() {
    return confirm('Your vote is anonymous and secure (NEBE compliant). Proceed?');
}