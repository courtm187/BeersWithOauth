const express = require('express');
const router = express.Router();
const knex = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  } else {
    knex('users')
      .whereRaw('lower(email) = ?', req.body.email.toLowerCase())
      .count()
      .first()
      .then(function (result) {
        //{count: "0"}
        if (result.count ==="0"){
          const saltRounds = 4;
          const passwordHash = bcrypt.hashSync(req.body.password, saltRounds);

            knex('users')
            .insert({
              email: req.body.email,
              name: req.body.name,
              password_hash: passwordHash
            })
            .returning('*')
            .then(function (users){
              const user = users[0];
              const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
              res.json({
                id: user.id,
                email: user.email,
                name: user.name,
                token: token
              })
            })

        } else {
          res.status(422).json({
            errors: ["Email has already been taken"]
          })
        }

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
