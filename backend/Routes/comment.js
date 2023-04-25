import express from 'express';
export const commentRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';

async function executeSQLstatement(sql) { 
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    //console.log(rows, result); 
    await connection.end();
    return [rows, result];
}


//http://localhost:3000/comment/getComments  
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/comment/getComments
commentRouter.get('/getComments', async (req, res) => { 
    try {
        const sql = "SELECT CommentDesc, FirstName, lastName, SUBSTRING(createdTime, 1, 10) AS createdTime, ProjectName, UserType FROM Comment INNER JOIN Users ON Comment.UserID_FK = Users.UserID  INNER JOIN Project ON Comment.ProjectID_FK = Project.ProjectID INNER JOIN UserType ON Users.UserTypeID = UserType.UserTypeID ORDER BY CommentID DESC;";
        const all_comments = (await executeSQLstatement(sql))[0]
        return res.status(200).setHeader("Content-Type", "application/json").send(all_comments);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("Failed to fetch comments due to " + err);
    }
});

//http://localhost:3000/comment/PostComment
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/comment/PostComment
async function newComment(comment){
    const sql = `Insert into Comment(CommentDesc, UserID_FK, ProjectID_FK) VALUES ("${comment.CommentDesc}", ${comment.UserID_FK}, ${comment.ProjectID_FK});`;
    //console.log(sql);
    const all_comments = (await executeSQLstatement(sql));
    let message = 'Error in defining a new comment';
    console.log(all_comments);
    if (all_comments.length!==0) {
      message = 'New comment created successfully\n';
    }
  
    return {message};
  }


commentRouter.post('/PostComment', express.json(), async (req, res) => {

    try {
        console.log(req.body.CommentDesc);
        res.json(await newComment(req.body));
    } catch (err) {
      console.error(`Error while creating a new comment`, err.message);
    }
});


//http://localhost:3000/comment/Projects
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData


commentRouter.get('/Projects', async (req, res) => {
    try {
        const sql = "SELECT ProjectID, Project.ProjectName,IsApproved, projectDec, capstoneYear, capstoneSemester, githubLink, VideoLink, TeamName, adminID_FK, ProjectIntro, GROUP_CONCAT(technologiesUsed.technologyName) AS 'techologies' FROM technologiesUsed INNER JOIN ProjectTech  ON technologiesUsed.techID = ProjectTech.techID_FK INNER JOIN Project ON ProjectTech.ProjectID_FK = Project.ProjectID GROUP BY Project.ProjectID;";
        const allProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});


//http://localhost:3000/comment/PostProjects
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData


async function newProject(project){
    const sql = `Insert into Project(ProjectName,IsApproved, projectDec, capstoneYear, capstoneSemester, githubLink, VideoLink, TeamName, ProjectIntro) VALUES 
    ("${project.ProjectName}", 0, "${project.projectDec}",${project.capstoneYear}, ${project.capstoneSemester},"${project.githubLink}","${project.VideoLink}","${project.TeamName}","${project.ProjectIntro}");`;
    //console.log(sql);
    const all_comments = (await executeSQLstatement(sql));
    let message = 'Error in defining a new comment';
    console.log(all_comments);
    if (all_comments.length!==0) {
      message = 'New project created successfully\n';
    }
  
    return {message};
  }


commentRouter.post('/PostProjects', express.json(), async (req, res) => {

    try {
        console.log(req.body.CommentDesc);
        res.json(await newProject(req.body));
    } catch (err) {
      console.error(`Error while creating a new comment`, err.message);
    }
});