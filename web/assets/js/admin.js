// Admin JS: sidebar toggle, modals, dynamic loads, charts
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('nav.sidebar');
    if (hamburger) {
        hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // Highlight active nav
    const links = document.querySelectorAll('nav.sidebar a');
    links.forEach(link => {
        if (link.href.endsWith(window.location.pathname.split('/').pop())) link.classList.add('active');
    });

    // Modal handlers
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(btn.dataset.modalOpen).style.display = 'flex';
        });
    });
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.modal').style.display = 'none');
    });

    // Export functions
    window.exportReport = () => window.location.href = '/admin/export/logs';
    window.exportResults = () => window.location.href = '/admin/export/results';

    // Chart init (for results/dashboard)
    window.initChart = function(containerId, type = 'bar', data) {
        const ctx = document.getElementById(containerId).getContext('2d');
        new Chart(ctx, {
            type,
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.values,
                    backgroundColor: [var(--secondary), var(--accent), var(--danger)],
                    borderColor: var(--text),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: var(--text), font: { size: 16 } } } },
                scales: { y: { ticks: { color: var(--text) } } }
            }
        });
    };

    // Load calls for specific pages
    if (document.getElementById('logs-container')) loadData('/admin/logs', 'logs-container', data => data.map(log => `
        <div class="card" tabindex="0" aria-label="Log: ${log.action}">
            <h3>${log.timestamp}</h3>
            <p>${log.action} (Anonymous for NEBE compliance)</p>
        </div>`).join(''));
    if (document.getElementById('candidates-list')) loadData('/admin/candidates', 'candidates-list', data => data.map(c => `
        <div class="card" tabindex="0" aria-label="Candidate: ${c.name}">
            <h3>${c.name}</h3>
            <p>Party: ${c.party}</p>
            <button data-modal-open="editCandidateModal">Edit</button>
            <button class="danger">Delete</button>
        </div>`).join(''));
    if (document.getElementById('elections-list')) loadData('/admin/elections', 'elections-list', data => data.map(e => `
        <div class="card" tabindex="0" aria-label="Election: ${e.name}">
            <h3>${e.name}</h3>
            <p>Start: ${e.startDate} | End: ${e.endDate}</p>
            <span class="badge ${e.is_active ? 'active' : ''}">${e.is_active ? 'Active' : 'Ended'}</span>
            <button data-modal-open="editElectionModal">Edit</button>
        </div>`).join(''));
    if (document.getElementById('resultsChart')) {
        // Example data; fetch real from backend
        initChart('resultsChart', 'bar', { labels: ['Cand1', 'Cand2'], values: [120, 190], label: 'Votes' });
    }
    if (document.getElementById('dashboard-stats')) {
        initChart('turnoutChart', 'pie', { labels: ['Voted', 'Pending'], values: [45, 55], label: 'Turnout %' });
    }
});