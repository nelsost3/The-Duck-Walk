// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addSponsorshipLevelsForm = document.getElementById('add-SponsorshipLevels-form-ajax');

// Modify the objects we need 
addSponsorshipLevelsForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from 
    let inputLevel = document.getElementById('input-level');
    let inputCost = document.getElementById('input-cost');
    let inputDescription = document.getElementById('input-description');
    let inputFreeDuckEntries = document.getElementById('input-free_duck_entries');

    // Get the values from the form fields
    let levelValue = inputLevel.value;
    let costValue = inputCost.value;
    let descriptionValue = inputDescription.value;
    let freeDuckEntriesValue = inputFreeDuckEntries.value;

    // Put our data we want to send in a javascript object 
    let data = {
        level: levelValue, 
        cost: costValue,
        description: descriptionValue,
        free_duck_entries: freeDuckEntriesValue
    }

    // Setup our AJAX request 
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-SponsorshipLevels-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve 
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputLevel.value = '';
            inputCost.value = '';
            inputDescription.value = '';
            inputFreeDuckEntries.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.readyState != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object requesenting a single record from SponsorshipLevels
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById('SponsorshipLevels-table');

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new row and 6 cells
    let row = document.createElement("TR");
    let levelCell = document.createElement("TD");
    let costCell = document.createElement("TD"); 
    let descriptionCell = document.createElement("TD"); 
    let freeDuckEntriesCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    levelCell.innerText = newRow.level;
    costCell.innerText = newRow.cost;
    descriptionCell.innerText = newRow.description;
    freeDuckEntriesCell.innerText = newRow.free_duck_entries;
    
    deleteCell.innerHTML = '<i class="fa-solid fa-trash-can fa-lg"></i>';
    deleteCell.onclick = function() {
        deleteParticipant(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(levelCell);
    row.appendChild(costCell);
    row.appendChild(descriptionCell);
    row.appendChild(freeDuckEntriesCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    window.location.reload();
}
