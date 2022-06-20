const chalk = require('chalk');
const Message = require('./models/Message');
const User = require('./models/User');
const Subject = require('./models/Subject');
const users = {}

module.exports = (io) => {

const sendNotification = (FirebaseRef, roomId, message ) => {
    io.to(roomId).emit('notification', {FirebaseRef, message});
}

io.on('connection', (socket) => {
    
    socket.on('subscribe', (data, rooms) => {
        try {
            rooms.forEach(element => {
                socket.join(element);
            });

            users[socket.id] = data
            console.log('['+chalk.green(` + `) + ']', ` ${users[socket.id].username} connected to room ${rooms}`);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('unsubscribe', (rooms) => {
        try {
            rooms.forEach(element => {
                socket.leave(element);
            });
            
        }catch (error) {
            console.log(error)
        }
    })
    
    socket.on('disconnect', () => {
        try{
            console.log((chalk.red(`[ - ]`) + ` ${users[socket.id].username} disconnected`));
            delete users[socket.id]
        }catch (error) {
            console.log(error)
        }   
        
        
    });

    socket.on('deleteMessage', (data) => {
        try {
            Message.findByIdAndUpdate(data.messageId, {DeletedAt: new Date()}, function (err, message) {
                if (err) return console.log(err)
                Message.findById(data.messageId, function (err, newMessage) {
                io.to(data.roomId).emit('deleteMessage', newMessage)
                })
            }
            )
        } catch (error) {
            console.log(error)
        }
    }
    )
    socket.on("event-change", (room, FirebaseRef, event) => {
        try {
            io.to(room).emit('event-change-server', FirebaseRef)
        } catch (error) {
            console.log(error)
        }

        sendNotification(FirebaseRef, room, `<div className="font-semibold">📅 [${event.subject.name}] ${event.title}: </div> <span className="text-xs italic pl-3"${event.content} /> `)
    })
    socket.on('message', (msg, room) => {
        //room = subject-id
        const {message, date, FirebaseRef, roomId} = msg
        let newMessage;
        try{
        User.findOne({FirebaseRef}, function(err, user){
            if(err) return console.log(err)
            newMessage = {SendAt: date, SendBy:user._id, SendInRoom: roomId, SendInSubject: room, Content: message, UserName: user.Username, FirebaseRef: user.FirebaseRef}
            new Message(newMessage).save(function (err, message) {
                if (err) { console.log(err); return }
                user.Messages.push(message._id)
                io.to(room).emit('messageSended', {message}, room, FirebaseRef);
            })
            Subject.findById(room, function(err, subject){
                if(err) return console.log(err)
            sendNotification(FirebaseRef, room, `<div className="font-semibold">🗨 [${subject.Code}] ${user.Username}: </div>  <span className="text-xs italic pl-3" >${message}</span> `)
            })
        })
        }catch(e){
            console.log(e)
        }
    });

    socket.on('typing', (data) => {
        io.to(data.room).emit('typing-server', data.username, data.userId, data.room);
    });
}); 

}