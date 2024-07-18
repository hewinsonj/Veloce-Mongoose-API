'use strict'
require("dotenv").config()


// creating a base name for the mongodb
// REPLACE THE STRING WITH YOUR OWN DATABASE NAME
const mongooseBaseName = 'redbull-backend-api'

// create the mongodb uri for development and test
const database = {
	MONGO_DEV_URI: `mongodb://localhost/${mongooseBaseName}-development`,
	// development: `mongodb+srv://sandwich:sandwich@cluster0.4tmzof4.mongodb.net/${mongooseBaseName}?retryWrites=true&w=majority`,
	test: `mongodb+srv://sandwich:sandwich@cluster0.4tmzof4.mongodb.net/${mongooseBaseName}?retryWrites=true&w=majority`,
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable MONGODB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.MONGODB_URI || localDb

module.exports = currentDb
