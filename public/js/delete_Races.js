// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteRaces(race_id) {
    let link = '/delete-Races-ajax/';
    let data = {
        race_id: race_id
    };
  
    // Setup our AJAX request
    $.ajax({
        url: link, 
        type: 'DELETE', 
        data: JSON.stringify(data), 
        contentType: "application/json; charset=utf-8", 
        success: function(result) {
            
            //Add the new data to the table
            deleteRow(race_id);
        }
    });
  }
  
  function deleteRow(race_id){
    let table = document.getElementById("Races-table");
      
    // Iterate through the table rows
    for (let i = 0, row; row = table.rows[i]; i++) {
        
        // Locate the matching row and delete
        if (table.rows[i].getAttribute("data-value") == race_id) {
            table.deleteRow(i);
            break;
        }
    }
    window.location.reload();
  }
