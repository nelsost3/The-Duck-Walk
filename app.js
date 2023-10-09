// Citation Scope: - Developing Node.JS pages / CRUD abilties and HBS Webpages for project
// Date: 3/16/2023
// Originality: Adapted from Node.JS starter guide from Exploration - Developing in Node.JS
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Express
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
PORT = 3887;

// Database
var db = require('./database/db-connector')

// Connecting Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        res.render('index');
    });

//////////////////////////////////////////////////////////////////////////////////////
// GET ROUTES

app.get('/Participants', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.searchName === undefined)
    {
        query1 = `SELECT participant_id AS ID, CONCAT(first_name, ' ', last_name) AS Name, address AS Address, city AS City, state AS State, zip_code AS "Zip Code", 
                    phone_number AS Phone, email_address AS Email, shirt_size AS "Shirt Size", waiver_signed AS "Waiver Signed?" 
                FROM Participants;`
    }

    // If there is a query string, we assume this is a search, and return desired results
    else 
    {
        query1 = `SELECT participant_id AS ID, CONCAT(first_name, ' ', last_name) AS Name, address AS Address, city AS City, state AS State, zip_code AS "Zip Code", phone_number AS Phone, email_address AS Email, shirt_size AS "Shirt Size", waiver_signed AS "Waiver Signed?" 
                FROM Participants 
                WHERE CONCAT(first_name, ' ', last_name) LIKE "%${req.query.searchName}%";`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // // Save the Participant IDs
        let pid = rows;
        
        // return ('Participants', {data: pid});
        return res.render('Participants', {data: pid});
    })          
});

app.get('/Races', function(req, res)
    {
        // Declare Query 1
        let query1;

        // If there is no query string, we just perform a basic SELECT
        if (req.query.searchRace === undefined)
        {
            query1 = `SELECT race_id AS ID, race_type as Race, race_location AS Location, race_date AS Date, race_time AS Time, entry_fee AS "Entry Fee" 
                    FROM Races;`;
        }

        // If there is a query string, we assume this is a search, and return desired results
        else 
        {
            query1 = `SELECT race_id AS ID, race_type as Race, race_location AS Location, race_date AS Date, race_time AS Time, entry_fee AS "Entry Fee" 
                    FROM Races WHERE race_id LIKE "%${req.query.searchRace}%" OR race_type LIKE "%${req.query.searchRace}%";`;
        }

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // // Save the Race IDs
            let race_id = rows;
            
            // return res.render('Races', {data: race_id});
            return res.render('Races', {data: race_id});
        })          
});

app.get('/ParticipantsByRace', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.searchRaceParticipant === undefined)
    {
        query1 = `SELECT Races_Participants.assignment_id AS ID, Races.race_type AS Race, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant 
                FROM Races_Participants 
                    LEFT OUTER JOIN Races ON Races_Participants.race_id = Races.race_id 
                    LEFT OUTER JOIN Participants ON Races_Participants.participant_id = Participants.participant_id;`;
    }

    // If there is a query string, we assume this is a search, and return desired results
    else 
    {
        query1 = `SELECT Races_Participants.assignment_id AS ID, Races.race_type AS Race, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant 
                FROM Races_Participants 
                    LEFT OUTER JOIN Races ON Races_Participants.race_id = Races.race_id 
                    LEFT OUTER JOIN Participants ON Races_Participants.participant_id = Participants.participant_id 
                WHERE Races.race_type LIKE "%${req.query.searchRaceParticipant}%" OR CONCAT(Participants.first_name, ' ', Participants.last_name) LIKE "%${req.query.searchRaceParticipant}%";`;
    }

    let query2 = `SELECT * FROM Races;`;

    let query3 = `SELECT * FROM Participants;`;

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // // Save the Assignments
        let assignments = rows;

        db.pool.query(query2, function(err, rows, fields) {

            let races = rows;
            
            db.pool.query(query3, function(err, rows, fields) {

                let participants = rows;

                return res.render('ParticipantsByRace', {data: assignments, races: races, participants: participants});                    
            })
        })
        

    })          
});

app.get('/Volunteers', function(req, res)
    {
     // Declare Query 1
     let query1;
     
     if (req.query.searchName === undefined) {
        query1 = `SELECT Volunteers.volunteer_id AS ID, CONCAT(Volunteers.first_name, " ", Volunteers.last_name) AS "Name", Volunteers.phone_number AS Phone, Volunteers.employer AS Employer, Sponsors.sponsor_name AS Sponsor, Volunteers.shirt_size AS "Shirt Size", Volunteers.waiver_signed AS "Waiver Signed?" 
                FROM Volunteers 
                    LEFT OUTER JOIN Sponsors ON Volunteers.sponsor_id = Sponsors.sponsor_id;`;
     } 
     else {
        query1 = `SELECT Volunteers.volunteer_id AS ID, CONCAT(Volunteers.first_name, " ", Volunteers.last_name) AS "Name", Volunteers.phone_number AS Phone, Volunteers.employer AS Employer, Sponsors.sponsor_name AS Sponsor, Volunteers.shirt_size AS "Shirt Size", Volunteers.waiver_signed AS "Waiver Signed?" 
                FROM Volunteers 
                    LEFT OUTER JOIN Sponsors ON Volunteers.sponsor_id = Sponsors.sponsor_id
                WHERE CONCAT(Volunteers.first_name, " ", Volunteers.last_name) LIKE '%${req.query.searchName}%' OR Sponsors.sponsor_name LIKE '%${req.query.searchName}%';`;
     }
     
     // Query 2 is the same in both cases
     let query2 = "SELECT * FROM Sponsors;";
 
     // Run the 1st query
     db.pool.query(query1, function(error, rows, fields){

         // Save the Volunteers
         let volunteers = rows;
         
         // Run the second query
         db.pool.query(query2, (error, rows, fields) => {
             
            // Save the Sponsors
             let sponsors = rows;
            
             return res.render('Volunteers', {data: volunteers, sponsors: sponsors});
         })  
})});

app.get('/VolunteersByRace', function(req, res)
    {
        // Declare Query 1
        let query1;

        // If there is no query string, we just perform a basic SELECT
        if (req.query.searchRaceVolunteer === undefined)
        {
            query1 = `SELECT Races_Volunteers.assignment_id AS ID, Races.race_type AS Race, CONCAT(Volunteers.first_name, ' ', Volunteers.last_name) AS Volunteer 
                    FROM Races_Volunteers 
                        LEFT OUTER JOIN Races ON Races_Volunteers.race_id = Races.race_id 
                        LEFT OUTER JOIN Volunteers ON Races_Volunteers.volunteer_id = Volunteers.volunteer_id;`;
        }

        // If there is a query string, we assume this is a search, and return desired results
        else 
        {
            query1 = `SELECT Races_Volunteers.assignment_id AS ID, Races.race_type AS Race, CONCAT(Volunteers.first_name, ' ', Volunteers.last_name) AS Volunteer 
                    FROM Races_Volunteers 
                        LEFT OUTER JOIN Races ON Races_Volunteers.race_id = Races.race_id 
                        LEFT OUTER JOIN Volunteers ON Races_Volunteers.volunteer_id = Volunteers.volunteer_id 
                    WHERE Races.race_type LIKE "%${req.query.searchRaceVolunteer}%" OR CONCAT(Volunteers.first_name, ' ', Volunteers.last_name) LIKE "%${req.query.searchRaceVolunteer}%";`;
        }

        let query2 = `SELECT * FROM Races;`;

        let query3 = `SELECT * FROM Volunteers;`;

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the Assignments
            let assignments = rows;

            db.pool.query(query2, function(err, rows, fields) {

                let races = rows;

                db.pool.query(query3, function(err, rows, fields) {

                    let volunteers = rows;             

                    return res.render('VolunteersByRace', {data: assignments, races: races, volunteers: volunteers});                    
                })
            })          
        })          
});

app.get('/Sponsors', function(req, res)
    {
        let query1;
        
        if (req.query.sponsor_name === undefined) {
            query1 = `SELECT sponsor_id AS ID, sponsor_name AS Sponsor, sponsor_contact AS Contact, sponsor_phone AS Phone, sponsor_email AS Email, sponsorship_level AS "Sponsorship Level" 
                    FROM Sponsors;`;
        } 
        
        else {
            query1 = `SELECT sponsor_id AS ID, sponsor_name AS Sponsor, sponsor_contact AS Contact, sponsor_phone AS Phone, sponsor_email AS Email, sponsorship_level AS "Sponsorship Level" 
                    FROM Sponsors 
                    WHERE sponsor_name LIKE "%${req.query.sponsor_name}%";`
        }

        let query2 = `SELECT * FROM SponsorshipLevels;`;

        db.pool.query(query1, function (err, rows, fields) {
            let sponsors = rows;

            db.pool.query(query2, function (err, rows, fields) {
                let levels = rows;

                return res.render('Sponsors', {data: sponsors, levels: levels});
            })
        })
});

app.get('/SponsorshipLevels', function(req, res)
    {
        // Declare Query 1
        let query1;

        // If there is no query string, we just perform a basic SELECT
        if (req.query.level === undefined)
        {
            query1 = `SELECT level AS "Sponsorship Level", cost as Cost, description AS Description, free_duck_entries AS "Free Duck Derby Entries" 
                    FROM SponsorshipLevels;`
        }

        // If there is a query string, we assume this is a search, and return desired results
        else 
        {
            query1 = `SELECT level AS "Sponsorship Level", cost as Cost, description AS Description, free_duck_entries AS "Free Duck Derby Entries" 
                    FROM SponsorshipLevels 
                    WHERE level LIKE "%${req.query.level}%";`
        }

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // // Save the levels
            let level = rows;
            
            // return res.render('SponsorshipLevels', {data: level});
            return res.render('SponsorshipLevels', {data: level});
        })          
});

app.get('/Donations', function(req, res)
    {
        let query1;
        
        if (req.query.searchDonation === undefined) {
            query1 = `SELECT Donations.donation_id AS ID, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant, Sponsors.sponsor_name AS Sponsor, Donations.donation_amount AS Donation 
            FROM Donations 
                LEFT OUTER JOIN Participants ON Donations.participant_id = Participants.participant_id 
                LEFT OUTER JOIN Sponsors ON Donations.sponsor_id = Sponsors.sponsor_id;`;
        } 
        else {
            query1 = `SELECT Donations.donation_id AS ID, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant, Sponsors.sponsor_name AS Sponsor, Donations.donation_amount AS Donation 
            FROM Donations 
                LEFT OUTER JOIN Participants ON Donations.participant_id = Participants.participant_id 
                LEFT OUTER JOIN Sponsors ON Donations.sponsor_id = Sponsors.sponsor_id 
            WHERE CONCAT(Participants.first_name, ' ', Participants.last_name) LIKE '%${req.query.searchDonation}%' OR Sponsors.sponsor_name LIKE '%${req.query.searchDonation}%';`;
        }

        let query2 = `SELECT * FROM Participants;`;

        let query3 = `SELECT * FROM Sponsors;`;

        db.pool.query(query1, function (err, rows, fields) {
            let donations = rows;

            db.pool.query(query2, function (err, rows, fields) {
                let participants = rows; 

                db.pool.query(query3, function (err, rows, fields) {
                    let sponsors = rows; 
                        
                    return res.render('Donations', {data: donations, participants: participants, sponsors: sponsors});
                })
            })
        })
});


//////////////////////////////////////////////////////////////////////////////////////
// POST ROUTES

app.post('/add-Participants-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let zip = parseInt(data.zip_code);
    if (isNaN(zip))
    {
        zip = 'NULL'
    }

    let waiver = parseInt(data.waiver_signed);
    if (isNaN(waiver))
    {
        waiver = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Participants (first_name, last_name, address, city, state, zip_code, phone_number, email_address, shirt_size, waiver_signed) 
                VALUES ('${data.first_name}', '${data.last_name}', '${data.address}', '${data.city}', '${data.state}', '${zip}', '${data.phone_number}', 
                '${data.email_address}', '${data.shirt_size}', '${waiver}')`;

    db.pool.query(query1, function(error, rows, fields){
        
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Participants;`;
            db.pool.query(query2, function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-Races-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object 
    let data = req.body;

    // Capture NULL values
    let entry_fee = parseInt(data.entry_fee);
    if (isNaN(entry_fee))
    {
        entry_fee = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Races (race_id, race_type, race_location, race_date, race_time, entry_fee) 
                VALUES ('${data.race_id}', '${data.race_type}', '${data.race_location}', '${data.race_date}', '${data.race_time}', '${entry_fee}')`;
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //If there was no error, perform a SELECT * on Races
            query2 = `SELECT * FROM Races;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on teh second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }

                // If all went well, send the results of the query back
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-Races_Participants-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object 
    let data = req.body;

    // Capture NULL values
    let participant_id = parseInt(data.participant_id);
    if (isNaN(participant_id))
    {
        participant_id = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Races_Participants (race_id, participant_id) VALUES ('${data.race_id}', '${participant_id}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //If there was no error, perform a SELECT * on Races_Volunteers
            query2 = `SELECT * FROM Races_Participants;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on teh second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }

                // If all went well, send the results of the query back
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-Volunteers-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object 
    let data = req.body;
    console.log(data);

    let waiver_signed = parseInt(data.waiver_signed);
    if (isNaN(waiver_signed))
    {
        waiver_signed = NULL
    }


    // Create the query and run it on the database
    query1 = `INSERT INTO Volunteers (first_name, last_name, phone_number, employer, sponsor_id, shirt_size, waiver_signed) 
                VALUES ('${data.first_name}', '${data.last_name}', '${data.phone_number}', '${data.employer}', ${data.sponsor_id}, '${data.shirt_size}', '${waiver_signed}')`;
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            console.log(query1)
            res.sendStatus(400);
        }
        else
        {
            //If there was no error, perform a SELECT * on Volunteers
            query2 = `SELECT * FROM Volunteers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on teh second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }

                // If all went well, send the results of the query back
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-Races_Volunteers-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object 
    let data = req.body;

    // Capture NULL values
    let volunteer_id = parseInt(data.volunteer_id);
    if (isNaN(volunteer_id))
    {
        volunteer_id = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Races_Volunteers (race_id, volunteer_id) VALUES ('${data.race_id}', '${volunteer_id}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //If there was no error, perform a SELECT * on Races_Volunteers
            query2 = `SELECT * FROM Races_Volunteers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on teh second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }

                // If all went well, send the results of the query back
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-Sponsors-ajax', function(req, res)
{
    let data = req.body;

    if (data.sponsorship_level === 'NULL') {
        data.sponsorship_level = null;
    } else {
        data.sponsorship_level = `'${data.sponsorship_level}'`;
    }

    query1 = `INSERT INTO Sponsors (sponsor_name, sponsor_contact, sponsor_phone, sponsor_email, sponsorship_level) 
                VALUES ('${data.sponsor_name}', '${data.sponsor_contact}', '${data.sponsor_phone}', '${data.sponsor_email}', ${data.sponsorship_level})`;
    
    db.pool.query(query1, function(err, rows, fields) {
        if (err) {
            console.log(err)
            res.sendStatus(400);
        }
        else {
            query2 = `SELECT * FROM Sponsors;`;
            db.pool.query(query2, function(err, rows, fields) {
                if (err) {
                    console.log(err)
                    res.sendStatus(400);
                }
                else {
                    res.send(rows)
                }
            })
        }
    })
});

app.post('/add-SponsorshipLevels-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object 
    let data = req.body;

    // Capture NULL values
    let cost = parseInt(data.cost);
    if (isNaN(cost))
    {
        cost = 'NULL'
    }

    let free_duck_entries = parseInt(data.free_duck_entries);
    if (isNaN(free_duck_entries))
    {
        free_duck_entries = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO SponsorshipLevels (level, cost, description, free_duck_entries) VALUES ('${data.level}', '${cost}', '${data.description}', '${free_duck_entries}')`;
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //If there was no error, perform a SELECT * on SponsorshipLevels
            query2 = `SELECT * FROM SponsorshipLevels;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on teh second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }

                // If all went well, send the results of the query back
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-Donations-ajax', function(req, res) {
    
    let data = req.body;
    console.log(data);

    // Capture NULL values
    let donation_amount = parseInt(data.donation_amount);
    if (isNaN(donation_amount)) {
        donation_amount = NULL
    }

    query1 = `INSERT INTO Donations (participant_id, sponsor_id, donation_amount) VALUES (${data.participant_id}, ${data.sponsor_id}, '${donation_amount}')`;
    
    db.pool.query(query1, function (err, rows, fields) {
        console.log(query1);
        if (err) {
            console.log(err)
            console.log(query1)
            res.sendStatus(400);
        } else 
        {
            query2 = `SELECT * FROM Donations;`;
            db.pool.query(query2, function (err, rows, fields) {
                if (err) {
                    console.log(err)
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })

        }
    })
});


//////////////////////////////////////////////////////////////////////////////////////
// DELETE ROUTES 

app.delete('/delete-Participants-ajax/', function(req, res, next) {
    let data = req.body;
    let participant_id = parseInt(data.participant_id);
    let deleteParticipantID = `DELETE FROM Participants WHERE participant_id = ?`;

        // Run the query
        db.pool.query(deleteParticipantID, [participant_id], function(err, rows, fields){
            if (err) {
                // Log the error to the console
                console.log(err);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        })
});

app.delete('/delete-Races-ajax/', function(req, res, next){
    let data = req.body;
    let race_id = data.race_id;  // NOTE: REMOVED PARSEINT FROM THIS LINE AS PK IS NOT AN INT
    let deleteRaceID = `DELETE FROM Races WHERE race_id = ?`;

        // Run the query
        db.pool.query(deleteRaceID, [race_id], function(error, rows, fields){
            if (error) {
                // Log the the error to the console so we know what went wrong and send the visitor an HTTP response 400 indicating it was a bad request. 
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204); 
            }
        })
});

app.delete('/delete-Races_Participants-ajax/', function(req, res, next){
    let data = req.body;
    console.log(data);
    let assignment_id = parseInt(data.assignment_id);  // NOTE: REMOVED PARSEINT FROM THIS LINE AS PK IS NOT AN INT
    let deleteAssignmentID = `DELETE FROM Races_Participants WHERE assignment_id = ?`;

        // Run the query
        db.pool.query(deleteAssignmentID, [assignment_id], function(error, rows, fields){
            console.log(deleteAssignmentID);
            if (error) {
                // Log the the error to the console so we know what went wrong and send the visitor an HTTP response 400 indicating it was a bad request. 
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204); 
            }
        })
});

app.delete('/delete-Volunteers-ajax/', function(req, res, next){
    let data = req.body;
    let volunteer_id = parseInt(data.volunteer_id);
    let deleteVolunteerID = `DELETE FROM Volunteers WHERE volunteer_id = ?`;

        // Run the query
        db.pool.query(deleteVolunteerID, [volunteer_id], function(err, rows, fields){
            if (err) {
                // Log the the error to the console so we know what went wrong and send the visitor an HTTP response 400 indicating it was a bad request. 
                console.log(err);
                res.sendStatus(400);
            } else {
                res.sendStatus(204); 
            }
        })
});

app.delete('/delete-Races_Volunteers-ajax/', function(req, res, next){
    let data = req.body;
    let assignment_id = data.assignment_id;  // NOTE: REMOVED PARSEINT FROM THIS LINE AS PK IS NOT AN INT
    let deleteAssignmentID = `DELETE FROM Races_Volunteers WHERE assignment_id = ?`;

        // Run the query
        db.pool.query(deleteAssignmentID, [assignment_id], function(error, rows, fields){
            if (error) {
                // Log the the error to the console so we know what went wrong and send the visitor an HTTP response 400 indicating it was a bad request. 
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204); 
            }
        })
});

app.delete('/delete-Sponsors-ajax', function(req, res, next){
    let data = req.body;
    let sponsor_id = parseInt(data.sponsor_id);
    let deleteSponsorID = `DELETE FROM Sponsors WHERE sponsor_id = ?`;

        // Run the query
        db.pool.query(deleteSponsorID, [sponsor_id], function(error, rows, fields){
            if (error) {
                // Log the the error to the console so we know what went wrong and send the visitor an HTTP response 400 indicating it was a bad request. 
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204); 
            }
        })
});

app.delete('/delete-SponsorshipLevels-ajax/', function(req, res, next){
    let data = req.body;
    let level = data.level;  // NOTE: REMOVED PARSEINT FROM THIS LINE AS PK IS NOT AN INT
    let deleteLevel = `DELETE FROM SponsorshipLevels WHERE level = ?`;

        // Run the query
        db.pool.query(deleteLevel, [level], function(error, rows, fields){
            if (error) {
                // Log the the error to the console so we know what went wrong and send the visitor an HTTP response 400 indicating it was a bad request. 
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204); 
            }
        })
});

app.delete('/delete-Donations-ajax/', function(req,res,next){
    let data = req.body;
    let donationID = parseInt(data.donation_id);
    let deleteDonations= `DELETE FROM Donations WHERE donation_id = ?`;
  
    // Run the second query
    db.pool.query(deleteDonations, [donationID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});


//////////////////////////////////////////////////////////////////////////////////////

// UPDATE ROUTES 

app.put('/put-Races_Participants-ajax', function(req, res, next) {
    let data = req.body;

    let assignment_id = parseInt(data.assignment_id);  
    let race_id = data.race_id;
    let participant_id = parseInt(data.participant_id);


    let query1 = `UPDATE Races_Participants SET race_id = ?, participant_id = ? WHERE assignment_id = ?`;
    
    let query2 = `SELECT * FROM Races_Participants WHERE assignment_id = ?`;
  
          // Run the 1st query
          db.pool.query(query1, [race_id, participant_id, assignment_id], function(err, rows, fields){
            if (err) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(err);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(query2, [assignment_id], function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
  })});
  
  
  app.put('/put-Sponsors-ajax', function(req,res,next){                                   
    let data = req.body;
  
    let sponsor_id = parseInt(data.sponsor_id);
    let sponsor_name = (data.sponsor_name);
    let sponsor_contact = (data.sponsor_contact);
    let sponsor_phone = (data.sponsor_phone);
    let sponsor_email = (data.sponsor_email);

    if (data.sponsorship_level === 'NULL') {
        sponsorship_level = null;
    } else {
        sponsorship_level = (data.sponsorship_level);
    }
  
    let queryUpdateSponsors = `UPDATE Sponsors SET sponsor_name = ?, sponsor_contact = ?, sponsor_phone = ?, sponsor_email = ?, sponsorship_level = ? WHERE sponsor_id = ?`;
    let selectSponsors = `SELECT * FROM Sponsors WHERE sponsor_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateSponsors, [sponsor_name, sponsor_contact, sponsor_phone, sponsor_email, sponsorship_level, sponsor_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the sponsors
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectSponsors, [sponsor_id], function(error, rows, fields) {
          
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

  
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
