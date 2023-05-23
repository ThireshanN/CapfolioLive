import express from 'express';
export const profileRouter = express.Router();
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
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});



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
        return res.status(400).setHeader("Content-Type", "text/plain").send("failed to fetch project data because of " + err);
    }
});


