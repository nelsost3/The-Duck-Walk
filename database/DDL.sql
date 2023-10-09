/* Group 18
Team Members: Abby Thornton and Steven Nelson
Project: The Duck Walk
Project Step 6 (Portfolio Assignment) */

/* This document outlines all data definition queries for The Duck Walk website.
    Table of Contents: 
      - Table creation queries (Participants, Races, SponsorshipLevels, Sponsors, Volunteers, Races_Participants, Races_Volunteers, Donations)
      - Sample data insertion queries (Participants, Races, SponsorshipLevels, Sponsors, Volunteers, Races_Participants, Races_Volunteers, Donations) */

SET FOREIGN_KEY_CHECKS = 0;

/*/////////////////////////////////* Create tables for the database /////////////////////////////////*/

-- Create Partcipants table
CREATE OR REPLACE TABLE Participants (
  participant_id int(5) NOT NULL UNIQUE AUTO_INCREMENT,
  first_name varchar(20) NOT NULL,
  last_name varchar(20) NOT NULL,
  address varchar(100) NOT NULL,
  city varchar(100) NOT NULL,
  state varchar(2) NOT NULL,
  zip_code int(5) NOT NULL,
  phone_number varchar(14) NOT NULL,
  email_address varchar(100) NOT NULL,
  shirt_size varchar(3) NOT NULL, 
  waiver_signed tinyint(1) NOT NULL DEFAULT 0, -- using tinyint as bool
  PRIMARY KEY (participant_id)
);


-- Create Races table
CREATE OR REPLACE TABLE Races (
  race_id varchar(3) NOT NULL UNIQUE, -- id named by user, not auto-generated
  race_type varchar(20) NOT NULL,
  race_location varchar(200) NOT NULL,
  race_date date NOT NULL,
  race_time time NOT NULL,
  entry_fee decimal(4,2) NOT NULL, 
  PRIMARY KEY (race_id)
);


-- Create SponsorshipLevels table
CREATE OR REPLACE TABLE SponsorshipLevels (
  level varchar(10) NOT NULL UNIQUE, -- id named by user, not auto-generated
  cost decimal(10,2) NOT NULL,
  description varchar(255) NOT NULL,
  free_duck_entries int(3) NOT NULL,
  PRIMARY KEY (level)
);


-- Create Sponsors table
CREATE OR REPLACE TABLE Sponsors (
  sponsor_id int(5) NOT NULL UNIQUE AUTO_INCREMENT,
  sponsor_name varchar(40) NOT NULL,
  sponsor_contact varchar(40) NOT NULL,
  sponsor_phone varchar(14) NOT NULL,
  sponsor_email varchar(100) NOT NULL,
  sponsorship_level varchar(10),
  PRIMARY KEY (sponsor_id),
  FOREIGN KEY (sponsorship_level) REFERENCES SponsorshipLevels(level)
  ON DELETE SET NULL
);


-- Create Volunteers table
CREATE OR REPLACE TABLE Volunteers (
  volunteer_id int(5) NOT NULL UNIQUE AUTO_INCREMENT,
  first_name varchar(20) NOT NULL,
  last_name varchar(20) NOT NULL,
  phone_number varchar(14) NOT NULL,
  employer varchar(100) NULL,
  sponsor_id int(5) NULL,
  shirt_size varchar(3) NOT NULL,
  waiver_signed tinyint(1) NOT NULL DEFAULT 0, -- using tinyint as bool
  PRIMARY KEY (volunteer_id),
  FOREIGN KEY (sponsor_id) REFERENCES Sponsors(sponsor_id)
  ON DELETE SET NULL
);


-- Create Races_Participants intersection table
CREATE OR REPLACE TABLE Races_Participants (
  assignment_id int(5) NOT NULL UNIQUE AUTO_INCREMENT,
  race_id varchar(3) NOT NULL,
  participant_id int(5) NOT NULL,
  PRIMARY KEY (assignment_id),
  FOREIGN KEY (race_id) REFERENCES Races(race_id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES Participants(participant_id)
  ON DELETE CASCADE
);


-- Create Races_Volunteers intersection table
CREATE OR REPLACE TABLE Races_Volunteers (
  assignment_id int(5) NOT NULL UNIQUE AUTO_INCREMENT,
  race_id varchar(3) NOT NULL,
  volunteer_id int(5) NOT NULL,
  PRIMARY KEY (assignment_id),
  FOREIGN KEY (race_id) REFERENCES Races(race_id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES Volunteers(volunteer_id)  
  ON DELETE CASCADE
);


-- Create Donations table
CREATE OR REPLACE TABLE Donations (
  donation_id int(5) NOT NULL UNIQUE AUTO_INCREMENT,
  participant_id int(5) NULL,
  sponsor_id int(5) NULL,
  donation_amount decimal(10,2) NOT NULL, 
  PRIMARY KEY (donation_id),
  FOREIGN KEY (participant_id) REFERENCES Participants(participant_id)
  ON DELETE CASCADE,
  FOREIGN KEY (sponsor_id) REFERENCES Sponsors(sponsor_id)
  ON DELETE CASCADE
);


/*/////////////////////////////////* Insert sample data into all tables /////////////////////////////////*/

-- Insert data into Participants table
INSERT INTO Participants (first_name, last_name, address, city, state, zip_code, phone_number, email_address, shirt_size, waiver_signed)
VALUES ('Pippo', 'Biggs', '1028 Clyde Gallagher Circle', 'Cedar Mill', 'TX', 78787, '(487) 555-5773', 'pbiggs*@*****.com', 'S', 1),
    ('Yvor', 'Petty', '9 Maywood Pass', 'Cedar Mill', 'TX', 78787, '(487) 555-9913', 'ypetty*@***.com', 'M', 0),
    ('Thomas', 'Robillard', '489 Marcy Crossing', 'Cedar Mill', 'TX', 78787, '(487) 555-9764', 'trobillard*@*****.gov', 'XL', 1),
    ('Shina', 'Gipp', '96601 American Drive', 'Cedar Mill', 'TX', 78787, '(487) 555-3287', 'sgipp*@******.com', '3XL', 1),
    ('Petunia', 'Luc', '1 Killdeer Alley', 'Cedar Mill', 'TX', 78787, '(487) 555-2839', 'pluc*@*****.com', '2XL', 0);


-- Insert data into Races table
INSERT INTO Races
VALUES ('RDD', 'Rubber Duck Derby', 'Sutton Pond', '2023-04-15', '10:00:00', 10.00),
    ('5KW', '5k Walk', 'Cedar Mill Stadium', '2023-04-15', '09:00:00', 25.00),
    ('5KR', '5k Run', 'Cedar Mill Stadium', '2023-04-15', '09:00:00', 25.00),
    ('10K', '10k Run', 'Cedar Mill Stadium', '2023-04-16', '08:00:00', 30.00),
    ('HFM', 'Half Marathon', 'Cedar Mill Stadium', '2023-04-16', '07:00:00', 35.00);


-- Insert data into SponsorshipLevels table
INSERT INTO SponsorshipLevels
VALUES ('Bronze', 1000.00, 'Bronze level sponsorship benefits', 25),
    ('Silver', 2000.00, 'Silver level sponsorship benefits', 50),
    ('Gold', 3000.00, 'Gold level sponsorship benefits', 75),
    ('Grand Duck', 5000.00, 'Grand Duck level sponsorship benefits', 150);


-- Insert data into Sponsors table
INSERT INTO Sponsors (sponsor_name, sponsor_contact, sponsor_phone, sponsor_email, sponsorship_level)
VALUES ('Johns LLC', 'Quintana Winsborrow', '(487) 555-0353', 'qw******@********.com', (SELECT level FROM SponsorshipLevels WHERE level = 'Gold')),
    ('Ebert LLC', 'Charmian Burtenshaw', '(487) 555-4465', 'cb********@********.org', (SELECT level FROM SponsorshipLevels WHERE level = 'Silver')),
    ('Block-Labadie', 'Zitella Bending', '(487) 555-4892', 'zb******@**.org', (SELECT level FROM SponsorshipLevels WHERE level = 'Silver')),
    ('Aufderhar, Mante and MacGyver', 'Naomi Stranaghan', '(487) 555-8583', 'ns******@********.com', (SELECT level FROM SponsorshipLevels WHERE level = 'Bronze')),
    ('Lowe Group', 'Thaddeus Rustman', '(487) 555-4121', 'tr******@*****.org', (SELECT level FROM SponsorshipLevels WHERE level = 'Bronze'));


-- Insert data into Volunteers table
INSERT INTO Volunteers (first_name, last_name, phone_number, employer, sponsor_id, shirt_size, waiver_signed)
VALUES ('Pen', 'Caldwall', '(487) 555-5567', 'Grimes Inc', (SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Grimes Inc'), 'XS', 1),
    ('Fons', 'Larrington', '(487) 555-8125', 'Block-Labadie', (SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Block-Labadie'), '3XL', 1),
    ('Sherri', 'Kendell', '(487) 555-9175', 'Renner-Huels', (SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Renner-Huels'), 'L', 0),
    ('Adelice', 'Connealy', '(487) 555-5640', 'Aufderhar, Mante and MacGyver', (SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Aufderhar, Mante and MacGyver'), '3XL', 1),
    ('Gillan', 'Sambells', '(487) 555-2196', 'Roob-Mante', (SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Roob-Mante'), 'M', 1);


-- Insert race participation data into Races_Participants
INSERT INTO Races_Participants (race_id, participant_id)
VALUES ('RDD', (SELECT participant_id FROM Participants WHERE first_name = 'Pippo' AND last_name = 'Biggs')),
    ('5KW', (SELECT participant_id FROM Participants WHERE first_name = 'Yvor' AND last_name = 'Petty')),
    ('5KR', (SELECT participant_id FROM Participants WHERE first_name = 'Thomas' AND last_name = 'Robillard')),
    ('10K', (SELECT participant_id FROM Participants WHERE first_name = 'Shina' AND last_name = 'Gipp')),
    ('HFM', (SELECT participant_id FROM Participants WHERE first_name = 'Petunia' AND last_name = 'Luc'));


-- Insert volunteer participation data into Races_Volunteers
INSERT INTO Races_Volunteers (race_id, volunteer_id) 
VALUES ('RDD', (SELECT volunteer_id FROM Volunteers WHERE first_name = 'Pen' AND last_name = 'Caldwall')),
    ('5KW', (SELECT volunteer_id FROM Volunteers WHERE first_name = 'Fons' AND last_name = 'Larrington')),
    ('5KR', (SELECT volunteer_id FROM Volunteers WHERE first_name = 'Sherri' AND last_name = 'Kendell')),
    ('10K', (SELECT volunteer_id FROM Volunteers WHERE first_name = 'Adelice' AND last_name = 'Connealy')),
    ('HFM', (SELECT volunteer_id FROM Volunteers WHERE first_name = 'Gillan' AND last_name = 'Sambells'));


-- Insert sponsor donations data into Donations table
INSERT INTO Donations (sponsor_id, donation_amount)
VALUES ((SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Johns LLC'), 3000.00),
    ((SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Ebert LLC'), 2000.00),
    ((SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Block-Labadie'), 2000.00),
    ((SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Aufderhar, Mante and MacGyver'), 1000.00),
    ((SELECT sponsor_id FROM Sponsors WHERE sponsor_name = 'Lowe Group'), 1000.00);


-- Insert participant donations data into Donations table
INSERT INTO Donations (participant_id, donation_amount)
VALUES ((SELECT participant_id FROM Participants WHERE first_name = 'Pippo' AND last_name = 'Biggs'), 10.00),
    ((SELECT participant_id FROM Participants WHERE first_name = 'Yvor' AND last_name = 'Petty'), 25.00),
    ((SELECT participant_id FROM Participants WHERE first_name = 'Thomas' AND last_name = 'Robillard'), 25.00),
    ((SELECT participant_id FROM Participants WHERE first_name = 'Shina' AND last_name = 'Gipp'), 30.00),
    ((SELECT participant_id FROM Participants WHERE first_name = 'Petunia' AND last_name = 'Luc'), 35.00);


SET FOREIGN_KEY_CHECKS = 1;
