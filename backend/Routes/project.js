import express from 'express';
export const projectRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import { PutObjectCommand, S3, GetObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { error } from 'console';
import { currentUserId } from './auth.js';


export class ProjectDetails {
    ProjectID; //int
    ProjectName; //string
    IsApproved; //int
    projectDec; //string
    capstoneYear; //int
    capstoneSemester; //int
    githubLink; //string
    adminID_FK; //int
    TeamName; //string
    VideoLink; //string
    ProjectIntro; //string
    Project_Approach; //string
    Files; //array of string
    Technologies; //aray of string
    Users; //array of UPIs
    constructor() { }
}

export class ProjectFilter {
    capstoneYear; // array of string
    capstoneSemester; //array of int
    technologyName; //array of string
    AwardName; //array of string
    SortBy; //['likes'] OR ['ProjectID'] OR []
    constructor() { }
}

async function executeSQLstatement(sql) { //working 23/04/2023
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    return [rows, result];
}

async function executeSQLstatement2(sql, connection) { //working 23/04/2023
    const [rows, result] = await connection.execute(sql);
    return [rows, result];
}


async function sqlCommandsTransactionExample() {
    const connection = await mysql.createConnection(config.db);
    await connection.beginTransaction();
    try {
        let [rows, result] = await connection.execute(`UPDATE Project SET projectDec='Hello World!' WHERE ProjectID=154;`);
        [rows, result] = await connection.execute(`UPDATE Project SET projectDec2='Hello!!!!!' WHERE ProjectID=154;`);
        await connection.commit();
        await connection.end();
        return [rows, result];
    } catch (err) {
        console.log(err.message);
        await connection.rollback();
        await connection.end();
    }
}


async function executeMultipleSQLstatement(sqlArray) { //working 23/04/2023
    const connection = await mysql.createConnection(config.db);
    let rowArray = [];
    sqlArray.forEach(async (element) => { await myFunction(element) });
    async function myFunction(element) {
        const [rows] = await connection.execute(element);
        rowArray.push([rows]);
    };
    await connection.end();
    return rowArray;
}

async function executeMultipleSQLstatement2(sqlArray, connection) { //working 23/04/2023
    let rowArray = [];
    sqlArray.forEach(async (element) => { await myFunction(element) });
    async function myFunction(element) {
        const [rows] = await connection.execute(element);
        rowArray.push([rows]);
    };
    return rowArray;
}


async function TableFieldNames(tableName = null) { //working 23/04/2023
    try {
        if (!tableName) {
            throw new Error('no tableName specified');
        }
        const sql = `SHOW FIELDS FROM Capfolio.${tableName}`;
        let fieldData = (await executeSQLstatement(sql))[0];
        const columnsArray = fieldData.map(element => element['Field']);
        const columnsString = columnsArray.join(", ");
        return [columnsArray, columnsString];
    }
    catch (err) {
        console.error(err.message);
    }
};



//################################################################################################################
//ROUTES
//################################################################################################################

//http://localhost:3000/project/executeSQLcommand
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/executeSQLcommand
projectRouter.get('/executeSQLcommand', async (req, res) => {
    try {

        const sql = req.body.sql;
        if (!sql) {
            throw new Error('no sql command provided in request body');
        }
        const projects = (await executeSQLstatement(sql))[0];
        return res.status(200).setHeader("Content-Type", "application/json").send(projects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
})

//http://localhost:3000/project/technologyNames
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData
projectRouter.get('/technologyNames', async function (req, res) {
    const sql = `SELECT GROUP_CONCAT(technologyName ORDER BY technologyName ASC) as technology FROM Capfolio.technologiesUsed;`;
    const resultArray = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
    const technologyArray = resultArray[0].technology.split(',');
    return res.status(200).setHeader("Content-Type", "application/json").send(technologyArray);
});


//http://localhost:3000/project/AllProjectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData
projectRouter.get('/AllProjectData', async (req, res) => { //working 28/04/2023
    try {
        const sql = `
        SELECT Project.*, count(DISTINCT likeID) AS likes, GROUP_CONCAT(DISTINCT technologiesUsed.technologyName) AS Technologies, AwardName, AwardDesc
        FROM Project LEFT JOIN ProjectAward ON ProjectAward.ProjectID_FK = Project.ProjectID
        LEFT JOIN ProjectTech ON ProjectTech.ProjectID_FK = Project.ProjectID
        LEFT JOIN Award ON Award.AwardID = ProjectAward.AwardID_FK
        LEFT JOIN technologiesUsed ON technologiesUsed.techID = ProjectTech.techID_FK
        LEFT JOIN likes ON likes.ProjectID_FK = Project.ProjectID
        WHERE Project.IsApproved = 1
        GROUP BY ProjectID ORDER BY viewCount;
        `;
        const allProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});

//http://localhost:3000/project/searchProject?keyword=Spellz
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData
projectRouter.get('/searchProject', async (req, res) => {
    const searchWord = req.query.keyword;
    try {
        const sql = `
        SELECT Project.*, count(DISTINCT likeID) AS likes, GROUP_CONCAT(DISTINCT technologiesUsed.technologyName) AS Technologies, AwardName, AwardDesc
        FROM Project LEFT JOIN ProjectAward ON ProjectAward.ProjectID_FK = Project.ProjectID
        LEFT JOIN ProjectTech ON ProjectTech.ProjectID_FK = Project.ProjectID
        LEFT JOIN Award ON Award.AwardID = ProjectAward.AwardID_FK
        LEFT JOIN technologiesUsed ON technologiesUsed.techID = ProjectTech.techID_FK
        LEFT JOIN likes ON likes.ProjectID_FK = Project.ProjectID
        WHERE Project.IsApproved = 1
        GROUP BY ProjectID 
        HAVING Project.ProjectName like "%${searchWord}%"
        ORDER BY ProjectID;
        `;
        const allProjects = (await executeSQLstatement(sql))[0]
        if (allProjects.length === 0) {
            res.status(200).setHeader("Content-Type", "application/json").send("No projects can be found for the given search phrase");
        }
        else {
            return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
        }
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});

//http://localhost:3000/project/FilteredProjectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/FilteredProjectData
projectRouter.post('/FilteredProjectData', async (req, res) => { //working 28/04/2023 YUP
    try {
        //CLIENT DATA FROM FRONTEND 
        const filterFields = req.body;

        if (!filterFields) {
            throw new Error();
        }


        const sql = `SELECT Project.*, count(DISTINCT likes.likeID) AS likes, GROUP_CONCAT(DISTINCT technologiesUsed.technologyName) AS Technologies, GROUP_CONCAT(DISTINCT Award.AwardName) AS AwardName, GROUP_CONCAT(DISTINCT Award.AwardDesc) AS AwardDesc
        FROM Project
        LEFT JOIN ProjectAward ON ProjectAward.ProjectID_FK = Project.ProjectID
        LEFT JOIN ProjectTech ON ProjectTech.ProjectID_FK = Project.ProjectID
        LEFT JOIN Award ON Award.AwardID = ProjectAward.AwardID_FK
        LEFT JOIN technologiesUsed ON technologiesUsed.techID = ProjectTech.techID_FK
        LEFT JOIN likes ON likes.ProjectID_FK = Project.ProjectID

        WHERE (
          Project.IsApproved = 1
          AND ${filterFields.capstoneYear.length === 0 ? "TRUE" : `Project.capstoneYear IN ('${filterFields.capstoneYear.join('\', \'')}')`}
          AND ${filterFields.capstoneSemester.length === 0 ? "TRUE" : `Project.capstoneSemester IN (${filterFields.capstoneSemester.join(', ')})`}
          AND ${filterFields.AwardName.length === 0 ? "TRUE" : `Award.AwardName IN ('${filterFields.AwardName.join('\', \'')}')`}
          AND ${filterFields.technologyName.length === 0 ? "TRUE" : `technologiesUsed.technologyName IN ('${filterFields.technologyName.join('\', \'')}')`}
        ) 
        
        GROUP BY Project.ProjectID 
        
        ORDER BY 
          ${filterFields.SortBy[0] === "Oldest to latest" ? "Project.capstoneYear ASC, Project.capstoneSemester ASC" : ""}
          ${filterFields.SortBy[0] === "Latest to oldest" ? "Project.capstoneYear DESC, Project.capstoneSemester DESC" : ""}
          ${filterFields.SortBy[0] === "Highest to lowest likes" ? "likes DESC" : ""}
          ${filterFields.SortBy[0] === "Lowest to highest likes" ? "likes ASC" : ""}
          ${filterFields.SortBy[0] === "Alphabetical (A - Z)" ? "Project.ProjectName ASC" : ""}
          ${filterFields.SortBy[0] === "Alphabetical (Z - A)" ? "Project.ProjectName DESC" : ""}
          ${filterFields.SortBy[0] === "Highest to lowest views" ? "Project.viewCount DESC" : ""}
          ${filterFields.SortBy[0] === "Lowest to highest views" ? "Project.viewCount ASC" : ""}
          ${filterFields.SortBy[0] === null ? "Project.capstoneYear ASC, Project.capstoneSemester ASC" : ""};
          `;


        const projects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        if (projects.length === 0) {
            throw new Error("There were no projects found" + error);
        }
        return res.status(200).setHeader("Content-Type", "application/json").send(projects);
    }
    catch (err) {
        const errorarray = []
        return res.status(400).setHeader("Content-Type", "application/json").send(errorarray);
    }
});

//http://localhost:3000/project/projectTeamId
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/projectTeamId
projectRouter.get('/projectTeamId', async (req, res) => {
    try {
        const sql = `SELECT GROUP_CONCAT(TeamId) AS AllTeamIds FROM Capfolio.Project;`;
        const { AllTeamIds } = (await executeSQLstatement(sql))[0][0];
        const AllTeamIdsArray = AllTeamIds.split(',');
        return res.status(200).send(AllTeamIdsArray);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
})

//http://localhost:3000/project/addTeamMembers
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/addTeamMembers
projectRouter.put('/addTeamMembers', async (req, res) => {
    try {
        const memberUPIs = req.body.memberUPIs; //['kcou558', 'kcou559'];
        const projectID = req.body.projectID; //7;
        const { TeamLeader, ProjectName } = (await executeSQLstatement(`SELECT TeamLeader, ProjectName FROM Capfolio.Project WHERE ProjectID = ${projectID}`))[0][0];
        const currentLoggedInUser = currentUserId; //84
        let additionalMessage = '';

        if (!TeamLeader) {
            throw new Error(`no assigned team leader for ${ProjectName}`)
        }
        if (currentLoggedInUser != TeamLeader || !currentLoggedInUser) {
            throw new Error("Sorry you must be the team leader to make changes.")
        }

        //upi exists in student table (has signed in with uni email at least once)
        let sqlQueries = ['SET SQL_SAFE_UPDATES = 0;', '', 'SET SQL_SAFE_UPDATES = 1;'];
        sqlQueries[1] = `UPDATE Capfolio.Student SET projectID = ${projectID} WHERE StudentUPI IN ('${memberUPIs.join('\', \'')}')`;
        const updatedStudents = (await executeMultipleSQLstatement(sqlQueries))[0];


        //if upi does not exist in student table, then they have not signed in as a student
        //return the invalid upi so the team leader knows
        const sql2 = `SELECT group_concat(DISTINCT StudentUPI) AS studentUPIs FROM Capfolio.Student;`;
        const { studentUPIs } = (await executeSQLstatement(sql2))[0][0];
        const studentUPIsArray = studentUPIs.split(',');
        const MissingUPI = [];
        memberUPIs.forEach(member => {
            studentUPIsArray.includes(member) ? '' : MissingUPI.push(member);
        });
        if (MissingUPI.length != 0) {
            additionalMessage = `However the following students have not logged in with their uni email: ${MissingUPI}`;
            const connection = await mysql.createConnection(config.db);
            await connection.beginTransaction();
            // console.log(MissingUPI);
            try {
                for (let upi of MissingUPI) { //student = 'kcou558'
                    const userExists = (await executeSQLstatement(`SELECT COUNT(*) AS userExists FROM Users WHERE Email = '${upi}@aucklanduni.ac.nz';`, connection))[0][0].userExists;
                    if (userExists) { //user record found but no student record
                        const getUserId = (await executeSQLstatement2(`SELECT UserID FROM Capfolio.Users WHERE Email = '${upi}@aucklanduni.ac.nz';`, connection))[0][0].UserID;
                        // console.log('userExists and id is ' + getUserId);
                        // console.log('studentDoesntExist');
                        const studentSql = `INSERT INTO Capfolio.Student (UserID, projectID, UserTypeID, StudentUPI, isRegistered) VALUES (${getUserId}, ${projectID}, 1, '${upi}', 0)`;
                        await executeSQLstatement2(studentSql, connection);
                    } else { //no user record but no student record
                        const addedUser = (await executeSQLstatement2(`INSERT INTO Capfolio.Users (UserTypeID, Email) VALUES (1, '${upi}@aucklanduni.ac.nz')`, connection))[0];
                        const userInsertId = addedUser["insertId"];
                        // console.log('no user found but inserted id is ' + userInsertId);
                        // console.log('studentDoesntExist');
                        const studentSql = `INSERT INTO Capfolio.Student (UserID, projectID, UserTypeID, StudentUPI, isRegistered) VALUES (${userInsertId}, ${projectID}, 1, '${upi}', 0)`;
                        await executeSQLstatement2(studentSql, connection);
                        //however is student exists but user doesnt, inconsistent data
                    }
                }
                await connection.commit();
                await connection.end();
            } catch (err) {
                console.log(err.message);
                await connection.rollback();
                await connection.end();
            }
        }

        res.status(200).send(`Successfully updated ${ProjectName}. ${additionalMessage}`);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

//http://localhost:3000/project/FormAddProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/FormAddProject
projectRouter.post('/FormAddProject', express.json(), async (req, res) => { //
    //START SQL CONNECTION and TRANSACTION
    const connection = await mysql.createConnection(config.db);
    await connection.beginTransaction();

    try {
        //CLIENT DATA FROM FRONTEND
        const reqBodyFromClient = req.body; 

        //###################################################################################################################
        //###################################################################################################################

        //PROJECT TABLE
        const projectFields = (await TableFieldNames('Project'))[0];
        let fieldNames = [];
        let fieldValues = [];
        projectFields.forEach(field => myFunction(field));
        function myFunction(field) {
            if (reqBodyFromClient[`${field}`]) {
                fieldNames.push(`${field}`);
                fieldValues.push(reqBodyFromClient[`${field}`]);
            }
        }
        fieldNames = fieldNames.join(', ');
        fieldValues = fieldValues.join(', ');
        //PROJECT TABLE SQL COMMANDS
        console.log("llalalal");
        const projectSql = `INSERT INTO Capfolio.Project (${fieldNames}) VALUES (${fieldValues})`;
        const addedProject = (await executeSQLstatement2(projectSql, connection))[0];
        const projectInsertId = addedProject["insertId"];
        console.log("successfully added project")

        const TeamLeaderId = reqBodyFromClient['TeamLeader'];
        console.log(TeamLeaderId);
        //update teamleader project is to the new one (team members are done, but not team leader)
        let updateSql = `UPDATE Capfolio.Student SET projectID = ${projectInsertId} WHERE Capfolio.Student.UserID = ${TeamLeaderId}`;
        await executeSQLstatement2(updateSql, connection);
        console.log('updated for team leader');

        //###################################################################################################################
        //###################################################################################################################

        //ProjectTech TABLE
        const techArray = reqBodyFromClient.Technologies;
        let finalQueries = [];

        const selectNewTech = techArray.map(tech => { return `SELECT \'${tech}\' AS NewTech`; });
        const newTechSql = `SELECT v.NewTech FROM (${selectNewTech.join(' UNION ALL ')}) v WHERE v.NewTech NOT IN (SELECT technologyName FROM Capfolio.technologiesUsed);`
        const newTechArr = ((await executeSQLstatement2(newTechSql, connection))[0]).map(ele => ele.NewTech);
        for (let newTech of newTechArr) {
            console.log(newTech);
            (await executeSQLstatement2(`INSERT INTO Capfolio.technologiesUsed (technologyName) VALUES (\'${newTech}\');`, connection));
        }

        const sqlQueryTech = `SELECT techID, technologyName FROM Capfolio.technologiesUsed WHERE technologiesUsed.technologyName IN (\'${techArray.join('\', \'')}\')`;
        const selectedTechs = (await executeSQLstatement2(sqlQueryTech, connection))[0];
        selectedTechs.forEach(row => {
            finalQueries.push(`INSERT INTO Capfolio.ProjectTech (techID_FK, ProjectID_FK) VALUES (${row.techID}, ${projectInsertId})`)
        });
        const addedProjectTech = await executeMultipleSQLstatement2(finalQueries, connection);
        console.log("successfully added technologies");

        //###################################################################################################################
        //###################################################################################################################

        //USERS TABLE 
        //based on Users: [{upi: 'kcou558', firstname: 'kristen', lastname: 'coupe'}, {upi: 'kcou551', firstname: 'krisone', lastname: 'coupe'}];
        //get the userId based on the UPI's provided. If UPI not found in database, create a new student and populate ProjectID and UserTypeID and StudentUPI, however the USERID field is automatiicaly set.
        //When the user officially registers/signs up, auth.js will check the database
        //and then get the USERID from student record and create a new user and set the user id to the USERID from student record
        const users = reqBodyFromClient.Users;
        const sqlSelect = users.map(user => { return `SELECT \'${user.upi}\' AS MissingUPI`; });
        const missingUPICommand = (await executeSQLstatement2(`SELECT v.MissingUPI FROM (${sqlSelect.join(' UNION ALL ')}) v WHERE v.MissingUPI NOT IN (SELECT StudentUPI FROM Capfolio.Student)`, connection))[0];
        const unRegUsers = missingUPICommand.map(element => element.MissingUPI);
        for (let user of users) {
            await updateUsersandStudents(user);
        }
        async function updateUsersandStudents(user) {
            let upi = user.upi.trim();
            let FirstName = user.FirstName.trim();
            let lastName = user.lastName.trim();
            let studentSql = '';
            const userExists = (await executeSQLstatement2(`SELECT COUNT(*) AS userExists FROM Users WHERE Email = '${upi}@aucklanduni.ac.nz';`, connection))[0][0].userExists;
            const studentDoesntExist = unRegUsers.includes(upi);

            if (userExists) { //user record found
                const getUserId = (await executeSQLstatement2(`SELECT UserID FROM Capfolio.Users WHERE Email = '${upi}@aucklanduni.ac.nz';`, connection))[0][0].UserID;
                console.log('userExists and id is ' + getUserId);
                studentSql = `UPDATE Capfolio.Student SET UserID = ${getUserId}, projectID = ${projectInsertId}, UserTypeID = 1 WHERE Capfolio.Student.StudentUPI = \'${upi}\'`; //Found student record
                if (studentDoesntExist) { //student record NOT found
                    console.log('studentDoesntExist');
                    studentSql = `INSERT INTO Capfolio.Student (UserID, projectID, UserTypeID, StudentUPI, isRegistered) VALUES (${getUserId}, ${projectInsertId}, 1, '${upi}', 0)`;
                }
                await executeSQLstatement2(studentSql, connection);
            } else { //no user record
                const addedUser = (await executeSQLstatement2(`INSERT INTO Capfolio.Users (UserTypeID, FirstName, lastName, Email) VALUES (1, '${FirstName}', '${lastName}', '${upi}@aucklanduni.ac.nz')`, connection))[0];
                const userInsertId = addedUser["insertId"];
                console.log('no user found but inserted id is ' + userInsertId);
                studentSql = `UPDATE Capfolio.Student SET UserID = ${userInsertId}, projectID = ${projectInsertId}, UserTypeID = 1 WHERE Capfolio.Student.StudentUPI = \'${upi}\'`; //nfound student record
                if (studentDoesntExist) { //student record NOT found
                    console.log('studentDoesntExist');
                    studentSql = `INSERT INTO Capfolio.Student (UserID, projectID, UserTypeID, StudentUPI, isRegistered) VALUES (${userInsertId}, ${projectInsertId}, 1, '${upi}', 0)`;
                }
                await executeSQLstatement2(studentSql, connection);
                //however is student exists but user doesnt, inconsistent data
            }
        };
        console.log("successfully added users")
        //###################################################################################################################
        //###################################################################################################################

        //ADDING FILES

        //    const toAddFiles = reqBodyFromClient.Files;
        //    if (toAddFiles !== undefined || toAddFiles.length != 0) {
        //        toAddFiles.forEach(async (file) => await addFilesFunction(file, reqBodyFromClient.TeamName));
        //        async function addFilesFunction(file, TeamName) {
        //            const rawFile = String.raw`${file}`;
        //            const filename = (rawFile.split('\\')).join('/');
        //            if (fs.existsSync(filename)) {
        //                console.log('file exists');
        //            } else {
        //                console.log('file not found!');
        //            }

        //            const REGION = "ap-southeast-2";
        //            const s3ServiceObject = new S3({
        //                region: REGION,
        //                credentials: {
        //                    accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
        //                    secretAccessKey: '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'
        //                }
        //            });
        //            const fileContent = fs.readFileSync(filename);
        //            const filenameShort = path.basename(filename);
        //            const params = {
        //                Bucket: "capfoliostorage",
        //                Key: '' + TeamName + "/" + filenameShort,
        //                Body: fileContent,
        //                ContentType: "image/*"
        //            };
        //            const results = await s3ServiceObject.send(new PutObjectCommand(params));
        //        }
        //    }

        //###################################################################################################################
        //###################################################################################################################

        //CLOSE CONNECTION and COMMIT TRANSACTION
        const message = unRegUsers.length === 0 ? '' : 'but the following students have not registered!: ' + unRegUsers;
        const returnData = { id: projectInsertId, message: 'successfully added the project! ' + message };
        await connection.commit();
        await connection.end();
        return res.status(200).setHeader("Content-Type", "application/json").send(returnData);
    }
    catch (err) {
        console.log(err.message);
        await connection.rollback();
        await connection.end();
        return res.status(400).setHeader("Content-Type", "text/plain").send("Sorry! " + err);
    }
});


//http://localhost:3000/project/uploadFile
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/uploadFile
projectRouter.post('/uploadFile', async (req, res) => {
    try {
        const file = req.body.filename;
        const TeamName = req.body.TeamName;
        const rawFile = String.raw`${file}`;
        const filename = (rawFile.split('\\')).join('/');
        if (fs.existsSync(filename)) {
            console.log('file exists');
        } else {
            console.log('file not found!');
            //throw new Error('no such file found!');
        }

        const REGION = "ap-southeast-2";
        const s3ServiceObject = new S3({
            region: REGION,
            credentials: {
                accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
                secretAccessKey: '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'
            }
        });
        //const fileContent = fs.readFileSync(filename);
        const fileContent = fs.readFileSync(filename, { encoding: 'base64' });
        //console.log(fileContent.toString());
        const filenameShort = path.basename(filename);
        const params = {
            Bucket: "capfoliostorage",
            Key: '' + TeamName + "/" + filenameShort,
            Body: fileContent,
            ContentType: "image/*"
        };
        const results = await s3ServiceObject.send(new PutObjectCommand(params));
        //console.log("Successfully created " + params.Key + " and uploaded it to " + params.Bucket + "/" + params.Key);
        return res.status(200).setHeader("Content-Type", "application/json").send("results\n\n");
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});

//http://localhost:3000/project/uploadMultipleFiles
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/uploadMultipleFiles
projectRouter.post('/uploadMultipleFiles', async (req, res) => {
    try {
        const files = req.body.files;
        const TeamName = req.body.TeamName;

        const REGION = "ap-southeast-2";
        const s3ServiceObject = new S3({
            region: REGION,
            credentials: {
                accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
                secretAccessKey: '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'
            }
        });

        const resultsArray = files.map(async file => {
            const rawFile = String.raw`${file}`;
            const filename = (rawFile.split('\\')).join('/');

            if (fs.existsSync(filename)) {
                console.log('file exists');
            } else {
                console.log('file not found!');
                //throw new Error('no such file found!');
            }
            const fileContent = fs.readFileSync(filename);
            //console.log(fileContent.toString());
            const filenameShort = path.basename(filename);
            const params = {
                Bucket: "capfoliostorage",
                Key: '' + TeamName + "/" + filenameShort,
                Body: fileContent,
                ContentType: "image/*"
            };
            const results = await s3ServiceObject.send(new PutObjectCommand(params));
            return results;
        });
        //for some reason, the resultsArray returns empty
        //probablbly the promise not fullfilled yet
        return res.status(200).send("successfully uploaded the files");
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});

//http://localhost:3000/project/deleteFiles
projectRouter.delete('/deleteFiles', async (req, res) => {
    const files = req.body.files;  //["DeleteME3/autumn.jpg", "DeleteME3/zeus.png"];
    const filesToDelete = [];        // = [{ Key: `${TeamId}/autumn.jpg` }, { Key: `${TeamId}/zeus.png` }];
    for (let filename of files) {
        filesToDelete.push({ Key: `${filename}` });
    }

    const REGION = "ap-southeast-2";
    const s3ServiceObject = new S3({
        region: REGION,
        credentials: {
            accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
            secretAccessKey: '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'
        }
    });
    const command = new DeleteObjectsCommand({
        Bucket: "capfoliostorage",
        Delete: {
            Objects: filesToDelete, //[{ Key: "folder/object1.txt" }, { Key: "folder/object2.txt" }], // Objects: filesToDelete,
        },
    });

    try {
        const { Deleted } = await s3ServiceObject.send(command);
        console.log(
            `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`
        );
        console.log(Deleted.map((d) => ` • ${d.Key}`).join("\n"));
        return res.status(200).setHeader("Content-Type", "text/plain").send("successfully deleted the files");
    } catch (err) {
        console.error(err);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to delete files because of " + err);
    }
});


//http://localhost:3000/project/retrieveFile/Meowland3/tree.jpg
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/retrieveFile/Meowland3/tree.jpg
projectRouter.get('/retrieveFile/:File([\\w\\S]+)', async (req, res) => { //WORKS 29/04/2023

    try {
        //(\\d+)
        //"filename": "DeleteME/tree.jpg";
        const filename = req.params.File;

        const REGION = "ap-southeast-2";
        const s3ServiceObject = new S3({
            region: REGION,
            credentials: {
                accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
                secretAccessKey: '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'
            }
        });

        const params = {
            Bucket: "capfoliostorage",
            Key: filename
        };

        const results = await s3ServiceObject.send(new GetObjectCommand(params));
        const base64encoding = await results.Body.transformToString("base64");
        const srcString = `data:${results.ContentType};base64,` + base64encoding;
        const simpleHTML = `
            <!DOCTYPE html>
                <html>
                <body>

                <h2>Images on Another Server</h2>

                <img src="${srcString}" alt="W3Schools.com" style="width:104px;height:142px;">

                </body>
                </html>`;
        return res.status(200).send(srcString);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});

//http://localhost:3000/project/listTeamFiles/DeleteME
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/listTeamFiles/DeleteME
projectRouter.get('/listTeamFiles/:TeamId', async (req, res) => { //WORKS 29/04/2023
    try {
        //"TeamId": "Meowland"
        const REGION = "ap-southeast-2";
        const s3ServiceObject = new S3({
            region: REGION,
            credentials: {
                accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
                secretAccessKey: '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'
            }
        });

        const params = {
            Bucket: "capfoliostorage",
            Prefix: req.params.TeamId + "/" //omit this prefix, to list all files in capfoliostorage
        };

        const command = new ListObjectsV2Command(params);
        let isTruncated = true;
        const fileList = [];
        while (isTruncated) {
            const { Contents, IsTruncated, NextContinuationToken } = await s3ServiceObject.send(command);
            Contents.forEach(file => { fileList.push(file.Key) });
            isTruncated = IsTruncated;
            command.input.ContinuationToken = NextContinuationToken;
        }
        return res.status(200).send(fileList);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});


//http://localhost:3000/project/AddProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AddProject
//NEEDS AUTHORIZATION and NOT COMPLETE YET
projectRouter.put('/UpdateProject', express.json(), async (req, res) => { //working 23/04/2023
    try {
        //CLIENT DATA FROM FRONTEND
        const existingProjectDetails = new ProjectDetails();
        existingProjectDetails.capstoneYear = '\'2022\'';
        existingProjectDetails.ProjectID = 8;
        existingProjectDetails.capstoneSemester = 2;
        const updateProjectDetails = new ProjectDetails();
        updateProjectDetails.capstoneYear = '\'2023\'';
        updateProjectDetails.capstoneSemester = 1;

        const sqlArray = [];
        const projectFields = (await TableFieldNames('Project'))[0];
        projectFields.forEach(field => myFunction(field));
        function myFunction(field) {
            if (updateProjectDetails[`${field}`]) {
                const sql = `UPDATE Capfolio.Project SET ${field} = ${updateProjectDetails[`${field}`]} WHERE ProjectID = ${existingProjectDetails.ProjectID}`;
                sqlArray.push(sql);
            }
        }

        const updatedProjects = await executeMultipleSQLstatement(sqlArray);
        //console.log("The Data: \n", updatedProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(updatedProjects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("Sorry! " + err);
    }
});


const data = {
    "ProjectName": "'Meow'",
    "IsApproved": 0,
    "projectDec": "'progressive web application'",
    "githubLink": "'http: //github.com'",
    "capstoneYear": "'2022'",
    "capstoneSemester": 1,
    "adminID_FK": 7,
    "TeamName": "'Animal'",
    "VideoLink": "'https: //www.youtube.com'",
    "ProjectIntro": "'Our goal is to create'",
    "Project_Approach": "'Our goal is to create'",
    "Files": [
        "C:/Users/Krist/OneDrive/Desktop/Compsci 399/Capfolio Project/Images/winterTree.jpg",
        "C:/Users/Krist/OneDrive/Desktop/Compsci 399/Capfolio Project/Images/summerTree.jpg",
        "C:/Users/Krist/OneDrive/Desktop/Compsci 399/Capfolio Project/Images/autumnTree.jpg"],
    "Technologies": ["TypeScript", "HTML", "CSS", "React"],
    "Users": [
        { "FirstName": "Daisy", "lastName": "SuperMarioFamily" },
        { "FirstName": "Peach", "lastName": "SuperMarioFamily" },
        { "FirstName": "Browser", "lastName": "SuperMarioFamily" },
        { "FirstName": "Mario", "lastName": "SuperMarioFamily" }]
}
//console.log(JSON.parse(JSON.stringify(data)));




//module.exports = projectRouter;

