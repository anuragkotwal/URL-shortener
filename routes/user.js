const validateSchema = require('../utils/validateSchema')
const schemas = require('./user.validator')
const userController = require('../controller/user')
const router = require('express').Router()

router.post('/create-short-url', validateSchema(schemas.createShortUrlValidator), userController.createShortUrl)

module.exports = router