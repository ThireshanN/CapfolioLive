const express = require('express');
const router = express.Router();
const app = express();
const comments = require('./Routes/comments');
const cors = require('cors');
const path = require('path');


app.use(express.text());
app.use(cors());
app.use('/public_api/comments', comments);
app.use('/', router);

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/../FRONTEND/demo.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/front.js', function (req, res) {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname + '/../FRONTEND/front.js'));
});

console.log(path.join(__dirname + '/../FRONTEND/demo.html'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));