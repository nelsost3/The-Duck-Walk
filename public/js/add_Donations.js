// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addDonationsForm = document.getElementById('add-Donations-form-ajax');

// Modify the objects we need
addDonationsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputParticipantID = document.getElementById("inputParticipantID");
    let inputSponsorID = document.getElementById("inputSponsorID");
    let inputAmount = document.getElementById("inputAmount");

    // Get the values from the form fields
    let participantIDValue = inputParticipantID.value;
    let sponsorIDValue = inputSponsorID.value;
    let amountValue = inputAmount.value;

    // Put our data we want to send in a javascript object
    let data = {
        participant_id: participantIDValue,
        sponsor_id: sponsorIDValue,
        donation_amount: amountValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-Donations-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputParticipantID.value = 'NULL';
            inputSponsorID.value = 'NULL';
            inputAmount.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            console.log(data)
        }
    }

    // Send the request and wait for the response
    console.log(data);
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("Donations-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let donationCell = document.createElement("TD");
    let participantCell = document.createElement("TD");
    let sponsorCell = document.createElement("TD");
    let amountCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    donationCell.innerText = newRow.donation_id;
    participantCell.innerText = newRow.participant_id;
    sponsorCell.innerText = newRow.sponsor_id;
    amountCell.innerText = newRow.donation_amount;

    let deleteIcon = '<i class="fa-solid fa-trash-can fa-lg" style="padding-right: 10px;"></i>';
    deleteCell.innerHTML = deleteIcon;
    deleteCell.onclick = function() {
        deleteDonations(newRow.donation_id);
    };

    // Add the cells to the row 
    row.appendChild(donationCell);
    row.appendChild(participantCell);
    row.appendChild(sponsorCell);
    row.appendChild(amountCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.donation_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
    
    window.location.reload();
}
