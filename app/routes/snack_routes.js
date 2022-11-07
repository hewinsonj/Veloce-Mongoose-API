const express = require('express')
const passport = require('passport')
// pull in Mongoose model for redbulls
const Redbull = require('../models/redbull')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// POST -> anybody can give a redbull a snack
// POST /toys/<pet_id>
router.post('/snacks/:redbullId', removeBlanks, (req, res, next) => {
    // get the toy from req.body
    const snack = req.body.snack
    const redbullId = req.params.redbullId
    // find the pet by its id
    Redbull.findById(redbullId)
        .then(handle404)
        // add the toy to the pet
        .then(redbull => {
            redbull.snacks.push(snack)

            return redbull.save()
        })
        .then(redbull => res.status(201).json({ redbull: redbull }))
        // pass to the next thing
        .catch(next)
})

// UPDATE a snack
router.patch('/snacks/:redbullId/:snackId', requireToken, removeBlanks, (req, res, next) => {
    const { redbullId, snackId } = req.params

    // find the pet
    Redbull.findById(redbullId)
        .then(handle404)
        .then(redbull => {
            // get the specific toy
            const theSnack = redbull.snacks.id(snackId)

            // make sure the user owns the pet
            requireOwnership(req, redbull)

            // update that toy with the req body
            theSnack.set(req.body.snack)

            return redbull.save()
        })
        .then(redbull => res.sendStatus(204))
        .catch(next)
})

// DESTROY a snack
router.delete('/snacks/:redbullId/:snackId', requireToken, (req, res, next) => {
    const { redbullId, snackId } = req.params

    // find the pet
    Redbull.findById(redbullId)
        .then(handle404)
        .then(redbull => {
            // get the specific toy
            const theSnack = redbull.snacks.id(snackId)

            // make sure the user owns the pet
            requireOwnership(req, redbull)

            // update that toy with the req body
            theSnack.remove()

            return redbull.save()
        })
        .then(redbull => res.sendStatus(204))
        .catch(next)
})

// export router
module.exports = router