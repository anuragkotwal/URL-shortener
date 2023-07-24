const Url = require('../model/url')
const logger = require('../utils/logger')

const createShortUrl = async (body) => {
    try {
        const url = await Url.create(body)
        if (url) return url
        return null
    } catch (err) {
        logger.error(`Error in creating url - ${JSON.stringify(body)}`, err)
        return { err }
    }
}

const getShortUrl = async (query) => {
    try {
        const url = await Url.findOne(query).lean()
        if (url) return url
        return null
    } catch (err) {
        logger.error(`Error in getting url - ${JSON.stringify(query)}`, err)
        return { err }
    }
}

module.exports = {
    createShortUrl,
    getShortUrl,
}
