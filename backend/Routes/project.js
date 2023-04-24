import express from 'express';
export const projectRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import { PutObjectCommand, S3Client, S3, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';


class ProjectSchema {
    constructor(ProjectID = null, ProjectName = null, IsApproved = null, projectDec = null, capstoneYear = null, capstoneSemester = null, githubLink = null, adminID_FK = null, TeamName = null, VideoLink = null, ProjectIntro = null) {
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
    constructor() { }
}

async function executeSQLstatement(sql) { //working 23/04/2023
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    return [rows, result];
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

async function ProjectSchemaAndFieldNames() { //working 23/04/2023
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
//ProjectSchemaAndFieldNames(); 





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
        console.log("Our Data: \n", projects);
        return res.status(200).setHeader("Content-Type", "application/json").send(projects);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
})


//http://localhost:3000/project/AllProjectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData

projectRouter.get('/AllProjectData', async (req, res) => { //working 23/04/2023
    try {
        const sql = "SELECT * FROM Capfolio.Project";
        const allProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        console.log("Our Data: \n", allProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        console.log(err.message);
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
        console.log(err.message);
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
        console.log(sql);
        const addedProjects = (await executeSQLstatement(sql))[0];
        console.log("The Data: \n", addedProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(addedProjects);
    }
    catch (err) {
        console.log(err.message);
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
        console.log("The Data: \n", updatedProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(updatedProjects);
    }
    catch (err) {
        console.log(err.message);
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
        console.log("Successfully created " + params.Key + " and uploaded it to " + params.Bucket + "/" + params.Key);
        return res.status(200).setHeader("Content-Type", "application/json").send(results);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});


//http://localhost:3000/project/retrieveFile
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/retrieveFile

projectRouter.get('/retrieveFile', async (req, res) => { //
    try {
        const filename = req.body.filename;
        console.log("Retrieving file " + filename);
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
        console.log(results);
        //console.log("Successfully retrieved " + params.Key + " from " + params.Bucket + "/" + params.Key);
        return res.status(200).setHeader("Content-Type", "application/text").send(str);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
});

//module.exports = projectRouter;