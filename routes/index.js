var express = require('express');
const Credentials = require('../models/Credentials');
var router = express.Router();
const Room = require('../models/Room');



const yup = require('yup');

const userSchema = yup.object({
    passwordConfirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required("Password confirmation can't be blank"),
    password: yup.string().required("Password can't be blank"),
    username: yup.string().required("Username can't be blank"),
})

/* GET home page. */

router.get('/signout', (req, res) => {
  res.clearCookie('user')
  res.redirect('/');
  });

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  Credentials.findOne({ Username: username, Password: password }, (err, user) => {
    if (err) {
      res.status(500).json({
        message: 'Error when trying to login',
        error: err
      });
    } else {
      if (!user) {
        res.status(404).json({
          message: 'User not found'
        });
      } else {
        res.cookie('user', user, { maxAge: 900000, httpOnly: false });
        res.redirect('/');
      }
    }
  });
});

const validate = (schema, redirect) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (err) {
    console.log(err)
    req.flash('error', { key:err.path, error:err.message});
    res.redirect(redirect);
  }
}

router.post('/register', validate(userSchema, "/"), async (req, res) => {
  const { username, password } = req.body;
  const credentials = new Credentials({
    Username: username,
    Password: password
  });
  await credentials.save();
  res.status(200).json({
    message: 'User created successfully',
    user: credentials
  });

});

router.get('/', async (req, res) => {
  const cred = await Credentials.find();
  let firstTime;
  console.log(req.cookies)
  if (cred.length === 0) firstTime = true;
  req.cookies.user ? res.render('dashboard') : res.render('index', { firstTime, messages: req.flash('error') }); 
});

module.exports = router;
