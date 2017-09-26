'use strict';

const express = require('express')
const bodyParser = require('body-parser')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex')
const camel = require('to-camel-case')

router.get('/books', (req, res, next) => {
  knex('books')
    .select()
    .orderBy('title')
    .then((items) => {
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(camel(JSON.stringify(items)))
    })
})

router.get('/books/:id', (req, res, next) => {
  const id = req.params.id
  knex('books')
    .select()
    .where('id', id)
    .then((items) => {
      if (items.length < 1) {
        return res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(camel(JSON.stringify(items[0])))
    })
})

router.post('/books', (req, res, next) => {
  const item = req.body
  knex('books')
    .insert(item, 'id')
    .then( () => {
      res.status(200)
      //res.send(JSON.stringify(item))
      res.json(item)
    })
})

router.patch('/books/:id', (req, res, next) => {
  console.log("this is the request body for a patch: ", req.body)
  const id = req.params.id
  if (req.body.title) {

  }

  knex('books')
  .update({'title':req.body.title}, {'author':req.body.author}, {'genre': req.body.genre}, {'description': req.body.description}, {'cover_url': req.body.cover_url}, 'id')
  .where('id', id)
  .then((id) => {
    // if (rowsAffected !== 1) {
    //   return res.sendStatus(404)
    // }
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.send(rowsAffected)
  })
  .catch((err) => next(err))
})

router.delete('/:id', function (req, res, next) {
  console.log(req.body);
  const id = req.params.id

  knex('books')
    .del()
    .where('id', id)
    .then((rowsAffected) => {
      if (!rowsAffected) {
        return res.sendStatus(404)
      }
      res.sendStatus(200)
      res.setHeader('Content-Type', 'application/json')
      res.send(rowsAffected)
    })
    .catch((err) => next(err))
})

module.exports = router;
