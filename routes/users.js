var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  const errors = []

 if (!req.body.email || !req.body.email.trim()) errors.push("Email can't be blank");
 if (!req.body.name || !req.body.name.trim()) errors.push("Name can't be blank");
 if (!req.body.password || !req.body.password.trim()) errors.push("Password can't be blank");

 if (errors.length) {
   res.status(422).json({
     errors: errors
   })
 }

});

//require knex
// check if email name and password are all there
//if not return error
// check to see if email exists in db
//if so return error
//if we're ok:
// hash password
//knex insert stuff from req.body
//create token
//send back id, email, name, token

module.exports = router;
