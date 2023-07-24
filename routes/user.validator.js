const { body } = require('express-validator')

const createShortUrlValidator = [body('originalUrl').isURL().withMessage('Please enter a valid URL')]

module.exports = { createShortUrlValidator }
