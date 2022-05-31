var express = require('express');
var router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', async (req,res,next) => {
  const {roomId, name, surname, birthdate, phone, firebaseId, avatar, username, email } = req.body;

  const user = new User({
    Name:name,
    Surname:surname,
    Birhtdate:birthdate,
    Phone:phone,
    Email:email,
    FirebaseRef :firebaseId,
    Avatar:avatar,
    Username:username,
    roomId:roomId
  });
  
  await user.save()

  res.status(200).json({
    message: 'User created successfully',
    user: user
  });
})

module.exports = router;
