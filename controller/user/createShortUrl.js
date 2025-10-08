const urlServices = require("../../services/url");
const ShortUniqueId = require("short-unique-id");
const catchAsync = require("../../utils/catchAsync");

const createShortUrl = catchAsync(async (req, res, next) => {
  const { originalUrl } = req.body;
  
  // Check if the original URL already exists
  const existingUrl = await urlServices.getShortUrl({ originalUrl });
  
  if (existingUrl && existingUrl.err) {
    const { err } = existingUrl;
    return next(err);
  }
  
  if (existingUrl) {
    return res
      .status(200)
      .json({ success: true, message: "URL already exists", data: existingUrl });
  }
  
  // Create new short URL if it doesn't exist
  const urlId = new ShortUniqueId({ length: 4 })();
  const shortUrl = `${process.env.BASE_URL}/${urlId}`;
  const body = { urlId, originalUrl, shortUrl };
  const url = await urlServices.createShortUrl(body);
  if (!url)
    return res
      .status(200)
      .json({ success: false, message: "Something went wrong!", data: null });

  if (url.err) {
    const { err } = url;
    return next(err);
  }

  return res
    .status(200)
    .json({ success: true, message: "short url created", data: url });
});

module.exports = createShortUrl;
