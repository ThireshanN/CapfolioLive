import express from 'express';
export const projectRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import { PutObjectCommand, S3, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import { error } from 'console';


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
    Meow;
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


async function ProjectTableFields() { //working 23/04/2023
    try {
        const sql = "SHOW FIELDS FROM Capfolio.Project";
        let fieldData = (await executeSQLstatement(sql))[0];
        const columnsArray = fieldData.map(element => element['Field']);
        const columnsString = columnsArray.join(", ");
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
        return res.status(200).setHeader("Content-Type", "application/json").send(projects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed because of " + err);
    }
})


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
        GROUP BY ProjectID ORDER BY ProjectID;
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
        HAVING Project.ProjectName like "${searchWord}%"
        ORDER BY ProjectID;
        `;
        const allProjects = (await executeSQLstatement(sql))[0]
        if(allProjects.length===0){
            res.status(200).setHeader("Content-Type", "application/json").send("No projects can be found for the given search phrase"); 
        }
        else{
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
        ) GROUP BY Project.ProjectID 
        ORDER BY 
          ${filterFields.SortBy[0] === "Oldest to latest" ? "Project.capstoneYear ASC, Project.capstoneSemester ASC" : ""}
          ${filterFields.SortBy[0] === "Latest to oldest" ? "Project.capstoneYear DESC, Project.capstoneSemester DESC" : ""}
          ${filterFields.SortBy[0] === "Highest to lowest likes" ? "likes DESC" : ""}
          ${filterFields.SortBy[0] === "Lowest to highest likes" ? "likes ASC" : ""}
          ${filterFields.SortBy[0] === "Alphabetical (A - Z)" ? "Project.ProjectName ASC" : ""}
          ${filterFields.SortBy[0] === "Alphabetical (Z - A)" ? "Project.ProjectName DESC" : ""}
          ${filterFields.SortBy[0] === null ? "Project.capstoneYear ASC, Project.capstoneSemester ASC" : ""};`;
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


//http://localhost:3000/project/FormAddProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/FormAddProject
projectRouter.post('/FormAddProject', express.json(), async (req, res) => { //
    try {
        //CLIENT DATA FROM FRONTEND
        const reqBodyFromClient = req.body;

        //PROJECT TABLE
        const projectFields = (await ProjectTableFields())[0];
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


        //USERS TABLE based on "Users": [ {"FirstName": "Daisy", "lastName": "SuperMarioFamily"} ]
        // const users = reqBodyFromClient.Users; //actually the UPIs
        // const whereConditionArr = users.map(user => {
        //     return `(FirstName=\'${user.FirstName}\' AND lastName=\'${user.lastName}\')`;
        // });
        // const whereConditionstr = whereConditionArr.join(' OR ');
        // const userIds = (await executeSQLstatement(`SELECT UserID FROM Capfolio.Users WHERE ${whereConditionstr}`))[0];
        // const finalUserSQLQueries = []
        // userIds.forEach(id => {
        //     finalUserSQLQueries.push(`INSERT INTO Capfolio.Student (UserID, UserTypeID, projectID) VALUES (${id.UserID}, 1, ${insertId})`);
        // });
        // const addedStudents = await executeMultipleSQLstatement(finalUserSQLQueries);


        //USERS TABLE based on Users: ['upi']
        //get the userId based on the UPI's provided
        //if UPI is not found in the database, create a new user and only populate the upi field? then when the user actually registers themselves, it check the database for that upi, and just populates the rest of the fields, rather than creating a duplicate record
        const UPIs = reqBodyFromClient.Users; //actually the UPIs
        const checkForMissingUPIarray = UPIs.map(upi => { return `SELECT \'${upi}\' AS MissingUPI`; });
        const checkForMissingUPIstring = checkForMissingUPIarray.join(' UNION ALL ');
        const checkForMissingUPICommand = (await executeSQLstatement(`SELECT v.MissingUPI FROM (${checkForMissingUPIstring}) v WHERE v.MissingUPI NOT IN (SELECT StudentUPI FROM Capfolio.Student)`))[0];
        const noSuchUPI = checkForMissingUPICommand.map(element => element.MissingUPI);
        UPIs.forEach(async upi => {
            if (noSuchUPI.includes(upi)) {
                //they have no userid, so just insert into student table, and populate ProjectID and UserTypeID and StudentUPI
                const rows = (await executeSQLstatement(`INSERT INTO Capfolio.Student (projectID, UserTypeID, StudentUPI) VALUES (${insertId}, 1, \'${upi}\')`))[0];
            } else {
                //all valid upis, userid already exist for them?, insert into Student table and just populate ProjectID and UserTypeID
                const rows = (await executeSQLstatement(`UPDATE Capfolio.Student SET projectID = ${insertId}, UserTypeID = 1 WHERE Capfolio.Student.StudentUPI = \'${upi}\'`))[0];
            }
        });


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

        //    return res.status(200).setHeader("Content-Type", "application/json").send({ id: insertId });
    }
    catch (err) {
        //console.log(err.message);
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
projectRouter.get('/listTeamFiles/:TeamName', async (req, res) => { //WORKS 29/04/2023
    try {
        //"TeamName": "Meowland"
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
            Prefix: req.params.TeamName //omit this, to list all files in capfoliostorage
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
        const projectFields = (await ProjectTableFields())[0];
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

