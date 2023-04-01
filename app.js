const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const comments = require('./Routes/comments');
const mysql = require('mysql');
var dns = require('dns');

const IPadresses = dns.getServers();
console.log(IPadresses);

dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
    console.log(hostname);
    // Prints: localhost ssh
});

dns.lookupService('192.168.1.1', 22, (err, hostname, service) => {
    console.log(hostname, service);
    // Prints: localhost ssh
});

const connection = mysql.createConnection({
    host: "capfoliodb.cnducntmxm4l.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "admincapfolio", //use environment variables
    port: "3306",
    database: "Capfolio"
});
function createTables() {
    connection.connect(function (err) {
        if (err) {
            console.error('Database failed to connect: ' + err.stack);
            return;
        }
        console.log('Database successfully connected.');
        const sql = "CREATE TABLE comments (id INT AUTO_INCREMENT PRIMARY KEY, namee VARCHAR(255), message VARCHAR(255))";
        connection.query(sql, function (err, result) {
            if ("Table 'comments' already exists" == err.sqlMessage) {
                console.log("table already exists! Try another sql statement like ALTER TABLE");
                process.exit(1);
                //console.log(err.stack);
                //throw err;
            } else {
                console.log("Table created: " + result);
            };
        });
    });
}
//createTables(); //ideally call this function once
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