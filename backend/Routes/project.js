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

const projectSchema = {};
async function getProjectSchema() {
    try {
        const sql = "SHOW FIELDS FROM Capfolio.Project";
        let allProjects = await executeSQLstatement(sql);
        allProjects = JSON.parse(allProjects);
        console.log(allProjects.length);
        /*
        for (let i=0; i < allProjects.length; i++) {
            let name = allProjects[i].Field;
            let type = allProjects[i].Type;
            let isnull = allProjects[i].Null;
            let theDefault = allProjects[i].Default;
            
            projectSchema[`${name}`] = {
                type: type,
                isnull: isnull,
                theDefault: theDefault
            }
        }
        */
        //console.log(projectSchema);
    }
    catch (err) {
        console.error("something went wrong in the following function: getProjectSchema()\nstart up the database on AWS console to fix this :)" + err);
    }
};
getProjectSchema();



//http://localhost:3000/project/projectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/projectData
projectRouter.get('/projectData', async (req, res) => {
    try {
        projectSchema.x = "hello world";
        console.log(projectSchema);
        //const sql = "SELECT * FROM Capfolio.Project";
        const sql = "SHOW FIELDS FROM Capfolio.Project";
        const allProjects = await executeSQLstatement(sql)//.catch(err => console.log("The following error generated:\n" + err));
        console.log("Our Data: \n", allProjects);
        return res.status(200).setHeader("Content-Type", "application/json").send("allProjects");
    }
    catch (err) {
        console.log(err.message);
        return res.status(200).setHeader("Content-Type", "text/plain").send("incorrect data supplied/other error encountered");
    }
});


//http://localhost:3000/project/projectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/projectData
projectRouter.post('/projectData', express.json(), async (req, res) => {
    try {
        const details = {};
        const sql = "INSERT INTO Capfolio.Project (name, address) VALUES ('Company Inc', 'Highway 37')";
        const pdata = await executeSQLstatement(sql);
        console.log("Our Data: \n", pdata);
        return res.status(200).setHeader("Content-Type", "application/json").send(pdata);
    }
    catch (err) {

    }
});


//module.exports = projectRouter;