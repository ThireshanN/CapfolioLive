/*
//#########################################################################################################################################
// UserTypeID for the 4 types of users:
    1 - Student
    2 - Employer
    3 - Admin
    4 - Visitor

    UserID of Asma Shakil = 7

//#########################################################################################################################################
//Inserting a new student to Student table

SQL COMMANDS:

Insert into Users(UserID, UserTypeID, FirstName, lastName)
values (35, 1, "Ricky", "Katafono");

Insert into Student(UserID, StudentUPI)
values (35, "");

INSTRUCTIONS:
-- UserID for Users = last UserID in the database + 1 (also the current last UserID is 35, so the next UserID should start with 36)
-- UserTypeID for Users = should pick from the 4 UserTypeIDs above (1 = student)
-- UserID for Student = the same UserID you entered for the Users table

NOTES:
--you first need to add the details to the Users table, then only update the Student table with the corresponding UserID
-- PK in Users table: UserID, PK in Student table: UserID
-- DO NOT LEAVE THE UserID, UserTypeID EMPTY

//#########################################################################################################################################
//Inserting a new Employer to Employer table

SQL COMMANDS:

Insert into Users(UserID, UserTypeID, FirstName, lastName)
values (36, 2, "Bob", "Miles");

Insert into Employer(UserID, CompanyName, email)
values (36, "ABC-coop", "bob@abc.com");

INSTRUCTIONS:
-- UserID for Users = last UserID in the database + 1 
-- UserTypeID for Users = should pick from the 4 UserTypeIDs above (2 = Employer)
-- UserID for Employer = the same UserID you entered for the Users table

NOTES:
--note: you first need to add the details to the Users table, then only update the Visitor table with the corresponding UserID
-- DO NOT LEAVE THE UserID, UserTypeID EMPTY

//#########################################################################################################################################
//Inserting a new Admin to Admin table

SQL COMMANDS:

Insert into Users(UserID, UserTypeID, FirstName, lastName)
values (7, 3, "Asma", "Shakil");

Insert into Admins(UserID)
values (7);

-- I have already entered the details of Asma to the database

INSTRUCTIONS:
-- UserID for Users = last UserID + 1 
-- UserTypeID for Users = should pick from the 4 UserTypeIDs above (3 = Admin)
-- UserID for Admin = the same UserID you entered for the Users table

NOTES:
--note: you first need to add the details to the Users table, then only update the Admin table with the corresponding UserID
-- DO NOT LEAVE THE UserID, UserTypeID EMPTY

//#########################################################################################################################################
//Inserting a new Visitor to Visitor table

SQL COMMANDS:

Insert into Visitors(UserID, UserTypeID, FirstName, lastName)
values (40, 4, "Ryan", "Renolds");

Insert into Admins(UserID)
values (40);

INSTRUCTIONS:
-- UserID for Users = last UserID + 1 
-- UserTypeID for Users = should pick from the 4 UserTypeIDs above (4 = Visitor)
-- UserID for Visitor = the same UserID you entered for the Users table

NOTES:
--note: you first need to add the details to the Users table, then only update the Visitor table with the corresponding UserID
-- DO NOT LEAVE THE UserID, UserTypeID EMPTY

//#########################################################################################################################################
// When a team submits a new project (regardless of whether it is approved or not)
//Inserting a new Project to Project table and Updating the Student table

SQL COMMANDS:

Insert into Project(ProjectID, ProjectName, IsApproved, projectDec, capstoneYear, capstoneSemester, TeamName, VideoLink, githubLink)
values (1, "ReType Spelling Game", 0, "Our goal was to create a web-based, keyboard-only ReType game and solve problems associated with other similar games",
2022, 1, "Team 1", "https://www.youtube.com/watch?v=k7vhBLqNpSE", "");

UPDATE Student
SET projectID=1
WHERE UserID=36 or UserID=37 or UserID=2 or UserID=40 or UserID=33 or UserID=49;

INSTRUCTIONS for Project table:
-- ProjectID = last ProjectID in the database + 1 (current last ProjectID is 6, so the next one should be 7)
-- IsApproved = 0: If the project is not yet approved / rejected, 1 : If the project is approved
-- projectDec = a simple description about the project

INSTRUCTIONS for Student table:
-- projectID = the same projectID that is inserted to the Project table
-- WHERE UserID=36 or UserID=37.. : the UserIDs of the team members

NOTES:
-- DO NOT LEAVE THE ProjectID EMPTY

//#########################################################################################################################################
//Updating the technologies used by the project

SQL COMMANDS:

Insert into technologiesUsed(techID, technologyName)
values (30, "C++");

Insert into ProjectTech(projectTechID, ProjectID_FK, techID_FK)
values (1, 1, 30);

INSTRUCTIONS:
-- techID = last techID in the technologiesUsed table + 1 (current last ProjectID is 29, so the next one should be 30)
-- projectTechID = last projectTechID in the ProjectTech table + 1 (current last projectTechID is 36, so the next one should be 37)
-- ProjectID_FK = the projectID of the project that uses this technology
-- techID_FK = the techID that the project uses (in this case it is 30, since the project uses C++)

NOTES:
-- YOU DO NOT HAVE TO RUN THE "Insert into technologiesUsed(techID, technologyName)" COMMAND, IF THE TECHNOLOGY IS ALREADY THERE IN THE technologiesUsed tabl
    eg - if C++ is already in the technologiesUsed table with the techID = 2, then use that as the techID_FK in the ProjectTech table entry

//#########################################################################################################################################
//Updating the Project table when a project is approved by the admin

SQL COMMANDS:

UPDATE Project
SET adminID_FK=7, IsApproved =1
WHERE ProjectID=8;

adminID_FK = 7 : this is the adminID for Asma (7)

INSTRUCTIONS:
-- ProjectID = ProjectID of the project that is being approved 
-- adminID_FK = admin who is approving the project


//#########################################################################################################################################
//


*/