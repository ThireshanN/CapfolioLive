const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const comments = require('./Routes/comments');
const { dnsAWS } = require('./public/address');
const mysql = require('mysql');
const fs = require('fs');
const AWS = require('aws-sdk');


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', comments);
app.get('/test', (req, res) => {
    //http://localhost:3000/test
    res.send(`Hello. This route works!`);
})


const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`App listening on port ${port}\nGo to http://localhost:3000 if testing locally\nGo to http://${dnsAWS}:3000 if using on aws`); });

module.exports.connection = connection;






/*

const BUCKET_NAME = 'capfoliostorage';
const ep = new AWS.Endpoint('s3://arn:aws:s3:ap-southeast-2:282697465706:accesspoint/s3accesspoint');
const s3 = new AWS.S3({
    endpoint: "s3accesspoint-6ok88abfsiwargpupwyi3xqcr4sihaps2a-s3alias"
});
const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'atree.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};
uploadFile("tree.jpg");




//capfoliodb.cnducntmxm4l.ap-southeast-2.rds.amazonaws.com
const connection = mysql.createConnection({
    host: "capfoliodb.cnducntmxm4l.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "admincapfolio", //use environment variables
    port: "3306",
    database: "Capfolio"
});
function abc() {
    connection.connect(function (err) {
        if (err) {
            console.error('Database failed to connect: ' + err.stack);
            throw err;
        }
        console.log("Connected!");
        const sql = "CREATE TABLE test2 (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
        const sql2 = "ALTER TABLE test2 ADD COLUMN cint INT";
        connection.query(sql2, function (err, result) {
            if (err) {
                console.log(err.sqlMessage);
                throw err;
            }
            console.log("Table created/edited: " + result);
        });
    });
    connection.end();
}
//abc(); //ideally call this function once
//connection.end();

*/