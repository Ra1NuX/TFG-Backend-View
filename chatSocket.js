const chalk = require('chalk');
const users = {}

module.exports = (io) => {

io.on('connection', (socket) => {
    socket.on('register', (data) => {
        try {
            users[socket.id] = data
            console.log('['+chalk.green(` + `) + ']', ` ${users[socket.id].username} connected`);
        } catch (error) {
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
        io.sockets.emit('messageSended', msg);
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