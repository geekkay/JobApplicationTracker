let applications = [];
async function loadApplications() {
    const response = await fetch('/api/applications');
    applications = await response.json();

    renderApplications(applications);
}

async function loadStatuses() {
    const response = await fetch('/api/statuses');
    const statuses = await response.json();

    const statusFilter = document.getElementById('statusFilter');

    statuses.forEach(status => {
        const option = document.createElement('option');

        option.value = status.StatusID;
        option.textContent = status.StatusName;

        statusFilter.appendChild(option);
    });
}

function renderApplications(applicationList) {
    const tableBody = document.getElementById('applicationsTableBody');

    tableBody.innerHTML = '';

    applicationList.forEach(application => {
        const row = document.createElement('tr');

        row.addEventListener('click', () => {
            window.location.href = `applicationDetails.html?id=${application.ApplicationID}`;
        });

        row.innerHTML = `
            <td>${application.CompanyName}</td>
            <td>${application.JobTitle}</td>
            <td>${application.DateApplied}</td>
            <td>${application.StatusName}</td>
            <td>${application.JobType}</td>
        `;

        tableBody.appendChild(row);
    });
}

loadApplications();
loadStatuses();

document.getElementById('statusFilter').addEventListener('change', event => {
    const selectedStatus = event.target.value;

    if (selectedStatus === '') {
        renderApplications(applications);
        return;
    }

    const filteredApplications = applications.filter(
        application => application.StatusID == selectedStatus
    );

    renderApplications(filteredApplications);
});

document.getElementById('addApplicationButton').addEventListener('click', () => {
    window.location.href = 'addApplications.html';
});