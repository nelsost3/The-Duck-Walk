// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addVolunteersForm = document.getElementById('add-Volunteers-form-ajax');

// Modify the objects we need 
addVolunteersForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from 
    let inputFirstName = document.getElementById('input-first_name');
    let inputLastName = document.getElementById('input-last_name');
    let inputPhoneNumber = document.getElementById('input-phone_number');
    let inputEmployer = document.getElementById('input-employer');
    let inputSponsorID = document.getElementById('input-sponsor_id');
    let inputShirtSize = document.getElementById('inputSize');
    let inputWaiverSigned = document.getElementById('inputWaiver');

    // Get the values from the form fields
    let firstnameValue = inputFirstName.value;
    let lastnameValue = inputLastName.value;
    let phonenumberValue = inputPhoneNumber.value;
    let employerValue = inputEmployer.value;
    let sponsoridValue = inputSponsorID.value;
    let shirtsizeValue = inputShirtSize.value;
    let waiversignedValue = inputWaiverSigned.value;

    // Put our data we want to send in a javascript object 
    let data = {
        first_name: firstnameValue ,
        last_name: lastnameValue,
        phone_number: phonenumberValue,
        employer: employerValue,
        sponsor_id: sponsoridValue,
        shirt_size: shirtsizeValue,
        waiver_signed: waiversignedValue
    }

    // Setup our AJAX request 
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-Volunteers-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve 
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputPhoneNumber.value = '';
            inputEmployer = '';
            inputSponsorID = '';
            inputShirtSize = '';
            inputWaiverSigned = '';

        }

        else if (xhttp.readyState == 4 && xhttp.readyState != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(data);
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object requesenting a single record from Volunteers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById('Volunteers-table');

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new row and 8 cells
    let row = document.createElement("TR");
    let volunteeridCell = document.createElement("TD");
    let firstnameCell = document.createElement("TD"); 
    let lastnameCell = document.createElement("TD"); 
    let phonenumberCell = document.createElement("TD");
    let employerCell = document.createElement("TD"); 
    let sponsoridCell = document.createElement("TD"); 
    let shirtsizeCell = document.createElement("TD");
    let waiversignedCell = document.createElement("TD");
    
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    volunteeridCell.innerText = newRow.volunteer_id;
    firstnameCell.innerText = newRow.first_name;
    lastnameCell.innerText = newRow.last_name;
    phonenumberCell.innerText = newRow.phone_number;
    employerCell.innerText = newRow.employer;
    sponsoridCell.innerText = newRow.sponsor_id;
    shirtsizeCell.innerText = newRow.shirt_size;
    waiversignedCell.innerText = newRow.waiver_signed;
    
    deleteCell.innerHTML = '<i class="fa-solid fa-trash-can fa-lg"></i>';
    deleteCell.onclick = function() {
        deleteParticipant(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(volunteeridCell);
    row.appendChild(firstnameCell);
    row.appendChild(lastnameCell);
    row.appendChild(phonenumberCell);
    row.appendChild(employerCell);
    row.appendChild(sponsoridCell);
    row.appendChild(shirtsizeCell);
    row.appendChild(waiversignedCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload();
}
