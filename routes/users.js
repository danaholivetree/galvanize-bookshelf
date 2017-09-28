'use strict';

const express = require('express')

// eslint-disable-next-line new-cap
const router = express.Router()
const bcrypt = require('bcrypt')
const knex = require('../knex')

router.post('/users', (req, res, next) => {
  const {firstName, lastName, email, password} = req.body
  if (!firstName || !lastName || !email || !password) {
    throw boom.create(400, 'Bad Request')
  }
  bcrypt.hash(password, 10, (err, hash) => {
    let newInfo = {
      first_name: firstName,
      last_name: lastName,
      email,
      hashed_password:hash
    }
    knex('users')
      .insert(newInfo)
      .returning('*')
      .then( (info) => {
        let stuff = {
          id: info[0].id,
          firstName: info[0].first_name,
          lastName: info[0].last_name,
          email: info[0].email
        }
        res.send(stuff)
      })
      .catch( (err) => {
        next(err)
      })
  })
})
module.exports = router
