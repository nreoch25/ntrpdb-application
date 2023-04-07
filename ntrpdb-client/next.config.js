const withLess = require("next-with-less");

module.exports = withLess({
  lessLoaderOptions: {},
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  },
});
