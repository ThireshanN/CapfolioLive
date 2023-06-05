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

//http://localhost:3000/admin/approved/projects
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/projects

adminRouter.get("/approved/projects", async (req, res) => { 
    const id = req.query.id;
    try {
        const sql = `SELECT ProjectID, Project.ProjectName,IsApproved, projectDec, Project.capstoneYear, Project.capstoneSemester, githubLink, VideoLink, TeamName, TeamId, ProjectIntro, Project_Approach, GROUP_CONCAT(technologiesUsed.technologyName) AS 'technologies'
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


/*
{
    id: 261,
    tech:["Java","CSS"]
}
*/

//http://localhost:3000/admin/updateTech
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/updateProject

async function updateTechnologies(project){

    const technologies = project.tech;

    for (let i = 0; i < technologies.length; i++) {
        const sql = `INSERT IGNORE INTO technologiesUsed (technologyName) VALUES ('${technologies[i]}');`
        const result = (await executeSQLstatement(sql));
        if(result[0].warningStatus==0){
            const sqlIn = `Insert into ProjectTech(techID_FK,ProjectID_FK) values (${result[0].insertId},${project.id});`;
            await executeSQLstatement(sqlIn);
        }
        if(result[0].warningStatus==1){
            const sqlIn = `INSERT INTO ProjectTech (techID_FK, ProjectID_FK) VALUES ((SELECT techID FROM technologiesUsed WHERE technologyName = "${technologies[i]}"),${project.id});`;
            await executeSQLstatement(sqlIn);
        }
    }
    const message = 'Tech updated successfully\n'

    return {message}
  }

  
adminRouter.put('/updateTech', express.json(), async (req, res) => {
    try {
        let response = await updateTechnologies(req.body);
        if (response==="Error"){
            res.status(400).setHeader("Content-Type", "application/json").send("Error when running the SQL statement");
        }
        else{
            res.json(response);
        }
    } catch (err) {
      console.error(`Error while updating the project`, err.message);
    }
});




//http://localhost:3000/admin/approveProject
//the id here is the same ProjectId as http://localhost:3000/admin/approveProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/approveProject

async function newProject(project){
    //if(currentUserId!==7){return "Only admin can award projects"}
    const sql = `UPDATE Project SET IsApproved=1 WHERE ProjectId=${project.id};`;
    const projectApprove = (await executeSQLstatement(sql));
    let message = 'Error in approving a new project';
    if (projectApprove.length!==0) {
      message = 'New project approved successfully\n';
    }
  
    return {message};
  }

  
adminRouter.put('/approveProject', express.json(), async (req, res) => {
    try {
        //console.log(req.body);
        res.json(await newProject(req.body));
    } catch (err) {
      console.error(`Error while approving a new project`, err.message);
    }
});

/*
{
    "id": "231",
    "Name": "test",
    "Description": "this is a project",
    "Year": "2023",
    "Semester": "1",
    "github": "https://www.github.com",
    "TeamName": "Snoop",
    "video": "https://www.youtube.com",
    "Intro": "this is the intro",
    "approach": "this is the approach"
}
*/

//http://localhost:3000/admin/updateProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/updateProject
async function updateProject(project){
    const sql = `UPDATE Project 
    SET ProjectName="${project.Name}", projectDec="${project.Description}",capstoneYear="${project.Year}",capstoneSemester="${project.Semester}",
    githubLink="${project.github}", TeamName = "${project.TeamName}", VideoLink="${project.video}",ProjectIntro="${project.Intro}", 
    Project_Approach = "${project.approach}"
    WHERE ProjectID=${project.id};`;
    const userupdate = (await executeSQLstatement(sql));
    let message = 'Error';
    if (userupdate.length!==0) {
      message = 'Project updated successfully\n';
    }
    return {message};
  }

  
adminRouter.put('/updateProject', express.json(), async (req, res) => {
    try {
        let response = await updateProject(req.body);
        if (response==="Error"){
            res.status(400).setHeader("Content-Type", "application/json").send("Error when running the SQL statement");
        }
        else{
            res.json(response);
        }
    } catch (err) {
      console.error(`Error while updating the project`, err.message);
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


//http://localhost:3000/admin/deleteProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/admin/deleteProject

adminRouter.post("/deleteProject", async (req, res) => { 
    const id = req.body.id;
    try {
        const sqlStatements = [`DELETE FROM likes WHERE ProjectID_FK=${id};`,
        `DELETE FROM Comment WHERE ProjectID_FK=${id};`,
        `DELETE FROM Student WHERE projectID=${id};`,
        `DELETE FROM ProjectTech WHERE ProjectID_FK=${id};`,
        `DELETE FROM ProjectAward WHERE ProjectID_FK=${id};`,
        `DELETE FROM Project WHERE ProjectID=${id};`]
        for (const sql of sqlStatements) {
            await executeSQLstatement(sql);
          }
        return res.status(200).setHeader("Content-Type", "text/plain").send("Project deleted successfully");
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch award data because of " + err);
    }
});

