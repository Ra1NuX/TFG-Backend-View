var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');


// add a new room
/* Creating a new room with the name and maxUsers from the request body. It is also generating a unique
access key for the room. */
router.post('/add', function (req, res, next) {
    const { name, maxUsers } = req.body;
    const AccessKey = uuidv4();

    const room = {
        Name: name,
        MaxUsers: maxUsers,
        AccessKey,
    }

    new Room(room).save();
    res.json(room);
});

// remove a room
/* Removing a room from the database. */
router.post('/remove', function (req, res, next) {
    const { roomId } = req.body;
    Room.findByIdAndDelete(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to remove room', error: err }); return }
        res.json(room);
    });
});

// get all rooms
/* This is a get request to the route /r. It is getting all the rooms in the database and returning
them as a json object. */
router.get('/', function (req, res, next) {
    Room.find({}, function (err, rooms) {
        if (err) { res.json({ message: 'Error when getting rooms', error: err }); return }
        res.json(rooms);
    });
});

// get a room
/* This is a post request to the route /r/:id. It is getting the room with the id from the request
params and returning it as a json object. */
router.post('/:id', function (req, res, next) {
    const { id } = req.params;
    Room.findById(id, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get room', error: err }); return }
        res.json(room);
    });
});

//get a room by access key
/* This is a post request to the route /r/key/:accesskey. It is getting the room with the accesskey
from the request params and returning it as a json object. */
router.post('/key/:accesskey', function (req, res, next) {
    const { accesskey } = req.params;
    Room.findOne({ AccessKey: accesskey }, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get room', error: err }); return }
        res.json(room);
    });
})

// add user to room
/* Adding a user to a room. */
router.post('/add-user', function (req, res, next) {
    const { AccessKey, userId } = req.body;
    Room.find(AccessKey, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to add user to room', error: err }); return }
        room.Users.push(userId);
        room.save();
        res.json(room);
    });
})

// remove user from room
/* Removing a user from a room. */
router.post('/remove-user', function (req, res, next) {
    const { roomId, userId } = req.body;
    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to remove user from room', error: err }); return }
        room.Users.pull(userId);
        room.save();
        res.json(room);
    });
})

// get all users in room
/* Getting the room with the id from the request body and returning the users in the room as a json
object. */
router.post('/users', function (req, res, next) {
    const { roomId } = req.body;
    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get users in room', error: err }); return }
        res.json(room.Users);
    });
});


/* Adding a subject to a room. */
router.post('/add-subject', function (req, res, next) {
    const { roomId, subject } = req.body;
    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to add subject to room', error: err }); return }
        room.Subjects.push(subject);
        room.save();
        res.json(room);
    });
})

// remove subject
/* Removing a subject from a room. */
router.post('/remove-subject', function (req, res, next) {
    const { roomId, subject } = req.body;
    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to remove subject from room', error: err }); return }
        room.Subjects.pull(subject);
        room.save();
        res.json(room);
    });
})

// get all subjects in room
/* Getting the room with the id from the request body and returning the subjects in the room as a json
object. */
router.post('/subjects', function (req, res, next) {
    const { roomId } = req.body;
    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get subjects in room', error: err }); return }
        res.json(room.Subjects);
    });
});








module.exports = router;
