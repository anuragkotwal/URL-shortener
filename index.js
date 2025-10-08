const express = require("express");
const app = express();
const { connect } = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
const logger = require("./utils/logger");
const errorHandler = require("./utils/errorHandler");
const router = require("./routes");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  logger.error(`Unhandled Exception - ${err.message}`, { err: err.stack });
});

connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(logger.info("> Mongodb connected."))
  .catch((err) => {
    logger.error("> Failed to connect to Mongodb", err);
  });

const whitelist = [
  /^http:\/\/localhost:[0-9]{4}\/?$/,
  /^https:\/\/url-shortener-frontend-rho\.vercel\.app\/?$/,
  /^https:\/\/url-shortener-frontend-anuragkotwal\.vercel\.app\/?$/,
  /^https:\/\/(www\.)?anuragkotwal\.in\/?$/,
];

const corsOptions = {
  origin: function (origin, callback) {
    logger.info(`CORS check for origin: "${origin}"`);
    
    if (!origin) {
      logger.info("No origin header - allowing request");
      callback(null, true);
      return;
    }
    
    const isAllowed = whitelist.some((pattern) => {
      const matches = pattern.test(origin);
      logger.info(`Pattern ${pattern} matches "${origin}": ${matches}`);
      return matches;
    });
    
    if (isAllowed) {
      logger.info(`CORS allowing origin: ${origin}`);
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Referer', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform', 'User-Agent', 'DNT'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health-check", (req, res) => {
  return res.status(200).json({ success: true, message: "", data: null });
});

app.use("/", router);

app.use((req, res, next) => {
  logger.info("Req", {
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
  });
  next();
});

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "request not found",
    data: null,
  });
});

app.use(errorHandler);

app.listen(port, () => logger.info(`> Server running on port ${port}`));
