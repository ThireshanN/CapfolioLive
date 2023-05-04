
import express from 'express';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import './passport-setup.js';
import { authRouter } from './Routes/auth.js';
//import { demoCommentRouter } from './Routes/demoComments.js';
import { commentRouter } from './Routes/comment.js';
import { projectRouter } from './Routes/project.js';
import { projectViewRouter } from './Routes/projectView.js';
import { adminRouter } from './Routes/admin.js';
import { dnsAWS } from './addresses.js';
import { fileURLToPath } from 'url';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//app.use(express.static(path.join(__dirname, '../frontend/public'))); //basic comment website with html
//app.use(express.static(path.join(__dirname, '../clientdemo/build'))); //basic website with react
app.use(express.static(path.join(__dirname, '../capfolio/build'))); //final website with react
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



//GOOGLE AUTH ROUTES:
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));
// Add authRouter
app.use('/auth', authRouter);
// Add session and passport middleware
app.use(
    session({
        secret: 'your-session-secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
// Google OAuth 2.0 authentication route
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);
// Google OAuth 2.0 callback route
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);




//app.use('/demoApi', demoCommentRouter);
app.use('/comment', commentRouter);
app.use('/project', projectRouter);
app.use('/projects', projectViewRouter);
app.use('/admin', adminRouter);
app.get('/test', (req, res) => {   
    //http://localhost:3000/test
    res.send(`Hello World!`);
    //res.json({"users": ['userUno', 'userDos', 'userTres']});
})



app.get('/*', (req, res) => { //http:localhost:3000/
    //res.sendFile(path.join(__dirname, '../clientdemo/build', index.html));
    res.sendFile(path.join(__dirname, '../capfolio/build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})


const port = process.env.PORT || 3000;
app.listen(port, () => { 
    console.log(`App listening on port ${port}\nGo to http://localhost:3000 (testing locally)\nGo to http://${dnsAWS}:3000 (testing on AWS)`); 
});



/*
//#########################################################################################################################################
//Using SDK V3
const REGION = "ap-southeast-2";
const s3ServiceObject = new S3({ region: REGION, credentials: { accessKeyId: 'AKIAUDUQU75VEF3VDCEL', secretAccessKey: '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' } });
const run = async (fileName) => {
    try {
        const fileContent = fs.readFileSync(fileName);
        const params = { Bucket: "capfoliostorage", Key: "winterTree4.jpg", Body: fileContent, ContentType: "image/jpeg"};
        const results = await s3ServiceObject.send(new PutObjectCommand(params));
        console.log("Successfully created " + params.Key + " and uploaded it to " + params.Bucket + "/" + params.Key);
        return results; // For unit tests.
    } catch (err) {
        console.log("Error", err);
    }
};
run("tree.jpg");

//#######################################################################################################################################
//Using SDK V2
const BUCKET_NAME = 'capfoliostorage';
const ID = 'AKIAUDUQU75VEF3VDCEL';
const SECRET = '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';
const s3 = new AWS.S3({ //initialize s3 client
    accessKeyId: ID,
    secretAccessKey: SECRET
});
const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'winterTree.jpg', // File name you want to save as in S3
        Body: fileContent,
        ContentType: "image/jpeg"
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
//#########################################################################################################################################


//#########################################################################################################################################
//RDS, MySQL
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
//#########################################################################################################################################
*/