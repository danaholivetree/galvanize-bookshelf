'use strict';

const express = require('express')
const bodyParser = require('body-parser')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex')
const boom = require('boom')

router.get('/books', (req, res, next) => {
  knex('books')
    .select('author', 'title', 'id', 'genre', 'description', 'cover_url as coverUrl', 'updated_at as updatedAt', 'created_at as createdAt')
    .orderBy('title', 'asc')
    .then( (items) => {
      res.send(items)
    })
    .catch( (err) => next(err) )
})

router.get('/books/:id', (req, res, next) => {
  const id = req.params.id
  knex('books')
    .select('author', 'title', 'id', 'genre', 'description', 'cover_url as coverUrl', 'updated_at as updatedAt', 'created_at as createdAt')
    .where('id', id)
    .then( (stuff) => {
      if (!stuff) {
        throw boom.create(404, 'Not Found')
      }
      res.send(stuff[0])
      })
    .catch( (err) => next(err) )
})

router.post('/books', (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body
  if (!title || !author || !genre || !description || !coverUrl) {
    throw boom.create(404, 'Not Found')
  }
  knex('books')
    .insert({
        title,
        author,
        genre,
        description,
        cover_url: coverUrl
        })
    .returning('*')
    .then( (stuff) => {
      let book = {
        id: stuff[0].id,
        title: stuff[0].title,
        author: stuff[0].author,
        genre: stuff[0].genre,
        description: stuff[0].description,
        coverUrl: stuff[0].cover_url
      }
      res.send(book)
    })
    .catch( (err) => next(err) )
})

router.patch('/books/:id', (req, res, next) => {
  const id = req.params.id
  const { title, author, genre, description, coverUrl } = req.body

  let newBook = {}
  if (title) {
    newBook.title = title
  }
  if (author) {
    newBook.author = author
  }
  if (genre) {
    newBook.genre = genre
  }
  if (description) {
    newBook.description = description
  }
  if (coverUrl) {
    newBook.cover_url = coverUrl
  }
  return knex('books')
    .select()
    .where('id', id)
    .then( (stuff) => {
      if (!stuff) {
       throw boom.create(404, 'Not Found')
      }
      knex('books')
        .update(newBook)
        .where('id', id)
        .returning('*')
        .then( (stuff) => {
          let book = {
            id : stuff[0].id,
            title: stuff[0].title,
            author: stuff[0].author,
            genre: stuff[0].genre,
            description: stuff[0].description,
            coverUrl: stuff[0].cover_url
          }
          res.send(book)
        })
    .catch( (err) => next(err) )
  })
})

router.delete('/books/:id', (req, res, next) => {
  const id = req.params.id

  knex('books')
    .select()
    .where('id', id)
    .then((stuff) => {
      if (!stuff) {
        throw boom.create(404, 'Not Found')
      }
      let deadBook = {
        title: stuff[0].title,
        author: stuff[0].author,
        genre: stuff[0].genre,
        description: stuff[0].description,
        coverUrl: stuff[0].cover_url
      }
      knex('books')
        .del()
        .where('id', id)
        .then( () => {
          res.send(deadBook)
        })
    })
    .catch((err) => next(err))
})

module.exports = router;
