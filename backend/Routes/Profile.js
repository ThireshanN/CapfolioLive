import express from 'express';
export const profileRouter = express.Router();
import mysql from 'mysql2/promise';
import { config } from '../sqlconfig.js';
import {currentUserId} from './auth.js';

async function executeSQLstatement(sql) { 
    const connection = await mysql.createConnection(config.db);
    const [rows, result] = await connection.execute(sql);
    await connection.end();
    //console.log(rows, result);
    return [rows, result];
}

/*
{
    "userID": "42"
}
*/

//http://localhost:3000/profile/likedProjects
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/profile/likedProjects
profileRouter.get('/likedProjects', async (req, res) => { 
    
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
        HAVING ProjectID in (SELECT ProjectID_FK
       FROM likes
       WHERE UserID_FK=${req.query.id})
        ORDER BY viewCount;
        `;
        const likedProjects = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        return res.status(200).setHeader("Content-Type", "application/json").send(likedProjects);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "application/json").send("failed to fetch project data because of " + err);
    }
});

/*
{
    "userID": "28"
}
*/

//http://localhost:3000/profile/userProject
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/profile/userProject
profileRouter.get('/userProject', async (req, res) => { 
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
        HAVING ProjectID in (SELECT projectID
            FROM Student
            WHERE UserID=${req.query.id});
        `;
        const ownProject = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        return res.status(200).setHeader("Content-Type", "application/json").send(ownProject);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "application/json").send("failed to fetch project data because of " + err);
    }
});


 /*
{
    "firstName": "Michelle",
    "lastName": "Obama",
    "linkedin": "https://www.linkedin.com/company/dictgovph/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3Bdft4rqMXS4aUq4xBNpzNtw%3D%3D",
    "github": "https://github.com/geraldweber",
    "userDesc": "Passionate SE",
    "profession": "Student"
}
 */


//http://localhost:3000/profile/updateUser
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/profile/updateUser
async function updateUser(project){
    if(currentUserId===null){return "login"}
    const sql = `UPDATE Users 
    SET FirstName="${project.firstName}", lastName="${project.lastName}", linkedin="${project.linkedin}", githublink="${project.github}", userDescription="${project.userDesc}", profession="${project.profession}"
    WHERE UserID=${currentUserId};`;
    const userupdate = (await executeSQLstatement(sql));
    let message = 'Error';
    if (userupdate.length!==0) {
      message = 'User updated successfully\n';
    }
    return {message};
  }

  
profileRouter.put('/updateUser', express.json(), async (req, res) => {
    try {
        //console.log(req.body);
        //res.json(await updateUser(req.body));
        let response = await updateUser(req.body);
        if(response==="login"){
            res.status(400).setHeader("Content-Type", "application/json").send("Log in to update the profile page");
        }
        else if (response==="Error"){
            res.status(400).setHeader("Content-Type", "application/json").send("Error when running the SQL statement");
        }
        else{
            res.json(response);
        }
    } catch (err) {
      console.error(`Error while updating the user`, err.message);
    }
});

//http://localhost:3000/profile/userInfo
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/profile/userInfo
profileRouter.get('/userInfo', async (req, res) => { 
    try {
        if(currentUserId===null){
            return res.status(400).setHeader("Content-Type", "application/json").send("log in to view the profile");
        }
        const sql = `
        SELECT UserTypeID, FirstName, lastName, Picture, linkedin, githublink,userDescription,profession
        FROM Users
        WHERE UserID=${currentUserId};`;
        const user = (await executeSQLstatement(sql))[0]//.catch(err => console.log("The following error generated:\n" + err));
        return res.status(200).setHeader("Content-Type", "application/json").send(user);
    }
    catch (err) {
        //console.log(err.message);
        return res.status(400).setHeader("Content-Type", "application/json").send("failed to fetch user data because of " + err);
    }
});


