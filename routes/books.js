'use strict';

const express = require('express')
const bodyParser = require('body-parser')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex')
const camel = require('to-camel-case')

router.get('/', (req, res, next) => {
  knex('books')
    .select()
    .orderBy('title')
    .then( (items) => {
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(JSON.stringify(items))
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  knex('books')
    .select()
    .where('id', id)
    .orderBy('id')
    .then((items) => {
      if (items.length < 1) {
        return res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      //res.send(JSON.stringify(items[0]))
      res.json(items[0])
    })
})

router.post('/', (req, res, next) => {
  const item = req.body
  knex('books')
    .insert(item)
    .then( () => {
    //   .select()
    //   .where('id', knex.raw( (" SELECT MAX(id) FROM 'books' ") ;))
    // })
    // "SELECT setval('books_id_seq', (SELECT MAX(id) FROM books))"

    .then( () => {
      res.status(200)
      res.setHeader('Content-Type', 'application/json')
      //res.send(JSON.stringify(item))
      res.json()
    })
})

router.patch('/:id', (req, res, next) => {
  const id = req.params.id
  let newBook = {}
  if (req.body.title) {
    let newBook.title = req.body.title
  }

  if (req.body.author) {
    let newBook.author = req.body.author
  }
  if (req.body.genre) {
    let newBook.genre = req.body.genre
  }
  if (req.body.description) {
    let newBook.description = req.body.description
  }
  if (req.body.cover_url) {
    let newBook.cover_url = req.body.cover_url
}
  knex('books')
    .select()
    .where('id', id)
    .then( (item) => {
      if (item.length < 1) {
        res.sendStatus(404)
      }
    else {
      .update(newBook, *)
      .where('id', id)
      .then( (stuff) => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.send(stuff)
      })
    .catch( (err) => next(err) )
    }
})

router.delete('/:id', function (req, res, next) {
  const id = req.params.id

  knex('books')
    .del()
    .where('id', id)
    .then((stuff) => {
      if (!stuff) {
        throw boom.create(404, 'Not Found')
      }
      res.sendStatus(200)
      res.setHeader('Content-Type', 'application/json')
      res.send(rowsAffected)
    })
    .catch((err) => next(err))
})

module.exports = router;
