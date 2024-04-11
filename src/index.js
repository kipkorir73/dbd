document.addEventListener("DOMContentLoaded", function() {
    // Fetch bank holidays data when the DOM content is loaded
    fetchBankHolidays();

    // Add event listener for the search button
    document.getElementById("search-button").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        handleSearch(); // Call handleSearch function to perform search
    });

    // Add event listener to detect clicks outside the search input field
    document.addEventListener("click", function(event) {
        const searchInput = document.getElementById("search-input");
        if (!event.target.matches("#search-input")) {
            searchInput.value = ""; // Clear search input field when clicked outside of it
            handleSearch(); // Call handleSearch function to display all holidays again
        }
    });

    // Add event listener for the submission of the add holiday form
    document.getElementById("add-holiday-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        // Get values from form fields
        const title = document.getElementById("new-holiday-title").value;
        const date = document.getElementById("new-holiday-date").value;
        const bunting = document.getElementById("new-holiday-bunting").checked;

        // Create a new holiday object
        const newHoliday = {
            title: title,
            date: date,
            bunting: bunting
        };

        // Call createHoliday function to add the new holiday
        createHoliday(newHoliday);
    });
});

// Function to fetch bank holidays data
function fetchBankHolidays() {
    fetch('https://www.gov.uk/bank-holidays.json')
    .then(response => response.json())
    .then(data => {
        // Store bank holidays data in window object
        window.bankHolidaysData = data['england-and-wales'].events;
        // Display all holidays
        displayAllHolidays(window.bankHolidaysData);
    })
    .catch(error => console.error('Error fetching bank holidays:', error));
}

// Function to display all holidays
function displayAllHolidays(holidays) {
    const holidaysList = document.getElementById('holidays-list');
    holidaysList.innerHTML = '';

    // Iterate through each holiday and create list item with edit and delete buttons
    holidays.forEach((holiday, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${holiday.title}</strong><br>Date: ${holiday.date}<br>Bunting: ${holiday.bunting}
        <button class="edit-button" onclick="editHoliday(${index})">Edit</button>
        <button class="delete-button" onclick="deleteHoliday(${index})">Delete</button>`;
        holidaysList.appendChild(listItem);
    });
}

// Function to handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    // Filter holidays based on search input and display filtered holidays
    const filteredHolidays = window.bankHolidaysData.filter(holiday => {
        return holiday.title.toLowerCase().includes(searchInput) || holiday.date.includes(searchInput);
    });
    displayAllHolidays(filteredHolidays);
}

// Function to create a new holiday
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

// Function to edit a holiday
function editHoliday(index) {
    // Implementation for editing a holiday goes here
}

// Function to delete a holiday
function deleteHoliday(index) {
    // Implementation for deleting a holiday goes here
}

// Function to update a holiday
function updateHoliday(holiday) {
    // Implementation for updating a holiday goes here
}

// Function to delete a holiday from the backend API
function deleteHolidayFromAPI(holidayId) {
    // Implementation for deleting a holiday from the backend API goes here
}
