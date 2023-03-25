const express = require('express');
const router = express.Router();
const path = require('path');

let databaseComments = "";

//http://localhost:3000/public_api/comments
router.post('/', async (req, res) => {
    if (req.body.length >= 1) {
      databaseComments += req.body + '\n';
      return res.status(200).send(databaseComments);
    }
    else {
      return res.status(404).send("no comment found/posted!");
    }
});



module.exports = router;


