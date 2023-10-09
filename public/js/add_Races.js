// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addRacesForm = document.getElementById('add-Races-form-ajax');

// Modify the objects we need 
addRacesForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from 
    let inputRaceID = document.getElementById('input-race_id');
    let inputRaceType = document.getElementById('input-race_type');
    let inputRaceLocation = document.getElementById('input-race_location');
    let inputRaceDate = document.getElementById('input-race_date');
    let inputRaceTime = document.getElementById('input-race_time');
    let inputRaceEntryFee = document.getElementById('input-entry_fee');

    // Get the values from the form fields
    let raceidValue = inputRaceID.value;
    let racetypeValue = inputRaceType.value;
    let racelocationValue = inputRaceLocation.value;
    let racedateValue = inputRaceDate.value;
    let racetimeValue = inputRaceTime.value;
    let entryfeeValue = inputRaceEntryFee.value;

    // Put our data we want to send in a javascript object 
    let data = {
        race_id: raceidValue, 
        race_type: racetypeValue,
        race_location: racelocationValue,
        race_date: racedateValue,
        race_time: racetimeValue,
        entry_fee: entryfeeValue 
    }

    // Setup our AJAX request 
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-Races-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve 
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRaceID.value = '';
            inputRaceType.value = '';
            inputRaceLocation.value = '';
            inputRaceDate.value = '';
            inputRaceTime.value = '';
            inputRaceEntryFee.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.readyState != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object requesenting a single record from Races
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById('Races-table');

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new row and 6 cells
    let row = document.createElement("TR");
    let raceidCell = document.createElement("TD");
    let racetypeCell = document.createElement("TD"); 
    let racelocationCell = document.createElement("TD"); 
    let racedateCell = document.createElement("TD");
    let racetimeCell = document.createElement("TD");
    let entryfeeCell = document.createElement("TD");
    
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    raceidCell.innerText = newRow.race_id;
    racetypeCell .innerText = newRow.race_type;
    racelocationCell.innerText = newRow.race_location;
    racedateCell.innerText = newRow.race_date;
    racetimeCell.innerText = newRow.race_time;
    entryfeeCell.innerText = newRow.entry_fee;
    
    let deleteIcon = '<i class="fa-solid fa-trash-can fa-lg" style="padding-right: 10px;"></i>';
    deleteCell.innerHTML = deleteIcon;
    deleteCell.onclick = function() {
        deleteRaces(newRow.race_id);
    };

    // Add the cells to the row 
    row.appendChild(raceidCell);
    row.appendChild(racetypeCell);
    row.appendChild(racelocationCell);
    row.appendChild(racedateCell);
    row.appendChild(racetimeCell);
    row.appendChild(entryfeeCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

}
