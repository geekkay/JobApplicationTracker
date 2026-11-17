
const params = new URLSearchParams(window.location.search);
const applicationId = params.get('id');

async function loadApplication() {
    const response = await fetch(`/api/applications/${applicationId}`);
    const application = await response.json();

    document.getElementById('companyName').textContent = application.CompanyName;
    document.getElementById('jobTitle').textContent = application.JobTitle;
    document.getElementById('location').textContent = application.Location;
    document.getElementById('dateApplied').textContent = application.DateApplied.split('T')[0];
    document.getElementById('jobType').textContent = application.JobType;

    document.getElementById('notes').textContent = application.Notes || 'No notes added yet.';
    document.getElementById('notesInput').value = application.Notes || '';

    document.getElementById('createdAt').textContent = application.CreatedAt.split('T')[0];
    document.getElementById('updatedAt').textContent = application.UpdatedAt.split('T')[0];
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

function editNotes() {
    const notes = document.getElementById('notes');
    const notesInput = document.getElementById('notesInput');
    const notesEditor = document.getElementById('notesEditor');
    const editNotesButton = document.getElementById('editNotesButton');

    notesInput.value = notes.textContent === 'No notes added yet.' ? '' : notes.textContent;

    notes.hidden = true;
    editNotesButton.hidden = true;
    notesEditor.hidden = false;
}

function cancelNotes() {
    document.getElementById('notesEditor').hidden = true;
    document.getElementById('notes').hidden = false;
    document.getElementById('editNotesButton').hidden = false;
    document.getElementById('notesMessage').textContent = '';
}

async function saveNotes() {
    const notesInput = document.getElementById('notesInput');
    const notesMessage = document.getElementById('notesMessage');
    const saveButton = document.getElementById('saveNotesButton');

    const notes = notesInput.value;

    saveButton.disabled = true;
    notesMessage.textContent = 'Saving...';

    try {
        const response = await fetch(`/api/applications/${applicationId}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Notes: notes
            })
        });

        if (!response.ok) {
            notesMessage.textContent = 'Failed to save notes.';
            return;
        }

        const application = await response.json();

        document.getElementById('notes').textContent = application.Notes || 'No notes added yet.';
        document.getElementById('updatedAt').textContent = application.UpdatedAt.split('T')[0];

        document.getElementById('notesEditor').hidden = true;
        document.getElementById('notes').hidden = false;
        document.getElementById('editNotesButton').hidden = false;

        notesMessage.textContent = 'Notes saved successfully.';

    } catch (error) {
        notesMessage.textContent = 'An error occurred while saving notes.';
    } finally {
        saveButton.disabled = false;
    }
}

document.getElementById('updateStatusButton').addEventListener('click', updateStatus);
document.getElementById('editNotesButton').addEventListener('click', editNotes);
document.getElementById('cancelNotesButton').addEventListener('click', cancelNotes);
document.getElementById('saveNotesButton').addEventListener('click', saveNotes);

document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

async function loadPage() {
    await loadStatuses();
    await loadApplication();
}

loadPage();
