const {connect} = require('mongoose');
const chalk = require('chalk');
const URI = 'mongodb://localhost:27017/rooms';
connect(URI)
    .then(db => console.log(`${chalk.yellow('[DB] connected.')}`))
    .catch(err => console.log(err));


module.exports