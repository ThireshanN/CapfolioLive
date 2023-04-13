const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { sqlconfig } = require('../sqlconfig');

//http://localhost:3000/data/projectData
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/data/projectData
async function getSQLdata(sql) {
    let data = "";
    const connection = await mysql.createConnection(sqlconfig.db);
    const [rows] = await connection.execute(sql);
    data = rows;
    connection.end();
    return data;
}

router.get('/projectData', async (req, res) => {
    const sql = "SELECT * FROM Capfolio.Project";
    const pdata = await getSQLdata(sql);
    console.log("Our Date: \n", pdata);
    return res.status(200).setHeader("Content-Type", "application/json").send(pdata);
})

//http://localhost:3000/data
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/data
router.post('/projectData', express.text(), (req, res) => {
    console.log(req.body);
    if (req.body.length >= 1) {
        databaseComments += req.body + '\n';
        return res.status(200).send(databaseComments);
    }
    else {
        return res.status(404).send("no comment found/posted!");
    }
})

module.exports = router;