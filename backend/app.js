
import express from 'express';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import './passport-setup.js';
import { authRouter } from './Routes/auth.js';
//import { commentRouter } from './Routes/comments.js';
import { commentRouter } from './Routes/comment.js';
import { projectRouter } from './Routes/project.js';
import { dnsAWS } from '../frontend/public/address.mjs';
import { fileURLToPath } from 'url';


const app = express();
//for ES Module (removed CJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//app.use(express.static(path.join(__dirname, '../frontend/public')));
//app.use(express.static(path.join(__dirname, '../clientdemo/build')));
app.use(express.static(path.join(__dirname, '../capfolio/build')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


//app.use('/api', commentRouter);
app.use('/comment', commentRouter);
app.use('/project', projectRouter);
app.get('/test', (req, res) => {   
    //http://localhost:3000/test
    res.send(`Hello World!`);
    //res.json({"users": ['userUno', 'userDos', 'userTres']});
})
app.get('/', (req, res) => {   
    //http:localhost:3000/
    //res.sendFile(path.join(__dirname, '../clientdemo/build', index.html));
    res.sendFile(path.join(__dirname, '../capfolio/build', index.html));
})

/*
app.use('/api', commentRouter);
app.use('/project', projectRouter);
app.get('/getcomments', (req, res) => {
    //http://localhost:3000/getcomments

    const comments = [
        {
            id: 1,
            name: 'John',
            comment: 'This is a cool project'
        },
        {
            id: 2,
            name: 'Alice',
            comment: 'Well Done!',
        },
        {
            id: 3,
            name: 'Bob',
            comment: 'Would love to see some social features'
        },
        {
            id: 4,
            name: 'Bob',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in felis interdum, volutpat dolor id, egestas dolor. Vestibulum nec felis a enim suscipit condimentum a vel nisl. Praesent aliquam sit amet augue ac volutpat. Nullam imperdiet id dolor at tincidunt. Quisque ultricies tempor nibh, a imperdiet purus sagittis aliquet. Donec nisl odio, venenatis sit amet lobortis sit amet, placerat ut massa. Morbi bibendum imperdiet ante ut eleifend. Etiam vehicula, magna et volutpat tempor, enim ex fringilla lectus, in dignissim massa odio quis neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam sed metus et mauris.'
        }
    ]
    
    res.send(comments);
})


app.use('/api', commentRouter);
app.use('/project', projectRouter);
app.post('/postcomments', express.text() , (req) => {
    //http://localhost:3000/postcomments

    console.log(req.body);


   
})*/

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`App listening on port ${port}\nGo to http://localhost:3000 if testing locally\nGo to http://${dnsAWS}:3000 if using on aws`); });



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