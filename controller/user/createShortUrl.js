const urlServices = require('../../services/url')
const shortid = require('shortid')
const catchAsync = require('../../utils/catchAsync')

const createShortUrl = catchAsync(async (req, res, next) => {
    const { originalUrl } = req.body
    const urlId = shortid.generate()
    const shortUrl = `${process.env.BASE_URL}/${urlId}`
    const body = { urlId, originalUrl, shortUrl }
    const url = await urlServices.createShortUrl(body)
    if (!url) return res.status(500).json({ message: 'Something went wrong' })

    if (url.err) {
        const { err } = url
        return next(err)
    }

    return res.status(200).json({ success: true, message: 'short url created', data: url }) 
})

module.exports = createShortUrl
