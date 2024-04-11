document.addEventListener("DOMContentLoaded", function() {
    fetchBankHolidays();

    document.getElementById("search-button").addEventListener("click", function(event) {
        event.preventDefault();
        handleSearch();
    });

    document.addEventListener("click", function(event) {
        const searchInput = document.getElementById("search-input");
        if (!event.target.matches("#search-input")) {
            searchInput.value = ""; // Clear search input field when clicked outside of it
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
        listItem.innerHTML = `<strong>${holiday.title}</strong><br>Date: ${holiday.date}<br>Bunting: ${holiday.bunting}
        <button class="edit-button" onclick="editHoliday(${index})">Edit</button>
        <button class="delete-button" onclick="deleteHoliday(${index})">Delete</button>`;
        holidaysList.appendChild(listItem);
    });
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
        fetchBankHolidays(); // Refresh the holidays list after creating a new holiday
    })
    .catch(error => console.error('Error creating holiday:', error));
}

function editHoliday(index) {
    const holiday = window.bankHolidaysData[index];
    const updatedTitle = prompt("Enter updated title", holiday.title);
    const updatedDate = prompt("Enter updated date", holiday.date);
    const updatedBunting = confirm("Is bunting enabled?");
    
    const updatedHoliday = {
        ...holiday,
        title: updatedTitle,
        date: updatedDate,
        bunting: updatedBunting
    };

    // Update the holiday in the array
    window.bankHolidaysData[index] = updatedHoliday;

    // Update the displayed holidays
    displayAllHolidays(window.bankHolidaysData);

    // Send API request to update the holiday in the backend
    updateHoliday(updatedHoliday);
}

function deleteHoliday(index) {
    const holiday = window.bankHolidaysData[index];

    // Remove the holiday from the array
    window.bankHolidaysData.splice(index, 1);

    // Update the displayed holidays
    displayAllHolidays(window.bankHolidaysData);

    // Send API request to delete the holiday from the backend
    deleteHolidayFromAPI(holiday.id);
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
