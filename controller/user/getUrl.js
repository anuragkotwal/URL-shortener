const urlServices = require("../../services/url");
const catchAsync = require("../../utils/catchAsync");

const getUrl = catchAsync(async (req, res, next) => {
  const { urlId } = req.params;
  const url = await urlServices.getShortUrl({ urlId });
  if (!url) return res.status(500).json({ message: "Url not found" });

  if (url.err) {
    const { err } = url;
    return next(err);
  }

  return res
    .status(200)
    .redirect(url.originalUrl);
});

module.exports = getUrl;
