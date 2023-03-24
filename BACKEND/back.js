const express = require('express');
const app = express();
const comments = require('./Routes/comments');
const cors = require('cors');


app.use(express.text());
app.use(cors());
app.use('/public_api/comments', comments);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
