const express = require('express')
const app = express()
const { connect } = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 5000
const logger = require('./utils/logger')
const errorHandler = require('./utils/errorHandler')
const router = require('./routes')
require('dotenv').config()

process.on('uncaughtException', (err) => {
    logger.error(`Unhandled Exception - ${err.message}`, { err: err.stack })
})

connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(logger.info('> Mongodb connected.'))
    .catch((err) => {
        logger.error('> Failed to connect to Mongodb', err)
    })

const whitelist = [/http:\/\/localhost:[0-9]{4}/]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.some((el) => origin?.match(el)) || origin === undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/health-check', (req, res) => {
    return res.status(200).json({ success: true, message: '', data: null })
})

app.use('/api', router)

app.use((req, res, next) => {
    logger.info('Req', {
        req: {
            url: req.url,
            method: req.method,
            params: req.params,
            body: req.body,
            query: req.query,
            headers: req.headers,
            cookies: req.cookies,
            hostname: req.hostname,
        },
    })
    next()
})

app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'request not found',
        data: null,
    })
})

app.use(errorHandler)

app.listen(port, () => logger.info(`> Server running on port ${port}`))
