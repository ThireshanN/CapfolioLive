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
        const sql = "SELECT * FROM Capfolio.Comment";
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











