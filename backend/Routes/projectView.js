import express from 'express';
export const projectViewRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';

async function executeSQLstatement(sql) { //working 23/04/2023
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    return [rows, result];
}


//http://localhost:3000/projects/project?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/project?id=2

projectViewRouter.get("/project", async (req, res) => { 
    const id = req.query.id;
    try {
        const sql = `SELECT * FROM Capfolio.Project WHERE ProjectID = ${id}`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(selectedProject.length===0){
            res.status(404).send("Item not found"); //return 404 if project not found
        }
        return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});
