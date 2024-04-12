document.addEventListener("DOMContentLoaded", function() {
    fetchBankHolidays();

    document.getElementById("search-button").addEventListener("click", function(event) {
        event.preventDefault();
        handleSearch();
    });

    document.addEventListener("click", function(event) {
        const searchInput = document.getElementById("search-input");
        if (!event.target.matches("#search-input")) {
            searchInput.value = "";
        }
    });

    document.getElementById("add-holiday-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.getElementById("new-holiday-title").value;
        const date = document.getElementById("new-holiday-date").value;
        const bunting = document.getElementById("new-holiday-bunting").checked;
        const newHoliday = {
            title: title,
            date: date,
            bunting: bunting
        };
        createHoliday(newHoliday);
    });

    document.getElementById("confirmation-dialog").addEventListener("click", function(event) {
        if (event.target.id === "confirm-delete") {
            const index = document.getElementById("confirmation-dialog").dataset.index;
            deleteHoliday(index);
            hideConfirmationDialog();
        } else if (event.target.id === "cancel-delete") {
            hideConfirmationDialog();
        }
    });
});

function fetchBankHolidays() {
    fetch('https://www.gov.uk/bank-holidays.json')
        .then(response => response.json())
        .then(data => {
            window.bankHolidaysData = data['england-and-wales'].events;
            displayAllHolidays(window.bankHolidaysData);
        })
        .catch(error => console.error('Error fetching bank holidays:', error));
}

function displayAllHolidays(holidays) {
    const holidaysList = document.getElementById('holidays-list');
    holidaysList.innerHTML = '';

    holidays.forEach((holiday, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('holiday-card');
        listItem.dataset.index = index;
        listItem.innerHTML = `
            <h3>${holiday.title}</h3>
            <p>Date: ${holiday.date}</p>
            <p>Bunting: ${holiday.bunting}</p>
            <button class="edit-button" onclick="editHoliday(${index})">Edit</button>
            <button class="delete-button" onclick="showConfirmationDialog(${index})">Delete</button>
        `;
        holidaysList.appendChild(listItem);
    });

    document.getElementById('no-results-message').style.display = holidays.length === 0 ? 'block' : 'none';
}

function handleSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredHolidays = window.bankHolidaysData.filter(holiday => {
        return holiday.title.toLowerCase().includes(searchInput) || holiday.date.includes(searchInput);
    });
    displayAllHolidays(filteredHolidays);
}

function createHoliday(holiday) {
    fetch('https://yourapi.com/holidays', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(holiday),
    })
    .then(response => response.json())
    .then(data => {
        fetchBankHolidays(); 
    })
    .catch(error => console.error('Error creating holiday:', error));
}

function editHoliday(index) {
    const holiday = window.bankHolidaysData[index];
    const updatedTitle = prompt("Enter updated title", holiday.title);
    if (updatedTitle === null) return; // Handle cancel
    const updatedDate = prompt("Enter updated date", holiday.date);
    if (updatedDate === null) return; // Handle cancel
    const updatedBunting = confirm("Is bunting enabled?");
    
    const updatedHoliday = {
        ...holiday,
        title: updatedTitle,
        date: updatedDate,
        bunting: updatedBunting
    };

    window.bankHolidaysData[index] = updatedHoliday;
    displayAllHolidays(window.bankHolidaysData);
    updateHoliday(updatedHoliday);
}

function showConfirmationDialog(index) {
    const confirmationDialog = document.getElementById("confirmation-dialog");
    confirmationDialog.dataset.index = index;
    confirmationDialog.style.display = "block";
}

function hideConfirmationDialog() {
    document.getElementById("confirmation-dialog").style.display = "none";
}


function updateHoliday(holiday) {
    fetch(`https://yourapi.com/holidays/${holiday.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(holiday),
    })
    .then(response => response.json())
    .then(data => {
        // Handle successful update
    })
    .catch(error => console.error('Error updating holiday:', error));
}

function deleteHolidayFromAPI(holidayId) {
    fetch(`https://yourapi.com/holidays/${holidayId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Handle successful deletion
        } else {
            throw new Error('Failed to delete holiday');
        }
    })
    .catch(error => console.error('Error deleting holiday:', error));
}
