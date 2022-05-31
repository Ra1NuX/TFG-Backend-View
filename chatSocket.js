const chalk = require('chalk');
const users = {}

module.exports = (io) => {

io.on('connection', (socket) => {
    
    socket.on('subscribe', (data, room) => {
        try {
            socket.join(room);
            users[socket.id] = data
            users[socket.id].room = room
            console.log('['+chalk.green(` + `) + ']', ` ${users[socket.id].username} connected to room ${room}`);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('unsubscribe', (room) => {
        try {
            console.log('['+chalk.red(` - `) + ']', ` ${users[socket.id].username} leave from room: ${room}`);
            socket.leave(room)
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
    socket.on('message', (msg) => {
        console.log(msg);
        io.to(users[socket.id].room).emit('messageSended', msg);
    });
    socket.on('typing', (msg) => {
        console.log(msg);
        io.emit('typing', msg);
    });
    socket.on('stop typing', (msg) => {
        console.log(msg);
        io.emit('stop typing', msg);
    
    });
}); 
}