var express = require('express');
var router = express.Router();

// Create CRUD routes for messages
router.post('/add', function(req, res, next) {
    res.json(req.body)
});
    

module.exports = router;
