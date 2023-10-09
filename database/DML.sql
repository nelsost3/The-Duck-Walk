/* Group 18
Team Members: Abby Thornton and Steven Nelson
Project: The Duck Walk
Project Step 6 (Portfolio Assignment) */

/* This document outlines all data manipulation queries used in The Duck Walk website for performing CRUD functions. 
        Table of Contents: 
            - Create queries (Participants, Races, Races_Participants, Volunteers, Races_Volunteers, Sponsors, SponsorshipLevels, Donations)
            - Update queries (Races_Participants, Sponsors)
            - Read queries (Participants, Races, Races_Participants, Volunteers, Races_Volunteers, Sponsors, SponsorshipLevels, Donations)
            - Delete queries (Participants, Races, Races_Participants, Volunteers, Races_Volunteers, Sponsors, SponsorshipLevels, Donations)
    
    Note: Queries will use colon : character to denote any variables that will have data from the backend programming language */


/*/////////////////////////////////* CREATE new records in tables ////////////////////////////////*/

-- Insert a new participant into Participants table
INSERT INTO Participants (first_name, last_name, address, city, state, zip_code, phone_number, email_address, shirt_size, waiver_signed)
VALUES (:first_nameInput, :last_nameInput, :addressInput, :cityInput, :stateInput, :stateInput, :zip_codeInput, :phone_numberInput, :email_addressInput, :shirt_sizeFromDropdown, :waiver_signedFromDropdown);


-- Insert a new race into Races table
INSERT INTO Races (race_id, race_type, race_location, race_date, race_time, entry_fee)
VALUES (:race_idInput, :race_typeInput, :race_locationInput, :race_dateInput, :race_timeInput, :entry_feeInput);


-- Insert a participant's race assignment into Races_Participants table
INSERT INTO Races_Participants (race_id, participant_id)
VALUES (:race_idFromDropdown:, participant_idFromDropdown);


-- Insert a new volunteer into Volunteers table
INSERT INTO Volunteers (first_name, last_name, phone_number, employer, sponsor_id, shirt_size, waiver_signed)
VALUES (:first_nameInput, :last_nameInput, :phone_numberInput, :employerInput, :sponsor_idFromDropdown, :shirt_sizeFromDropdown, :waiver_signedFromDropdown);


-- Insert a volunteer's race assignment into Races_Volunteers table
INSERT INTO Races_Volunteers (race_id, volunteer_id)
VALUES (:race_idFromDropdown, :volunteer_idFromDropdown);


-- Insert a new sponsor into Sponsors table
INSERT INTO Sponsors (sponsor_name, sponsor_contact, sponsor_phone, sponsor_email, sponsorship_level)
VALUES (:sponsor_nameInput, :sponsor_contactInput, :sponsor_phoneInput, :sponsor_emailInput, :sponsorship_levelFromDropdown);


-- Insert a new sponsorship level into SponsorshipLevels table
INSERT INTO SponsorshipLevels (level, cost, description, free_duck_entries)
VALUES (:levelInput, :costInput, :descriptionInput, :free_duck_entriesInput);


-- Insert a new donation into Donations table
INSERT INTO Donations (participant_id, sponsor_id, donation_amount)
VALUES (:participant_idFromDropdown, :sponsor_idFromDropdown, :donation_amountInput);


/*/////////////////////////////////* UPDATE existing records in table ////////////////////////////////*/

-- Edit a participant's race assignment in the Races_Participants table
UPDATE Races_Participants
SET race_id = :race_idFromDropdown, participant_id = :participant_idFromDropdown
WHERE assignment_id = :assignment_idFromDropdown;


-- Edit a sponsor's information in the Sponsors table
UPDATE Sponsors
SET sponsor_name = :sponsor_nameInput, sponsor_contact = :sponsor_contactInput, sponsor_phone = :sponsor_phoneInput, sponsor_email = :sponsor_emailInput, sponsorship_level = :sponsorship_levelFromDropdown
WHERE sponsor_id = :sponsor_idFromDropdown;


/*/////////////////////////////////* READ existing records in tables ////////////////////////////////*/

-- View all participants in Participants table using column aliases
SELECT participant_id AS ID, CONCAT(first_name, ' ', last_name) AS Name, address AS Address, city AS City, state AS State, zip_code AS "Zip Code", 
        phone_number AS Phone, email_address AS Email, shirt_size AS "Shirt Size", waiver_signed AS "Waiver Signed?" 
FROM Participants;


-- View all participants in Participants table using column aliases that match a given search query for the participant name 
SELECT participant_id AS ID, CONCAT(first_name, ' ', last_name) AS Name, address AS Address, city AS City, state AS State, zip_code AS "Zip Code", 
        phone_number AS Phone, email_address AS Email, shirt_size AS "Shirt Size", waiver_signed AS "Waiver Signed?" 
FROM Participants 
WHERE CONCAT(first_name, ' ', last_name) LIKE :search_params;


-- View all races in Races table using column aliases
SELECT race_id AS ID, race_type as Race, race_location AS Location, race_date AS Date, race_time AS Time, entry_fee AS "Entry Fee" 
FROM Races;


-- View all races in Races table using column aliases that match a given search query for the race ID or race type
SELECT race_id AS ID, race_type as Race, race_location AS Location, race_date AS Date, race_time AS Time, entry_fee AS "Entry Fee" 
FROM Races 
WHERE race_id LIKE :search_params OR race_type LIKE :search_params;


-- View all participant's race assignments in Races_Participants table using column aliases
SELECT Races_Participants.assignment_id AS ID, Races.race_type AS Race, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant 
FROM Races_Participants 
    LEFT OUTER JOIN Races ON Races_Participants.race_id = Races.race_id 
    LEFT OUTER JOIN Participants ON Races_Participants.participant_id = Participants.participant_id;


-- View all participant's race assignments in Races_Participants table using column aliases that match a given search query for the race type or participant name
SELECT Races_Participants.assignment_id AS ID, Races.race_type AS Race, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant 
FROM Races_Participants 
    LEFT OUTER JOIN Races ON Races_Participants.race_id = Races.race_id 
    LEFT OUTER JOIN Participants ON Races_Participants.participant_id = Participants.participant_id 
WHERE Races.race_type LIKE :search_params OR CONCAT(Participants.first_name, ' ', Participants.last_name) LIKE :search_params;


-- View all volunteers in Volunteers table using column aliases 
SELECT Volunteers.volunteer_id AS ID, CONCAT(Volunteers.first_name, " ", Volunteers.last_name) AS "Name", Volunteers.phone_number AS Phone, Volunteers.employer AS Employer, 
        Sponsors.sponsor_name AS Sponsor, Volunteers.shirt_size AS "Shirt Size", Volunteers.waiver_signed AS "Waiver Signed?" 
FROM Volunteers 
    LEFT OUTER JOIN Sponsors ON Volunteers.sponsor_id = Sponsors.sponsor_id;


-- View all volunteers in Volunteers table using column aliases that match a given search query for volunteer name or sponsor name
SELECT Volunteers.volunteer_id AS ID, CONCAT(Volunteers.first_name, " ", Volunteers.last_name) AS "Name", Volunteers.phone_number AS Phone, Volunteers.employer AS Employer, 
        Sponsors.sponsor_name AS Sponsor, Volunteers.shirt_size AS "Shirt Size", Volunteers.waiver_signed AS "Waiver Signed?" 
FROM Volunteers 
    LEFT OUTER JOIN Sponsors ON Volunteers.sponsor_id = Sponsors.sponsor_id
WHERE CONCAT(Volunteers.first_name, " ", Volunteers.last_name) LIKE :search_params OR Sponsors.sponsor_name LIKE :search_params;


-- View all volunteer's race assignments in Races_Volunteers tables using column aliases
SELECT Races_Volunteers.assignment_id AS ID, Races.race_type AS Race, CONCAT(Volunteers.first_name, ' ', Volunteers.last_name) AS Volunteer 
FROM Races_Volunteers 
    LEFT OUTER JOIN Races ON Races_Volunteers.race_id = Races.race_id 
    LEFT OUTER JOIN Volunteers ON Races_Volunteers.volunteer_id = Volunteers.volunteer_id;


-- View all volunteer's race assignments in Races_Volunteers tables using column aliases that match a given search query for race type or volunteer name
SELECT Races_Volunteers.assignment_id AS ID, Races.race_type AS Race, CONCAT(Volunteers.first_name, ' ', Volunteers.last_name) AS Volunteer 
FROM Races_Volunteers 
    LEFT OUTER JOIN Races ON Races_Volunteers.race_id = Races.race_id 
    LEFT OUTER JOIN Volunteers ON Races_Volunteers.volunteer_id = Volunteers.volunteer_id 
WHERE Races.race_type LIKE :search_params OR CONCAT(Volunteers.first_name, ' ', Volunteers.last_name) LIKE :search_params;


-- View all sponsors in Sponsors table using column alises 
SELECT sponsor_id AS ID, sponsor_name AS Sponsor, sponsor_contact AS Contact, sponsor_phone AS Phone, sponsor_email AS Email, sponsorship_level AS "Sponsorship Level" 
FROM Sponsors;


-- View all sponsors in Sponsors table using column aliases that match a given search query for sponsor name
SELECT sponsor_id AS ID, sponsor_name AS Sponsor, sponsor_contact AS Contact, sponsor_phone AS Phone, sponsor_email AS Email, sponsorship_level AS "Sponsorship Level" 
FROM Sponsors 
WHERE sponsor_name LIKE :search_params;


-- View all sponsorship levels in SponsorshipLevels table using column aliases
SELECT level AS "Sponsorship Level", cost as Cost, description AS Description, free_duck_entries AS "Free Duck Derby Entries" 
FROM SponsorshipLevels; 


-- View all sponsorship levels in SponsorshipLevels table using column aliases that match a given search query for sponsorship level
SELECT level AS "Sponsorship Level", cost as Cost, description AS Description, free_duck_entries AS "Free Duck Derby Entries" 
FROM SponsorshipLevels 
WHERE level LIKE :search_params;


-- View all donations in Donations table using column aliases
SELECT Donations.donation_id AS ID, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant, Sponsors.sponsor_name AS Sponsor, Donations.donation_amount AS Donation 
FROM Donations 
    LEFT OUTER JOIN Participants ON Donations.participant_id = Participants.participant_id 
    LEFT OUTER JOIN Sponsors ON Donations.sponsor_id = Sponsors.sponsor_id;


-- View all donations in Donations table using column aliases that match a given search query for participant name or sponsor name
SELECT Donations.donation_id AS ID, CONCAT(Participants.first_name, ' ', Participants.last_name) AS Participant, Sponsors.sponsor_name AS Sponsor, Donations.donation_amount AS Donation 
FROM Donations 
    LEFT OUTER JOIN Participants ON Donations.participant_id = Participants.participant_id 
    LEFT OUTER JOIN Sponsors ON Donations.sponsor_id = Sponsors.sponsor_id 
WHERE CONCAT(Participants.first_name, ' ', Participants.last_name) LIKE :search_params OR Sponsors.sponsor_name LIKE :search_params;


/*DELETE existing records in table
Note: Queries will use colon : character to denote any variables that will have data from the backend programming language*/

-- Delete a participant from the Participants table
DELETE FROM Participants 
WHERE participant_id = :participant_idFromRow;


-- Delete a race from the Races table
DELETE FROM Races 
WHERE race_id = :race_idFromRow;


-- Delete a participant's race assignment from the Races_Participants table
DELETE FROM Races_Participants 
WHERE assignment_id = :assignment_idFromRow;


-- Delete a volunteer from the Volunteers table
DELETE FROM Volunteers 
WHERE volunteer_id = :volunteer_idFromRow;


-- Delete a volunteer's race assignment from the Races_Volunteers table
DELETE FROM Races_Volunteers 
WHERE assignment_id = :assignment_idFromRow;


-- Delete a sponsor from the Sponsors table
DELETE FROM Sponsors 
WHERE sponsor_id = :sponsor_idFromRow;


-- Delete a sponsorship level from the SponsorshipLevels table
DELETE FROM SponsorshipLevels 
WHERE level = :levelFromRow;


-- Delete a donation from the Donations level
DELETE FROM Donations 
WHERE donation_id = :donation_idFromRow;

