const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const comments = require('./Routes/comments');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api', comments); //REMOVE IF NOT WORKING
app.get('/test', (req, res) => {
    res.send(`Hello. This route works!`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}\n Go to http://localhost:3000`);})