// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addSponsorsForm = document.getElementById('add-Sponsors-form-ajax');

// Modify the objects we need 
addSponsorsForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from 
    let inputSponsorName = document.getElementById("inputSponsorName");
    let inputContact = document.getElementById("inputContact");
    let inputPhone = document.getElementById("inputPhone");
    let inputEmail = document.getElementById("inputEmail");
    let inputLevel = document.getElementById("inputLevel");

    // Get the values from the form fields
    let sponsorNameValue = inputSponsorName.value;
    let contactValue = inputContact.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;
    let levelValue = inputLevel.value;

    // Put our data we want to send in a javascript object 
    let data = {
        sponsor_name: sponsorNameValue,
        sponsor_contact: contactValue,
        sponsor_phone: phoneValue, 
        sponsor_email: emailValue,
        sponsorship_level: levelValue
    }

    // Setup our AJAX request 
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-Sponsors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Add the new data to the table
            addRowToTable(xhttp.response);
            
            // Clear the input fields for another transaction
            inputSponsorName.value = '';
            inputContact.value = '';
            inputPhone.value = '';
            inputEmail.value = '';
            inputLevel.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object requesenting a single record from Sponsors
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("Sponsors-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a new row and 7 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let sponsorNameCell = document.createElement("TD");
    let contactCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let levelCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.sponsor_id;
    sponsorNameCell.innerText = newRow.sponsor_name;
    contactCell.innerText = newRow.sponsor_contact;
    phoneCell.innerText = newRow.sponsor_phone; 
    emailCell.innerText = newRow.sponsor_email;
    levelCell.innerText = newRow.sponsorship_level;

    let deleteIcon = '<i class="fa-solid fa-trash-can fa-lg" style="padding-right: 10px;"></i>';
    deleteCell.innerHTML = deleteIcon;
    deleteCell.onclick = function() {
        deleteSponsors(newRow.sponsor_id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(sponsorNameCell);
    row.appendChild(contactCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);   
    row.appendChild(levelCell);
    row.appendChild(deleteCell);

    currentTable.appendChild(row);
    
    window.location.reload();

}
