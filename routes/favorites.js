'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex')
const SECRET = process.env.JWT_KEY
const jwt = require('jsonwebtoken')
const {camelizeKeys, decamelizeKeys} = require('humps')
var currentUser

router.get('/favorites', (req, res, next) => {

  // if(!req.cookies.token) {
  //   next(err)
  // }
  jwt.verify(req.cookies.token, SECRET, (err, payload) => {
    if (err) {
      res.send(false)
    }
    else {
      currentUser = payload.id
      knex('favorites')
        .where('user_id', currentUser)
        .innerJoin('books', 'books.id', 'favorites.book_id')
        .returning('*')
        .then( (faves) => {
          res.send(camelizeKeys(faves))
        })
    }
  })
})

router.get('/favorites/check?bookId=:id', (req, res, next) => {
  console.log(req.query.bookId)
  if (currentUser === req.query.bookId) {
    res.send(true)
  }
  else res.send(false)

})

router.post('/favorites', (req, res, next) => {
  //req.body is just bookId
  console.log(currentUser)
  knex('favorites')
    .insert({
      book_id: req.body.bookId,
      user_id: currentUser
    }, '*')
    .then( (newFave) => {
      let obj = {
        id : newFave[0].id,
        bookId : newFave[0].book_id,
        userId : newFave[0].user_id
      }
      res.send(obj)
    })

})


module.exports = router;
