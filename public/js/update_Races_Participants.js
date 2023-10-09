// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateParticipantsByRaceForm = document.getElementById('update-ParticipantsByRace-form-ajax');

// Modify the objects we need
updateParticipantsByRaceForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateAssignmentID = document.getElementById('update-assignment_id');
    let updateRaceID = document.getElementById('update-race_id');
    let updateParticipantID = document.getElementById('update-participant_id');

    // Get the values from the form fields
    let updateAssignmentIDValue = updateAssignmentID.value;
    let updateRaceIDValue = updateRaceID.value;
    let updateParticipantIDValue = updateParticipantID.value;

    // Check that neither race nor participant was left blank
    if (isNaN(updateAssignmentIDValue))
    {
        window.alert("Assignment field cannot be left blank.");
        return;
    }
    
    if (isNaN(updateParticipantIDValue))
    {
        window.alert("Race field cannot be left blank.");
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        assignment_id: updateAssignmentIDValue, 
        race_id: updateRaceIDValue,
        participant_id: updateParticipantIDValue
    }
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-Races_Participants-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, updateAssignmentIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, assignment_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("Races_Participants-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == assignment_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let tdRace = updateRowIndex.getElementsByTagName("td")[1];
            let tdParticipant = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign to our value we updated to
            tdRace.innerHTML = parsedData[0].race_id; 
            tdParticipant.innerHTML = parsedData[0].participant_id;
       }
    }
    window.location.reload();
}
