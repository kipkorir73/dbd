// This event listener triggers when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Fetch bank holidays data from an external API
    fetchBankHolidays();

    // Event listener for the search button click
    document.getElementById("search-button").addEventListener("click", function(event) {
        event.preventDefault();
        handleSearch();
    });

    // Event listener to clear the search input field when clicked outside of it
    document.addEventListener("click", function(event) {
        const searchInput = document.getElementById("search-input");
        if (!event.target.matches("#search-input")) {
            searchInput.value = ""; // Clear search input field when clicked outside of it
        }
    });

    // Event listener for submitting the add holiday form
    document.getElementById("add-holiday-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Retrieve values from form fields
        const title = document.getElementById("new-holiday-title").value;
        const date = document.getElementById("new-holiday-date").value;
        const bunting = document.getElementById("new-holiday-bunting").checked;

        // Create a new holiday object
        const newHoliday = {
            title: title,
            date: date,
            bunting: bunting
        };

        // Call function to create holiday
        createHoliday(newHoliday);
    });
});

// Function to fetch bank holidays from an external API
function fetchBankHolidays() {
    fetch('https://www.gov.uk/bank-holidays.json')
    .then(response => response.json())
    .then(data => {
        // Store bank holidays data in a global variable
        window.bankHolidaysData = data['england-and-wales'].events;
        // Display all holidays on the webpage
        displayAllHolidays(window.bankHolidaysData);
    })
    .catch(error => console.error('Error fetching bank holidays:', error));
}

// Function to display all holidays on the webpage
function displayAllHolidays(holidays) {
    const holidaysList = document.getElementById('holidays-list');
    holidaysList.innerHTML = '';

    // Loop through each holiday and create list items to display them
    holidays.forEach((holiday, index) => {
        const listItem = document.createElement('li');
        // Populate list item with holiday details and buttons for editing and deleting
        listItem.innerHTML = `<strong>${holiday.title}</strong><br>Date: ${holiday.date}<br>Bunting: ${holiday.bunting}
        <button class="edit-button" onclick="editHoliday(${index})">Edit</button>
        <button class="delete-button" onclick="deleteHoliday(${index})">Delete</button>`;
        holidaysList.appendChild(listItem);
    });
}

// Function to handle search functionality
function handleSearch() {
    // Retrieve search input value
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    // Filter holidays based on search input
    const filteredHolidays = window.bankHolidaysData.filter(holiday => {
        return holiday.title.toLowerCase().includes(searchInput) || holiday.date.includes(searchInput);
    });
    // Display filtered holidays
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
        // Refresh the holidays list after creating a new holiday
        fetchBankHolidays(); 
    })
    .catch(error => console.error('Error creating holiday:', error));
}

// Function to edit a holiday
function editHoliday(index) {
    // Retrieve holiday details
    const holiday = window.bankHolidaysData[index];
    // Prompt user to enter updated details
    const updatedTitle = prompt("Enter updated title", holiday.title);
    const updatedDate = prompt("Enter updated date", holiday.date);
    const updatedBunting = confirm("Is bunting enabled?");
    
    // Create updated holiday object
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

// Function to delete a holiday
function deleteHoliday(index) {
    // Retrieve holiday details
    const holiday = window.bankHolidaysData[index];

    // Remove the holiday from the array
    window.bankHolidaysData.splice(index, 1);

    // Update the displayed holidays
    displayAllHolidays(window.bankHolidaysData);

    // Send API request to delete the holiday from the backend
    deleteHolidayFromAPI(holiday.id);
}

// Function to update a holiday
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

// Function to delete a holiday from the backend
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
