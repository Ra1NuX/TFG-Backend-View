var express = require('express');
var router = express.Router();
const Event = require('../models/Event');
const Room = require('../models/Room');
const User = require('../models/User');

/* GET users listing. */
router.get('/:room', function (req, res, next) {
    const { room } = req.params;
    Event.find({ CreatedRoom: room, DeletedAt:null }, (err, events) => {
        if (err) {
            res.status(500).json({
                message: 'Error when trying to get events',
                error: err
            });
        } else {
            res.status(200).json(events);
        }
    });
})
router.get('/from-today/:room', function (req, res, next) {

    const { room } = req.params;
 
    const today = new Date();

    Event.find({ CreatedRoom: room, EventDate:{ $gte: today }}).sort("EventDate").limit(3).exec((err, events) => {
        if (err) {
            res.status(500).json({
                message: 'Error when trying to get events',
                error: err
            });
        } else {
            res.status(200).json(events);
        }
    });
})

router.post('/add-event', async (req, res) => {
    
    const { roomId, title, content, subject, FirebaseRef, date} = req.body;

    User.findOne({ FirebaseRef: FirebaseRef }, async (err, user) => {
        if (err) {
            res.status(500).json({
                message: 'Error when trying to get user',
                error: err
            });
            return
        }

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
            return
        }

        const event = new Event({
            CreatedRoom: roomId,
            Title: title,
            Content: content,
            Subject: subject.subjectId,
            EventDate: date,
            CreatedBy: user._id
        });

        await event.save(function (err, event) {
            if (err) {
                console.log('este es el error', err)
                res.status(500).json({
                    message: 'Error when trying to create event',
                    error: err
                });
                return
            }

            Room.findById(roomId, function (err, room) {

                if (err) {
                    res.status(500).json({
                        message: 'Error when trying to get room',
                        error: err
                    });
                    return
                }
                if (!room) {
                    res.status(404).json({
                        message: 'Room not found'
                    });
                    return
                }
                room.Events.push(event._id);
                room.save();
                res.status(200).json({
                    message: 'Event created successfully',
                    event: event
                });
            })

        });

    })
})

router.delete('/delete-Event/:id', async (req, res) => {
    const { id } = req.params;
    Event.findByIdAndUpdate(id, { DeletedAt: Date.now() }, (err, event) => {

        if (err) {
            res.status(500).json({
                message: 'Error when trying to delete event',
                error: err
            });
            return
        }

        Room.findById(event.CreatedRoom, function (err, room) {
            if (err) {
                res.status(500).json({
                    message: 'Error when trying to get room',
                    error: err
                });
                return
            }

            if (!room) {
                res.status(404).json({
                    message: 'Room not found'
                });
                return
            }

            room.Events.pull(event._id);
            room.save();
            res.status(200).json({
                message: 'Event deleted successfully',
                event: event
            });

        })
    })
})

router.post('/update-Event/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, subject, date } = req.body;
    Event.findByIdAndUpdate(id, { Title: title, Content: content, Subject: subject, EventDate: date }, (err, event) => {
        if(err) {
            res.status(500).json({
                message: 'Error when trying to update event',
                error: err
            });
            return
        }
        res.status(200).json({
            message: 'Event updated successfully',
            event: event
        });
    })
})






module.exports = router;
