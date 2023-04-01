const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const comments = require('./Routes/comments');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "capfoliodb.cnducntmxm4l.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "admincapfolio",
    port: "3306"
});
connection.connect(function(err) {
    if (err) {
        console.error('Database failed to connect: ' + err.stack);
        return;
    }
    console.log('Database succesffuly connected.');
});
connection.end();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', comments); 
app.get('/test', (req, res) => {
    res.send(`Hello. This route works!`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}\nGo to http://localhost:3000 if testing locally\nGo to http://ec2-3-27-94-14.ap-southeast-2.compute.amazonaws.com:3000 if using on aws`);})