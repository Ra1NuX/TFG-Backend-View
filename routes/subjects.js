var express = require('express');
var router = express.Router();
const Subject = require('../models/Subject');

// Create CRUD routes for messages
router.post('/add', function (req, res, next) {
    const { name, code } = req.body;
    const subject = {
        Name:name,
        Code:code,
    }
    new Subject(subject).save();
    res.json(subject);

});

//REMOVE 
router.post('/remove', function (req, res, next) {
    const { subjectId } = req.body;
    Subject.findByIdAndDelete(subjectId, function (err, subject) {
        if (err) { res.json({ message: 'Error when trying to remove subject', error: err }); return }
        res.json(subject);
    });
});


module.exports = router;
