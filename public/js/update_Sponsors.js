// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateSponsorsForm = document.getElementById('update-Sponsors-form-ajax');

// Modify the objects we need
updateSponsorsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSponsorID = document.getElementById('mySelect');
    let inputSponsorName = document.getElementById('updateSponsorName');
    let inputContact = document.getElementById('updateContact');
    let inputPhone = document.getElementById('updatePhone');
    let inputEmail = document.getElementById('updateEmail');
    let inputLevel = document.getElementById('updateLevel');

    // Get the values from the form fields
    let sponsoridValue = inputSponsorID.value;
    let sponsornameValue = inputSponsorName.value;
    let contactValue = inputContact.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;
    let levelValue = inputLevel.value
    
    // if (isNaN(sponsoridValue)) / return

    if (isNaN(sponsoridValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        sponsor_id: sponsoridValue, 
        sponsor_name: sponsornameValue,
        sponsor_contact: contactValue,
        sponsor_phone: phoneValue,
        sponsor_email: emailValue,
        sponsorship_level: levelValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-Sponsors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, levelValue);
            updateRow(xhttp.response, costValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, sponsorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("Sponsors-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == sponsorID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign to our value we updated to
            td.innerHTML = parsedData[0].sponsor_id;
            td.innerHTML = parsedData[0].sponsor_name; 
            td.innerHTML = parsedData[0].sponsor_contact;
            td.innerHTML = parsedData[0].sponsor_phone;
            td.innerHTML = parsedData[0].sponsorship_level;

       }
    }
    
    window.location.reload();
}
