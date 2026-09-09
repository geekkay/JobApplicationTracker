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

async function loadJobTypes() {
    const response = await fetch('/api/jobtypes');
    const jobTypes = await response.json();

    const jobTypeSelect = document.getElementById('jobTypeSelect');

    jobTypes.forEach(jobType => {
        const option = document.createElement('option');

        option.value = jobType.JobTypeID;
        option.textContent = jobType.JobType;

        jobTypeSelect.appendChild(option);
    });
}

loadStatuses();
loadJobTypes();

document.getElementById('applicationForm').addEventListener('submit', async event => {
    event.preventDefault();

    const application = {
        CompanyName: document.getElementById('companyName').value,
        JobTitle: document.getElementById('jobTitle').value,
        Location: document.getElementById('location').value,
        DateApplied: document.getElementById('dateApplied').value,
        StatusID: document.getElementById('statusSelect').value,
        JobTypeID: document.getElementById('jobTypeSelect').value,
        Notes: document.getElementById('notes').value
    };

    const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(application)
    });

    if (!response.ok) {
        return;
    }

    window.location.href = 'index.html';
});

document.getElementById('cancelButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

const today = new Date().toISOString().split('T')[0];

document.getElementById('dateApplied').value = today;