var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Credentials = require('../models/Credentials');
const Room = require('../models/Room');
const Subject = require('../models/Subject');
const User = require('../models/User');

const getClientData = () => {

}

// add a new room
/* Creating a new room with the name and maxUsers from the request body. It is also generating a unique
access key for the room. */
router.post('/add', function (req, res, next) {
    const { name, maxSize } = req.body;
    const AccessKey = uuidv4();

    const room = {
        Name: name,
        MaxUsers: maxSize,
        AccessKey,
    }
    new Room(room).save();
    Room.find({}, function (err, rooms) {
        if (err) return
        req.session.rooms = rooms;
        res.redirect('/');
    });




});


// remove a room
/* Removing a room from the database. */
router.post('/remove', function (req, res, next) {
    const { roomId } = req.body;
    Room.findByIdAndDelete(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to remove room', error: err }); return }
        Room.find({}, function (err, rooms) {
            req.session.rooms = rooms;
            res.redirect('/');
        });
    });
});

// get all rooms
/* This is a get request to the route /r. It is getting all the rooms in the database and returning
them as a json object. */
router.get('/', function (req, res, next) {
    if (!req.cookies.user) { res.redirect('/'); return }
    Credentials.findById(req.cookies.user._id, function (err, user) {
        if (err) { res.json({ message: 'Error when trying to get rooms', error: err }); return }
        Room.find({}, function (err, rooms) {
            if (err) { res.json({ message: 'Error when getting rooms', error: err }); return }

            res.render('dashboard', { rooms, credentials: user });
        });
    });
});

// get a room
/* This is a post request to the route /r/:id. It is getting the room with the id from the request
params and returning it as a json object. */
router.get('/:id', function (req, res, next) {
    const { id } = req.params;
    Room.findById(id, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get room', error: err }); return }
        res.render("roomConfig");
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
    const { AccessKey, userId, username, Email } = req.body;
    let CenterName;
    try {
        Credentials.find().then(credentials => {
            if (credentials.length === 0) {
                res.json({ message: 'No credentials found' });
                return;
            }
            CenterName = credentials[0].CenterName ? credentials[0].CenterName : "";
        }).catch(err => {
            res.json({ message: 'Error when trying to get credentials', error: err });
            return;
        }
        );
        User.findOne({ FirebaseRef: userId }, function (err, user) {
            if (user) {
                Room.findOne({ AccessKey }, function (err, room) {
                    if (err) { res.json({ message: 'Error when trying to add user', error: err }); return }
                    if(!room) { res.json({ message: 'Room not found' }); return }
                    if (room.Users.length < room.MaxUsers) {
                        if (!room.Users.find(u => u.equals(user._id))) {
                            room.Users.push(user);
                            room.save();
                        }
                    }
                    else {
                        res.json({ message: 'Room is full' });
                        return
                    }
                    res.json({ ...room._doc, CenterName, message: 'User already in room', });
                });
            } else {
                try {
                    new User({ FirebaseRef: userId, Username: username, Email }).save(function (err, user) {
                        if (err) { res.json({ message: 'Error when trying to add user to room', error: err }); return }
                        Room.findOne({ AccessKey }, function (err, room) {
                            if (err) { res.json({ message: 'Error when trying to add user to room', error: err }); return }
                            if (room.Users.length > room.MaxUsers) {
                                res.json({ message: 'Room is full' });
                                return;
                            }
                            if (!room.Users.find(u => u === userId)) {
                                room.Users.push(user._id);
                                room.save();
                            }
                            res.json({ ...room._doc, CenterName });
                        })
                    });
                } catch (err) {
                    res.json({ message: 'Error when trying to add user to room', error: err });
                    return
                }
            }
        })

    } catch (err) {
        res.json({ message: 'Error when trying to add user to room', error: err });
    }
})

// remove user from room
/* Removing a user from a room. */
router.post('/unsubscribe', function (req, res, next) {
    const { roomId, userId, ban = false } = req.body;
    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to remove user from room', error: err }); return } 
        User.findOne({ FirebaseRef: userId }, function (err, user) {
            if (err) { res.json({ message: 'Error when trying to remove user from room', error: err }); return }
            if (!user) { res.json({ message: 'User not found' }); return }
            room.Users = room.Users.filter(u => !u.equals(user._id));
            room.save();
            res.json(room);
        })
    });
})

// get all users in room
/* Getting the room with the id from the request body and returning the users in the room as a json
object. */
router.post('/users', function (req, res, next) {
    const { roomId } = req.body;
    Room.findById(roomId).populate("Users").exec(function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get users in room', error: err }); return }
        res.json(room.Users);
    });
});
//get subjects
/* This is a post request to the route /r/subjects. It is getting the subjects from the database and
returning them as a json object. */
router.get('/subjects/:roomId', function (req, res, next) {
    const { roomId } = req.params;
    Room.findById(roomId).populate("Subjects").exec(function (err, room) {
        if (err) { res.json({ message: 'Error when trying to get subjects', error: err }); return }
        res.json(room.Subjects);
    });
}
);



/* Adding a subject to a room. */
router.post('/add-subject', function (req, res, next) {
    const { roomId, subject } = req.body;
    new Subject(subject).save(function (err, subject) {
        if (err) { res.json({ message: 'Error when trying to add subject to room', error: err }); return }
        Room.findById(roomId).populate("Subjects").exec(function (err, room) {
            if (err) { res.json({ message: 'Error when trying to add subject to room', error: err }); return }
            let exists = false;
            room.Subjects.forEach(element => {
                if (element.Code == subject.Code) {
                    res.json({ errors: "Subject already exists" });
                    exists = true;
                }
            });
            if (exists) return
            room.Subjects.push(subject._id);
            room.save();
            res.json(room);
        });
    });
})

// remove subject
/* Removing a subject from a room. */
router.post('/delete-subject', function (req, res, next) {
    const { roomId, subjectId } = req.body;

    Room.findById(roomId, function (err, room) {
        if (err) { res.json({ message: 'Error when trying to remove subject from room', error: err }); return }
        room.Subjects.pull(subjectId);

        Subject.findByIdAndDelete(subjectId, function (err, subject) {
            if (err) { res.json({ message: 'Error when trying to remove subject from room', error: err }); return }
            room.save();
        });

        res.json(room);
    });
})

router.post('/get-room', async (req, res) => {
    const { id } = req.body;
    const exist = await Room.findById(id).populate(["Subjects", "Users"]).exec();
    if (!exist) return res.json(JSON.stringify({ name: 'Bad Request', id: '_xxxxxxxxx' }));
    res.json(JSON.stringify(exist));
});



module.exports = router;
