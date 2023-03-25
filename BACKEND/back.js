const express = require('express');
const router = express.Router();
const app = express();
const comments = require('./Routes/comments');
const cors = require('cors');
const path = require('path');

app.use('/', router);
app.use(express.text());
app.use(cors());
app.use('/public_api/comments', comments);


//http://localhost:3000/
router.get('/', function (req, res) {
    return res.sendFile(path.join(__dirname + '/../FRONTEND/demo.html')).sendFile(path.join(__dirname + '/../FRONTEND/front.js'));
    //__dirname : It will resolve to your project folder.
});

console.log(path.join(__dirname + '/../FRONTEND/demo.html'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
