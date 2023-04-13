const express = require('express');
const router = express.Router();
let databaseComments = "The COMMENTS:\n";

//http://localhost:3000/api
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/api
router.get('/', (req, res) => {
    return res.send(databaseComments);
})


//http://localhost:3000/api
//http://ec2-3-26-95-151.ap-southeast-2.compute.amazonaws.com:3000/api
router.post('/', express.text(), (req, res) => {
    console.log(req.body);
    if (req.body.length >= 1) {
        databaseComments += req.body + '\n';
        return res.status(200).send(databaseComments);
      }
      else {
        return res.status(404).send("no comment found/posted!");
      }
})

module.exports = router;