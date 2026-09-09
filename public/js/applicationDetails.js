const params = new URLSearchParams(window.location.search);
const applicationId = params.get('id');

async function loadApplication() {
    const response = await fetch(`/api/applications/${applicationId}`);
    const application = await response.json();

    document.getElementById('companyName').textContent = application.CompanyName;
    document.getElementById('jobTitle').textContent = application.JobTitle;
    document.getElementById('location').textContent = application.Location;
    document.getElementById('dateApplied').textContent = application.DateApplied;
    document.getElementById('jobType').textContent = application.JobType;
    document.getElementById('notes').textContent = application.Notes;
    document.getElementById('createdAt').textContent = application.CreatedAt;
    document.getElementById('updatedAt').textContent = application.UpdatedAt;
    document.getElementById('statusSelect').value = application.StatusID;
}
async function loadStatuses() {
    const response = await fetch('/api/statuses');
    const statuses = await response.json();

    const statusSelect = document.getElementById('statusSelect');

    statuses.forEach(status => {
        const option = document.createElement('option');

        option.value = status.StatusID;
        option.textContent = status.StatusName;

        statusSelect.appendChild(option);
    });
}

async function updateStatus() {
    const statusSelect = document.getElementById('statusSelect');
    const selectedStatus = statusSelect.value;

    const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            StatusID: selectedStatus
        })
    });

    if (!response.ok) {
        return;
    }

    document.getElementById('successMessage').textContent = 'Status updated successfully.';
}
document.getElementById('updateStatusButton').addEventListener('click', updateStatus);
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

async function loadPage() {
    await loadStatuses();
    await loadApplication();
}

loadPage();