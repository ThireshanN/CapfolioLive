const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const comments = require('./Routes/comments');
const mysql = require('mysql');
var dns = require('dns');

const IPadresses = dns.getServers();
console.log(IPadresses);
console.log(IPadresses[0]);
const ip = IPadresses[0];
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
    console.log(hostname);
    // Prints: localhost ssh
});
dns.lookupService(ip, 22, (err, hostname, service) => {
    console.log(hostname, service);
    // Prints: localhost ssh
});

//capfoliodb.cnducntmxm4l.ap-southeast-2.rds.amazonaws.com
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
}
abc(); //ideally call this function once
//connection.end();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', comments);
app.get('/test', (req, res) => {
    //http://localhost:3000/test
    res.send(`Hello. This route works!`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`App listening on port ${port}\nGo to http://localhost:3000 if testing locally\nGo to http://ec2-3-27-94-14.ap-southeast-2.compute.amazonaws.com:3000 if using on aws`); });

module.exports.connection = connection;

//http://127.0.0.1:3000/
//http://localhost:3000/