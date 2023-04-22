import express from 'express';
export const projectRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';



async function executeSQLstatement(sql) {
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    //console.log(rows, result);
    await connection.end();
    return JSON.stringify(rows);
}

//generate code to get the scheme and save it in a class
//create a schema/data model folder with the classes
//then when node app.js, and a post route gets called, then check the req.body against it
//that way, with every restart, we always get the correct schema/data model
async function getProjectFields() {
    try {
        const sql = "SHOW FIELDS FROM Capfolio.Project";
        let fieldData = await executeSQLstatement(sql);
        fieldData = JSON.parse(fieldData);
        const columnsArray = fieldData.map(element => element['Field']);
        const columnsString = columnsArray.join(", ");
        console.log(fieldData);
        console.log(columnsArray);
        console.log(columnsArray.join(", "));
        return [columnsArray, columnsString];

    }
    catch (err) {
        console.error("something went wrong in getProjectSchema()\nstart up the database on AWS console to fix this :)" + err);
    }
};
getProjectFields();



//http://localhost:3000/project/projectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/projectData
projectRouter.get('/projectData', async (req, res) => {
    try {
        const sql = "SELECT * FROM Capfolio.Project";
        const allProjects = await executeSQLstatement(sql)//.catch(err => console.log("The following error generated:\n" + err));
        console.log("Our Data: \n", allProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        console.log(err.message);
        return res.status(200).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
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
        const columnData = getProjectFields();
        const fields = columnData[1];
        const values = validateClientRequest(columnData[0], req.body.data); //either req.body or req.body.data
        const sql = `INSERT INTO Capfolio.Project (${fields}) VALUES (${values}))`;
        const pdata = await executeSQLstatement(sql);
        console.log("The Data: \n", pdata);
        return res.status(200).setHeader("Content-Type", "application/json").send(pdata);
    }
    catch (err) {
        console.log("error occured: " + err);
    }
});


//module.exports = projectRouter;