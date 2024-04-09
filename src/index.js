// src/index.js

document.addEventListener("DOMContentLoaded", function() {
    fetchBankHolidays();

    document.getElementById("search-button").addEventListener("click", function(event) {
        event.preventDefault();
        handleSearch();
    });

    document.getElementById("search-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    });

    document.addEventListener("click", function(event) {
        const searchInput = document.getElementById("search-input");
        if (!event.target.matches("#search-input")) {
            searchInput.value = ""; // Clear search input field when clicked outside of it
            handleSearch(); // Handle search to display all holidays again
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

    holidays.forEach(holiday => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${holiday.title}</strong><br>Date: ${holiday.date}<br>Bunting: ${holiday.bunting}`;
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
