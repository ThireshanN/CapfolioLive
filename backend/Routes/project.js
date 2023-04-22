import express from 'express';
export const projectRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';



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


async function executeSQLstatement(sql) { //working 22/04/2023 YUP
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    //console.log(rows, result); 
    await connection.end();
    return [rows, result];
}

async function ProjectSchemaAndFieldNames() { //working 22/04/2023 YUP
    try {
        const sql = "SHOW FIELDS FROM Capfolio.Project";
        let fieldData = (await executeSQLstatement(sql))[0];
        const columnsArray = fieldData.map(element => element['Field']);
        const columnsString = columnsArray.join(", ");
        //console.log('\n\n',columnsArray, columnsString, '\n\n');
        return [columnsArray, columnsString];
    }
    catch (err) {
        console.error("something went wrong in ProjectSchemaAndFieldNames()\nstart up the database on AWS console to fix this " + err);
    }
};
//ProjectSchemaAndFieldNames(); //working 22/04/2023 YUP








//http://localhost:3000/project/AllProjectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData

projectRouter.get('/AllProjectData', async (req, res) => { //working 22/04/2023 YUP
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

projectRouter.get('/FilteredProjectData', async (req, res) => { //working 22/04/2023 YUP
    try {
        const regBodyFromClient = new ProjectSchema2();
        regBodyFromClient.capstoneSemester = 2;
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
        const allProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", allProjects);
        console.log(allProjects);
        if (allProjects.length === 0) {
            throw new Error("There were no projects found");
        }
        console.log(typeof allProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("Sorry! " + err);
    }
});



//http://localhost:3000/project/AddProjectAllFields
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AddProjectAllFields
/*
req.body:
{
    "data": {
        'ProjectName': '',
        'IsApproved': '',
        'projectDec': '',
        'capstoneYear': '',
        'capstoneSemester': '',
        'githubLink': '',
        'adminID_FK': '',
        'TeamName': '',
        'VideoLink': '',
        'ProjectIntro': ''
    };
}
*/
function validateClientRequest(fieldsArray, data) {
    if (fieldsArray[0] === 'ProjectID') {
        fieldsArray.shift();
    }
    const fieldsFromReqObject = Object.keys(data);
    const isValidArray = fieldsFromReqObject.map(element => fieldsArray.includes(element.toString()));
    if (isValidArray.length === fieldsArray.length) {
        let dataEntry = Object.entries(data);
        let newdata = fieldsArray.map(element => {
            return data.element;
        });
        const valueString = "('" + newdata.join("', '") + "')";
        return valueString;
    } else {
        throw new Error("Invalid client request");
    }


}

projectRouter.post('/AddProjectAllFields', express.json(), async (req, res) => {
    try {
        const columnData = ProjectSchemaAndFieldNames();
        const fields = columnData[1];
        const values = validateClientRequest(columnData[0], req.body.data); //either req.body or req.body.data
        const sql = `INSERT INTO Capfolio.Project (${fields}) VALUES (${values}))`;
        const pdata = (await executeSQLstatement(sql))[0];
        console.log("The Data: \n", pdata);
        return res.status(200).setHeader("Content-Type", "application/json").send(pdata);
    }
    catch (err) {
        console.log("error occured: " + err);
    }
});


//module.exports = projectRouter;