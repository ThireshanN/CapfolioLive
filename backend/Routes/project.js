import express from 'express';
export const projectRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import { PutObjectCommand, S3Client, S3, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';


class ProjectSchema {
    constructor(ProjectID = null, ProjectName = null, IsApproved = null, projectDec = null, capstoneYear = null, capstoneSemester = null, githubLink = null, adminID_FK = null, TeamName = null, VideoLink = null, ProjectIntro = null, Project_Approach = null) {
        this.ProjectID = ProjectID;
        this.ProjectName = ProjectName;
        this.IsApproved = IsApproved;
        this.projectDec = projectDec;
        this.capstoneYear = capstoneYear;
        this.capstoneSemester = capstoneSemester;
        this.githubLink = githubLink;
        this.adminID_FK = adminID_FK;
        this.TeamName = TeamName;
        this.VideoLink = VideoLink;
        this.ProjectIntro = ProjectIntro;
        this.Project_Approach = Project_Approach;
    }
}

class ProjectSchema2 {
    ProjectID;
    ProjectName;
    IsApproved;
    projectDec;
    capstoneYear;
    capstoneSemester;
    githubLink;
    adminID_FK;
    TeamName;
    VideoLink;
    ProjectIntro;
    Project_Approach;
    constructor() { }
}

async function executeSQLstatement(sql) { //working 23/04/2023
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    //console.log(rows);
    return [rows, result];
}
//executeSQLstatement("SELECT techID, technologyName FROM Capfolio.technologiesUsed WHERE (technologyName='JavaScript' OR technologyName='docker' OR technologyName='nodeJS')");



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

async function ProjectSchemaAndFieldNames() { //working 23/04/2023
    //GET all FIELDS from PROJECT table
    try {
        const sql = "SHOW FIELDS FROM Capfolio.Project";
        let fieldData = (await executeSQLstatement(sql))[0];
        const columnsArray = fieldData.map(element => element['Field']);
        const columnsString = columnsArray.join(", ");
        //console.log('\n\n',columnsArray, columnsString, '\n\n');
        return [columnsArray, columnsString];
    }
    catch (err) {
        console.error("start up the database on AWS console \nOR the error is: " + err);
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
        //console.log("Our Data: \n", projects);
        return res.status(200).setHeader("Content-Type", "application/json").send(projects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
})


//http://localhost:3000/project/AllProjectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData

projectRouter.get('/AllProjectData', async (req, res) => { //working 23/04/2023
    try {
        const sql = "SELECT * FROM Capfolio.Project";
        const allProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", allProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});


//http://localhost:3000/project/FilteredProjectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/FilteredProjectData

projectRouter.get('/FilteredProjectData', async (req, res) => { //working 23/04/2023 YUP
    try {
        //CLIENT DATA FROM FRONTEND 
        const regBodyFromClient = new ProjectSchema2();
        regBodyFromClient.capstoneSemester = 1;
        regBodyFromClient.capstoneYear = '2023';

        const projectFields = (await ProjectSchemaAndFieldNames())[0];
        let finalFilter = [];
        projectFields.forEach(element => myFunction(element));
        function myFunction(element) {
            if (regBodyFromClient[`${element}`] !== undefined) {
                finalFilter.push(`${element} = ${regBodyFromClient[`${element}`]}`);
            }
        }
        finalFilter = finalFilter.join(' AND ');

        const sql = `SELECT * FROM Capfolio.Project WHERE ${finalFilter}`;
        const projects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        if (projects.length === 0) {
            throw new Error("There were no projects found");
        }
        return res.status(200).setHeader("Content-Type", "application/json").send(projects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("Sorry! " + err);
    }
});


//http://localhost:3000/project/AddProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AddProject

projectRouter.post('/AddProject', express.json(), async (req, res) => { //working 23/04/2023
    try {
        //CLIENT DATA FROM FRONTEND
        const regBodyFromClient = new ProjectSchema2();
        regBodyFromClient.ProjectName = '\'Simulacrum\'';
        regBodyFromClient.IsApproved = 1;
        regBodyFromClient.projectDec = '\'progressive web application\'';
        //regBodyFromClient.githubLink = '';
        regBodyFromClient.capstoneYear = '\'2022\'';
        regBodyFromClient.capstoneSemester = 2;
        regBodyFromClient.adminID_FK = 7;
        regBodyFromClient.TeamName = '\'Gan Solutions\'';
        regBodyFromClient.VideoLink = '\'https://www.youtube.com/watch?v=7MmxuVqHpWA\'';
        regBodyFromClient.ProjectIntro = '\'Our goal is to create a progressive web application that helps students find teammates or groups that want to work on the same type of projects\'';

        const projectFields = (await ProjectSchemaAndFieldNames())[0];
        let fieldNames = [];
        let fieldValues = [];
        projectFields.forEach(field => myFunction(field));
        function myFunction(field) {
            if (regBodyFromClient[`${field}`]) {
                fieldNames.push(`${field}`);
                fieldValues.push(regBodyFromClient[`${field}`]);
            }
        }
        fieldNames = fieldNames.join(', ');
        fieldValues = fieldValues.join(', ');

        const sql = `INSERT INTO Capfolio.Project (${fieldNames}) VALUES (${fieldValues})`;
        //console.log(sql);
        const addedProjects = (await executeSQLstatement(sql))[0];
        //console.log("The Data: \n", addedProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(addedProjects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("Sorry! " + err);
    }
});


class ProjectSchema3 {
    ProjectID; //int
    ProjectName; //string
    IsApproved; //int
    projectDec; //string
    capstoneYear; //year/string
    capstoneSemester; //int
    githubLink; //string
    adminID_FK; //int
    TeamName; //string
    VideoLink; //string
    ProjectIntro; //int
    Project_Approach; //int
    Files; //array of strings
    Technologies; //array of strings
    Users; //array of id/int?
    constructor() { }
}

class TechnologiesSchema {
    techID;
    technologyName;
    constructor() { }
}


//http://localhost:3000/project/FormAddProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/FormAddProject

projectRouter.post('/FormAddProject', express.json(), async (req, res) => { //
    try {
        //CLIENT DATA FROM FRONTEND
        const reqBodyFromClient = req.body;

        //insert the respective fields of the project table, into the project table
        //get the id of that inserted project from results
        //get the array of id for those technologies
        //const array = [{ techID: 3, technologyName: 'JavaScript' }]
        //add the entries into the ProjectTech. If there are 4 technologies, then there are 4 new entries
        //then add the files to the S3 bucket


        //PROJECT TABLE
        const projectFields = (await ProjectSchemaAndFieldNames())[0];
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

        const sql = `INSERT INTO Capfolio.Project (${fieldNames}) VALUES (${fieldValues})`;
        const addedProject = (await executeSQLstatement(sql))[0];
        const insertId = addedProject["insertId"];


        //TECHNOLOGIES TABLE
        //we have the ProjectID
        //we need the TechID
        //`INSERT INTO Capfolio.ProjectTech (TechID, ProjectID) VALUES (?, ${insertId})`;
        // reqBodyFromClient.Technologies = ['TypeScript', 'HTML', 'CSS', 'React']; 
        const techArray = reqBodyFromClient.Technologies;
        const newarr = techArray.map(tech => `technologyName=\'${tech}\'`);
        const techStr = newarr.join(' OR ');
        let sqlQueryTech = `SELECT techID, technologyName FROM Capfolio.technologiesUsed WHERE (${techStr})`;
        const selectedTechs = (await executeSQLstatement(sqlQueryTech))[0];
        let finalTechQueries = [];
        selectedTechs.forEach(row => {
            finalTechQueries.push(`INSERT INTO Capfolio.ProjectTech (techID_FK, ProjectID_FK) VALUES (${row.techID}, ${insertId})`)
        });
        const addedProjectTech = await executeMultipleSQLstatement(finalTechQueries);


        //USERS TABLE
        //we have the Student table -> (USERID, USERTYPEID=1, STUDENTUPI, PROJECTID, LINKEDINPROGILE)
        //we have the Users table -> (USERID, USERTYPEID, FIRSTNAME, LASTNAME, EMAIL, PASSWORD)
        //get the userid from the Capfolio.Users table, based on the user name and lastname
        //insert a new record into the Student table, where userid comes from the above, usertypeid=1, studentUPI=blankForNow, projectId=insertedId
        //next question is getting the upi when inserting a record into the Student table.
        //SELECT UserID FROM Capfolio.Users WHERE (FirstName='Daisy' AND lastName='SuperMarioFamily') OR (FirstName='Peach' AND lastName='SuperMarioFamily');
        const users = reqBodyFromClient.Users;
        const whereConditionArr = users.map(user => {
            return `(FirstName=\'${user.FirstName}\' AND lastName=\'${user.lastName}\')`;
        });
        const whereConditionstr = whereConditionArr.join(' OR ');
        const userIds = (await executeSQLstatement(`SELECT UserID FROM Capfolio.Users WHERE ${whereConditionstr}`))[0];
        const finalUserSQLQueries = []
        userIds.forEach(id => {
            finalUserSQLQueries.push(`INSERT INTO Capfolio.Student (UserID, UserTypeID, projectID) VALUES (${id.UserID}, 1, ${insertId})`);
        });
        const addedStudents = await executeMultipleSQLstatement(finalUserSQLQueries);
        

        //ADDING FILES
        const toAddFiles = reqBodyFromClient.Files;
        toAddFiles.forEach(async (file) => await addFilesFunction(file, reqBodyFromClient.TeamName));
        async function addFilesFunction(filename, TeamName) {
            const REGION = "ap-southeast-2";
            const s3ServiceObject = new S3({
                region: REGION,
                credentials: {
                    accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
                    secretAccessKey: '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'
                }
            });
            const fileContent = fs.readFileSync(filename);
            const filenameShort = path.basename(filename);
            const params = {
                Bucket: "capfoliostorage",
                Key: '' + TeamName + "/" + filenameShort,
                Body: fileContent,
                ContentType: "image/*"
            };
            const results = await s3ServiceObject.send(new PutObjectCommand(params));
        }

        return res.status(200).setHeader("Content-Type", "application/json").send({id: insertId});
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("Sorry! " + err);
    }
});


//http://localhost:3000/project/AddProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AddProject
//NEEDS AUTHORIZATION
projectRouter.put('/UpdateProject', express.json(), async (req, res) => { //working 23/04/2023
    try {
        //CLIENT DATA FROM FRONTEND
        const existingProjectDetails = new ProjectSchema2();
        existingProjectDetails.capstoneYear = '\'2022\'';
        existingProjectDetails.ProjectID = 8;
        existingProjectDetails.capstoneSemester = 2;
        const updateProjectDetails = new ProjectSchema2();
        updateProjectDetails.capstoneYear = '\'2023\'';
        updateProjectDetails.capstoneSemester = 1;

        const sqlArray = [];
        const projectFields = (await ProjectSchemaAndFieldNames())[0];
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


//http://localhost:3000/project/uploadFile
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/uploadFile

projectRouter.post('/uploadFile', async (req, res) => { //working 23/04/2023
    try {
        const filename = req.body.filename;
        const TeamName = req.body.TeamName;
        const REGION = "ap-southeast-2";
        const s3ServiceObject = new S3({
            region: REGION,
            credentials: {
                accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
                secretAccessKey: '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'
            }
        });
        const fileContent = fs.readFileSync(filename);
        const filenameShort = path.basename(filename);
        const params = {
            Bucket: "capfoliostorage",
            Key: '' + TeamName + "/" + filenameShort,
            Body: fileContent,
            ContentType: "image/*"
        };
        const results = await s3ServiceObject.send(new PutObjectCommand(params));
        //console.log("Successfully created " + params.Key + " and uploaded it to " + params.Bucket + "/" + params.Key);
        return res.status(200).setHeader("Content-Type", "application/json").send(results);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});


//http://localhost:3000/project/retrieveFile
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/retrieveFile
//NOT COMPLETE YET
projectRouter.get('/retrieveFile', async (req, res) => { //
    try {
        //"filename": "Meowland3/tree.jpg"
        const filename = req.body.filename;
        //console.log("Retrieving file " + filename);
        //const TeamName = req.body.TeamName;
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
        //NOW, figure out a way to read the file, and store it locally, rather than printing the encoding/whatever
        const str = await results.Body.transformToString();
        //console.log(results);
        //console.log("Successfully retrieved " + params.Key + " from " + params.Bucket + "/" + params.Key);
        return res.status(200).setHeader("Content-Type", "application/text").send(str);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});


//module.exports = projectRouter;


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
    {"FirstName": "Daisy", "lastName": "SuperMarioFamily"},
    {"FirstName": "Peach", "lastName": "SuperMarioFamily"},
    {"FirstName": "Browser", "lastName": "SuperMarioFamily"},
    {"FirstName": "Mario", "lastName": "SuperMarioFamily"}]
}
//console.log(JSON.parse(JSON.stringify(data)));