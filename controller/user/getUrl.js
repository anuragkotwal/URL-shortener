const urlServices = require("../../services/url");
const catchAsync = require("../../utils/catchAsync");

const getUrl = catchAsync(async (req, res, next) => {
  const { urlId } = req.params;
  const url = await urlServices.getShortUrl({ urlId });
  if (!url)
    return res
      .status(200)
      .json({ success: false, message: "URL not found", data: null });

  if (url.err) {
    const { err } = url;
    return next(err);
  }

  // Ensure the URL has a protocol (http/https)
  const redirectUrl = url.originalUrl.startsWith('http') 
    ? url.originalUrl 
    : `https://${url.originalUrl}`;

  return res.status(302).redirect(redirectUrl);
});

module.exports = getUrl;
