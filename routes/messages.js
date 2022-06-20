var express = require('express');
var router = express.Router();
const Message = require('../models/Message');
const Room = require('../models/Room');

// Create CRUD routes for messages
router.get('/get-messages/:id', function (req, res, next) {
    const { id } = req.params;
    Message.find({ SendInSubject: id }).populate("SendBy").exec(function (err, messages) {
        if (err) return console.log(err)
        res.json({ messages })
    })
});

router.delete('/delete-message/', function (req, res, next) {
    const { messageId } = req.body;
    Message.findByIdAndUpdate(messageId, {DeletedAt: new Date()}, function (err, message) {
        if (err) return console.log(err)
        res.json({ message })
    })
});

router.post('/get-first-message/', function (req, res, next) {
    const { subject, room } = req.body;
    Message.findOne({ SendInRoom: room, SendInSubject:subject, DeletedAt:null }).populate("SendBy").sort("-SendAt").exec(function (err, message) {
        console.log(message)
        if (err) return console.log(err)
        res.json({ message })
    })
});



module.exports = router;
