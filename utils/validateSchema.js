const { validationResult } = require('express-validator')

const validateSchema = (schemas) => async (req, res, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    const errOutput = {
        name: 'ExpressValidatorErr',
        errors: {},
    }
    errors.array().map((err) => (errOutput.errors[err.param] = err.msg))
    return next(errOutput)
}

module.exports = validateSchema
