import express from 'express';
export const adminRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
//import {currentUserId} from './auth.js';

async function executeSQLstatement(sql) { 
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    return [rows, result];
}

//have to make the technologies input field mandatory

//http://localhost:3000/admin/approve/projects
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/projects

adminRouter.get("/approve/projects", async (req, res) => { 
    const id = req.query.id;
    try {
        const sql = `SELECT ProjectID, Project.ProjectName,IsApproved, projectDec, Project.capstoneYear, Project.capstoneSemester, githubLink, VideoLink, TeamName, ProjectIntro, Project_Approach, GROUP_CONCAT(technologiesUsed.technologyName) AS 'technologies'
        FROM Capfolio.Project
        INNER JOIN ProjectTech ON Project.ProjectID = ProjectTech.ProjectID_FK 
        INNER JOIN technologiesUsed ON ProjectTech.techID_FK = technologiesUsed.techID
        WHERE IsApproved = 0
        GROUP BY ProjectID;`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(selectedProject.length===0){
            res.status(404).send("Project not found"); //return 404 if project not found
        } /*
        else if(currentUserId!==7){
            res.status(404).send("Only the admin can access all projects"); //return 404 if user do not have admin rights
        }*/
        else{
            return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});


//http://localhost:3000/admin/postAward
//the id here is the same ProjectId as http://localhost:3000/projects/postAward?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/postAward?id=2

async function newAward(projectAward){
    //if(currentUserId!==7){return "Only admin can award projects"}
    const sql = `Insert into ProjectAward(AwardID_FK,ProjectID_FK, capstoneYear, capstoneSemester, adminID_FK)
    values (${projectAward.AwardID}, ${projectAward.ProjectID}, ${projectAward.Year}, ${projectAward.Semester}, 7);`;
    console.log(projectAward.AwardID);
    const new_award = (await executeSQLstatement(sql));
    let message = 'Error in awarding a new project';
    console.log(new_award);
    if (new_award.length!==0) {
      message = 'New project award created successfully\n';
    }
  
    return {message};
  }

  
adminRouter.post('/postAward', express.json(), async (req, res) => {

    try {
        //console.log(req.body);
        res.json(await newAward(req.body));
    } catch (err) {
      console.error(`Error while awarding a new project`, err.message);
    }
});

/*
{
    "AwardID":2,
    "ProjectID":2,
    "Year":2022,
    "Semester":1
}
*/


//http://localhost:3000/admin/awards
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/projects

adminRouter.get("/awards", async (req, res) => { 
    const id = req.query.id;
    try {
        const sql = `select distinct(AwardName) From Award;`;
        const awardList = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(awardList.length===0){
            res.status(404).send("Awards not found"); //return 404 if project not found
        } /*
        else if(currentUserId!==7){
            res.status(404).send("Only the admin can access all projects"); //return 404 if user do not have admin rights
        }*/
        else{
            return res.status(200).setHeader("Content-Type", "application/json").send(awardList);
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch award data because of " + err);
    }
});
