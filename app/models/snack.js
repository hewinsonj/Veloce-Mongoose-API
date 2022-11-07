// import dependencies
const mongoose = require('mongoose')

// toy is a subdoc NOT a model
// toy will be added in an array on pets
// one toy belongs to ONE pet -> NO SHARING!

const snackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isSpicy: {
        type: Boolean,
        default: false,
        required: true
    },
    type: {
        type: String,
        // we're going to use enum, which means only specific strings will satisfy this field
        // enum is a VALIDATOR on the type String, that says "you can only use one of these values"
        enum: ['crunchy', 'chewy', 'soft'],
        default: 'new'
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})


module.exports = snackSchema