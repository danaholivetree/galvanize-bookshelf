'use strict';

const express = require('express')

// eslint-disable-next-line new-cap
const router = express.Router()
const knex = require('../knex')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_KEY
const bcrypt = require('bcrypt')
const boom = require('boom')


router.get('/token', (req, res, next) => {

  jwt.verify(req.cookies.token, SECRET, (err, payload) => {
    if (err) {
      res.send(false)
    }
    else {
    res.send(true)
    }
  })
})


router.post('/token', (req, res, next) => {
  if (!req.body.email) {
    next(boom.create(400, 'Email must not be blank'))
  }
  if (!req.body.password) {
    next(boom.create(400, 'Password must not be blank'))
  }

  knex('users')
  .where({email: req.body.email})
  .first()
  .returning('*')
  .then(function(data){
    if (!data)  {
      // res.status(400)
      // res.setHeader('Content-Type', 'text/plain')
      // res.send('Bad email or password')
      next(boom.create(400, 'Bad email or password'))
    }
    if (bcrypt.compareSync(req.body.password, data.hashed_password)) {
      let token = jwt.sign({id : data.id}, SECRET)
      let info = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name
      }
      res.cookie('token', token, {httpOnly:true} )
      res.send(info)
    }
    else {
      // res.status(400)
      // res.setHeader('Content-Type', 'text/plain')
      // res.send('Bad email or password')
      next(boom.create(400, 'Bad email or password'))
    }
  })
  .catch( (err) => next(err) )
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token')
  res.send(true)
})

module.exports = router;
