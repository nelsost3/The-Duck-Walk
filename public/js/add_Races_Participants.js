// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addRaces_ParticipantsForm = document.getElementById('add-Races_Participants-form-ajax');

// Modify the objects we need 
addRaces_ParticipantsForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from 
    let inputRaceID = document.getElementById('input-race_id');
    let inputParticipantID = document.getElementById('input-participant_id')

    // Get the values from the form fields
    let raceidValue = inputRaceID.value;
    let participantIDValue = inputParticipantID.value

    // Put our data we want to send in a javascript object 
    let data = {
        race_id: raceidValue,
        participant_id: participantIDValue
    }

    // Setup our AJAX request 
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-Races_Participants-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve 
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRaceID.value = '';
            inputParticipantID.value = '';
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
    let currentTable = document.getElementById('Races_Participants-table');

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new row and 4 cells
    let row = document.createElement("TR");
    let assignmentidCell = document.createElement("TD");
    let raceidCell = document.createElement("TD");
    let participantidCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    assignmentidCell.innerText = newRow.assignment_id;
    raceidCell.innerText = newRow.race_id;
    participantidCell.innerText = newRow.participant_id;
    
    let deleteIcon = '<i class="fa-solid fa-trash-can fa-lg" style="padding-right: 10px;"></i>';
    deleteCell.innerHTML = deleteIcon;
    deleteCell.onclick = function() {
        deleteRaces_Participants(newRow.assignment_id);
    };

    // Add the cells to the row 
    row.appendChild(assignmentidCell);
    row.appendChild(raceidCell);
    row.appendChild(participantidCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.assignment_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    window.location.reload();
}
