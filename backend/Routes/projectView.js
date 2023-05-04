import express from 'express';
export const projectViewRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import {currentUserId} from './auth.js';

let viewCount=0;

async function executeSQLstatement(sql) { 
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    return [rows, result];
}

//have to make the technologies input field mandatory

//http://localhost:3000/projects/project?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/project?id=2

projectViewRouter.get("/project", async (req, res) => { 
    const id = req.query.id;
    try {
        const sql = `SELECT ProjectID, Project.ProjectName,IsApproved, projectDec, Project.capstoneYear, Project.capstoneSemester, githubLink, VideoLink, TeamName, ProjectIntro, Project_Approach, GROUP_CONCAT(technologiesUsed.technologyName) AS 'technologies'
        FROM Capfolio.Project
        INNER JOIN ProjectTech ON Project.ProjectID = ProjectTech.ProjectID_FK 
        INNER JOIN technologiesUsed ON ProjectTech.techID_FK = technologiesUsed.techID
        WHERE ProjectID = ${id}
        GROUP BY ProjectID;`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(selectedProject.length===0){
            res.status(404).send("Project not found"); //return 404 if project not found
        }
        else{
            return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});

//http://localhost:3000/projects/award?id=2
//the id here is the same ProjectId as http://localhost:3000/projects/project?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/project?id=2

projectViewRouter.get("/award", async (req, res) => { 
    const projectId = req.query.id;
    try {
        const sql = `SELECT ProjectID, ProjectName,GROUP_CONCAT(Award.AwardName) AS 'awards', GROUP_CONCAT(Award.WinnerType) AS 'place'
        FROM Capfolio.Project
        INNER JOIN ProjectAward ON Project.ProjectID = ProjectAward.ProjectID_FK 
        INNER JOIN Award ON ProjectAward.AwardID_FK = Award.AwardID
        WHERE ProjectID = ${projectId}
        GROUP BY ProjectID;`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        if(selectedProject.length===0){
            res.status(200).setHeader("Content-Type", "text/plain").send("No awards for this project yet!"); //return 404 if project not found
        }
        else{
        return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
        return
    }
});


//http://localhost:3000/projects/comment?id=2
//the id here is the same ProjectId as http://localhost:3000/projects/project?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/project?id=2

projectViewRouter.get("/comment", async (req, res) => { 
    const projectId = req.query.id;
    try {
        const sql = `SELECT CommentDesc, FirstName, lastName, SUBSTRING(createdTime, 1, 10) AS createdTime, ProjectName, UserType FROM Comment INNER JOIN Users ON Comment.UserID_FK = Users.UserID  INNER JOIN Project ON Comment.ProjectID_FK = Project.ProjectID INNER JOIN UserType ON Users.UserTypeID = UserType.UserTypeID  WHERE ProjectID = ${projectId} ORDER BY CommentID DESC;`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        if(selectedProject.length===0){
            res.status(200).send("No comments yet!"); //return 404 if project not found
        }
        else{
        return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
        return
    }
});

//http://localhost:3000/projects/like?id=2
//the id here is the same ProjectId as http://localhost:3000/projects/project?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/like?id=2

projectViewRouter.get("/like", async (req, res) => { 
    const projectID = req.query.id;
    try {
        const sql = `SELECT COUNT(likeID) AS "No_of_likes" FROM likes WHERE ProjectID_FK=${projectID};`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(selectedProject.length===0){
            res.status(404).send("likes not found"); //return 404 if project not found
        }
        else{
        return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});

//http://localhost:3000/projects/postComment?id=2
//the id here is the same ProjectId as http://localhost:3000/projects/project?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/postComment?id=2

async function newComment(comment, projectID){
    if(currentUserId===null){return "Only logged in Users can comment"}
    const sql = `Insert into Comment(CommentDesc, UserID_FK, ProjectID_FK) VALUES ("${comment.CommentDesc}", ${currentUserId}, ${projectID});`;
    //console.log(sql);
    const all_comments = (await executeSQLstatement(sql));
    let message = 'Error in defining a new comment';
    console.log(all_comments);
    if (all_comments.length!==0) {
      message = 'New comment created successfully\n';
    }
  
    return {message};
  }


projectViewRouter.post('/postComment', express.json(), async (req, res) => {

    try {
        //console.log(req.body.CommentDesc);
        let projectID = req.query.id;
        res.json(await newComment(req.body,projectID));
    } catch (err) {
      console.error(`Error while creating a new comment`, err.message);
    }
});

//http://localhost:3000/projects/postLike
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/postLike

async function newLike(likeBody){
    let message = "Error in defining a new like";
    if(currentUserId===null){
        message = "Only loggeed in users can like"
        return message;
    }
    const sql = `Insert into likes(UserID_FK, ProjectID_FK) VALUES (${currentUserId}, ${likeBody.projectId});`;
    //console.log(sql);
    const likes = (await executeSQLstatement(sql));
    if (likes.length!==0) {
      message = 'New like created successfully\n';
    }
  
    return {message};
  }

projectViewRouter.post('/postLike', express.json(), async (req, res) => {

    try {
        //console.log(req.body.CommentDesc);
        res.json(await newLike(req.body));
    } catch (err) {
      console.error(`Error while creating a new like`, err.message);
    }
});


//http://localhost:3000/projects/postDisLike
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/project?id=2

async function newDisLike(dislikeBody){
    if(currentUserId===null){return "Only logged in Users can dislike"}
    const sql = `DELETE From likes WHERE UserID_FK =${currentUserId} and ProjectID_FK = ${dislikeBody.projectId}`;
    //console.log(sql);
    const dislikes = (await executeSQLstatement(sql));
    let message = 'Error in defining a new dislike';
    if (dislikes.length!==0) {
      message = 'New dislike created successfully\n';
    }
  
    return {message};
  }


projectViewRouter.delete('/postDisLike', express.json(), async (req, res) => {

    try {
        //console.log(req.body.CommentDesc);
        res.json(await newDisLike(req.body));
    } catch (err) {
      console.error(`Error while creating a new dislike`, err.message);
    }
});


/*
//http://localhost:3000/projects/likedProjects
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/postLike


projectViewRouter.get("/likedProjects", async (req, res) => { 
    if(currentUserId===null){ return res.status(404).send("Only logged in Users can get likes");}
    try {
        const sql = `SELECT * 
        FROM (
        SELECT ProjectID, '0' AS hasLiked
        FROM Project
        WHERE ProjectID
        not in (
        SELECT ProjectID
        FROM Users
        INNER JOIN likes ON Users.UserId = likes.UserID_FK
        INNER JOIN Project ON Project.ProjectID = likes.ProjectID_FK
        WHERE UserID=43
        GROUP BY Project.ProjectID)
        UNION ALL
        SELECT ProjectID, '1' AS hasLiked
        FROM Users
        INNER JOIN likes ON Users.UserId = likes.UserID_FK
        INNER JOIN Project ON Project.ProjectID = likes.ProjectID_FK
        WHERE UserID=${currentUserId}
        GROUP BY Project.ProjectID) result
        ORDER BY ProjectID;`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(selectedProject.length===0){
            return res.status(404).send("likes not found"); //return 404 if project not found
        }
        else{
        return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});*/


//http://localhost:3000/projects/ProjectsLiked?id=2
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/projects/postLike


projectViewRouter.get("/ProjectsLiked", async (req, res) => { 
    if(currentUserId===null){ return res.status(404).send("Only logged in Users can get likes");}
    try {
        const projectID = req.query.id;
        const sql = `SELECT * 
        FROM (
        SELECT ProjectID, '0' AS hasLiked
        FROM Project
        WHERE ProjectID
        not in (
        SELECT ProjectID
        FROM Users
        INNER JOIN likes ON Users.UserId = likes.UserID_FK
        INNER JOIN Project ON Project.ProjectID = likes.ProjectID_FK
        WHERE UserID=43
        GROUP BY Project.ProjectID)
        UNION ALL
        SELECT ProjectID, '1' AS hasLiked
        FROM Users
        INNER JOIN likes ON Users.UserId = likes.UserID_FK
        INNER JOIN Project ON Project.ProjectID = likes.ProjectID_FK
        WHERE UserID=${currentUserId}
        GROUP BY Project.ProjectID) result
        WHERE ProjectId = ${projectID} 
        ORDER BY ProjectID;`;
        const selectedProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        //console.log("Our Data: \n", selectedProject);
        if(selectedProject.length===0){
            return res.status(404).send("likes not found"); //return 404 if project not found
        }
        else{
        return res.status(200).setHeader("Content-Type", "application/json").send(selectedProject);
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});

//http://localhost:3000/projects/AllProjectsTech
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/project/AllProjectData
projectViewRouter.get('/AllProjectsTech', async (req, res) => {
    try {
        const sql = "SELECT ProjectID, Project.ProjectName,IsApproved, projectDec, capstoneYear, capstoneSemester, githubLink, VideoLink, TeamName, adminID_FK, ProjectIntro, GROUP_CONCAT(technologiesUsed.technologyName) AS 'techologies' FROM technologiesUsed INNER JOIN ProjectTech ON technologiesUsed.techID = ProjectTech.techID_FK INNER JOIN Project ON ProjectTech.ProjectID_FK = Project.ProjectID GROUP BY Project.ProjectID;";
        const allProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        
        return res.status(200).setHeader("Content-Type", "application/json").send(allProjects);
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});