module.exports = {
  style: {
    sass: {
      loaderOptions: {
        sourceMap: true,
        implementation: require("sass"),
        sassOptions: {
          includePaths: [
            "./src/stylesheets",
            "./node_modules/@uswds/uswds/packages"          ]
        }
      }
    }
  }
};