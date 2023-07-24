const validateSchema = require('../utils/validateSchema')
const schemas = require('./user.validator')
const userController = require('../controller/user')
const router = require('express').Router()

router.post('/short', validateSchema(schemas.createShortUrlValidator), userController.createShortUrl)
router.get('/:urlId', userController.getUrl)

module.exports = router