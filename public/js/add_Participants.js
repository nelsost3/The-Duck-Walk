// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addParticipantsForm = document.getElementById('add-Participants-form-ajax');

// Modify the objects we need 
addParticipantsForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from 
    let inputFName = document.getElementById('inputFName');
    let inputLName = document.getElementById('inputLName');
    let inputAddress = document.getElementById('inputAddress');
    let inputCity = document.getElementById('inputCity');
    let inputState = document.getElementById('inputState');
    let inputZip = document.getElementById('inputZip');
    let inputPhone = document.getElementById('inputPhone');
    let inputEmail = document.getElementById('inputEmail');
    let inputSize = document.getElementById('inputSize');
    let inputWaiver = document.getElementById('inputWaiver');


    // Get the values from the form fields
    let valueFName = inputFName.value;
    let valueLName = inputLName.value;
    let valueAddress = inputAddress.value;
    let valueCity = inputCity.value;
    let valueState = inputState.value;
    let valueZip = inputZip.value;
    let valuePhone = inputPhone.value;
    let valueEmail = inputEmail.value;
    let valueSize = inputSize.value;
    let valueWaiver = inputWaiver.value;

    // Put our data we want to send in a javascript object 
    let data = {
        first_name: valueFName, 
        last_name: valueLName,
        address: valueAddress,
        city: valueCity,
        state: valueState,
        zip_code: valueZip,
        phone_number: valuePhone,
        email_address: valueEmail,
        shirt_size: valueSize,
        waiver_signed: valueWaiver
    }

    // Setup our AJAX request 
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-Participants-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve 
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFName.value = '';
            inputLName.value = '';
            inputAddress.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZip.value = '';
            inputPhone.value =''; 
            inputEmail.value = '';
            inputSize.value = '';
            inputWaiver.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.readyState != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object requesenting a single record from Participants
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById('Participants-table');

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a new row and 12 cells
    let row = document.createElement("TR");
    let pidCell = document.createElement("TD");
    let fnameCell = document.createElement("TD"); 
    let lnameCell = document.createElement("TD"); 
    let addressCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let sizeCell = document.createElement("TD");
    let waiverCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    pidCell.innerText = newRow.participant_id;
    fnameCell.innerText = newRow.first_name;
    lnameCell.innerText = newRow.last_name;
    addressCell.innerText = newRow.address;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    zipCell.innerText = newRow.zip_code;
    phoneCell.innerText = newRow.phone_number;
    emailCell.innerText = newRow.email_address;
    sizeCell.innerText = newRow.shirt_size;
    waiverCell.innerText = newRow.waiver_signed;
    
    let deleteIcon = '<i class="fa-solid fa-trash-can fa-lg" style="padding-right: 10px;"></i>';
    deleteCell.innerHTML = deleteIcon;
    deleteCell.onclick = function() {
        deleteParticipants(newRow.participant_id);
    };

    // Add the cells to the row 
    row.appendChild(pidCell);
    row.appendChild(fnameCell);
    row.appendChild(lnameCell);
    row.appendChild(addressCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(sizeCell);
    row.appendChild(waiverCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.participant_id);

    // Add the row to the table
    currentTable.appendChild(row);
    
    window.location.reload();
}
