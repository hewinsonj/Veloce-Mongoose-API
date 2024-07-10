// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Redbull = require('../models/redbull')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Index
// /redbulls
router.get('/redbulls', (req, res, next) => {
    Redbull.find()
        .populate('owner')
        .then(redbulls => {
            return redbulls.map(redbull => redbull)
        })
        .then(redbulls =>  {
            res.status(200).json({ redbulls: redbulls })
        })
        .catch(next)
})

//Show
// /redbulls/:id
router.get('/redbulls/:id', (req, res, next) => {
    Redbull.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    .then(redbull => {
        res.status(200).json({ redbull: redbull })
    })
    .catch(next)

})

// Create
// /redbull
router.post('/redbulls', requireToken, (req, res, next) => {
    req.body.redbull.owner = req.user.id

    // one the front end I HAVE TO SEND a pet as the top level key
    // pet: {name: '', type: ''}

    // ----------------------------------------------------------------
    // // this is a workaround to split the ingredients into an array
    // // this is not ideal, but it's the only way to get this to work with the front end
    // // because the front end sends the ingredients as a comma-separated string
    // // so I have to split them into an array here
    // // in a real application, you would want to handle this on the front end
    // // and pass the ingredients as an array to the back end
    // // but for this example, I'm doing it here
    // const updatedRedBull = req.body.redbull.map((drink) => {

    //     const ingredients = drink.ingredients.split(',')
    //     drink.ingredients = ingredients

    //     return drink
    //   })


    Redbull.create(req.body.redbull)
    .then(redbull => {
        res.status(201).json({ redbull: redbull
    // const updatedRedBull = req.body.redbull.map((drink) => {

    //     const ingredients = drink.ingredients.split(',')
    //     drink.ingredients = ingredients

    //     return drink
    //   })


    Redbull.create(req.body.redbull)
    .then(redbull => {
        res.status(201).json({ redbull: redbull })
    })
    .catch(next)
    // .catch(error => next(error))

})

// Update
// /redbulls/:id
router.patch('/redbulls/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.redbull.owner

    Redbull.findById(req.params.id)
    .then(handle404)
    .then(redbull => {
        requireOwnership(req, redbull)

        return redbull.updateOne(req.body.redbull)
    })
    .then(() => res.sendStatus(204))
    .catch(next)

})

// Delete
// /redbulls/:id
router.delete('/redbulls/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.redbull

    Redbull.findById(req.params.id)
    .then(handle404)
    .then(redbull => {
        requireOwnership(req, redbull)

        return redbull.deleteOne(req.body.redbull)
    })
    .then(() => res.sendStatus(204))
    .catch(next)

})

module.exports = router