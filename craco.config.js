module.exports = {
  devServer: {
    port: 3005
  },
  style: {
    sass: {
      loaderOptions: {
        sourceMap: true,
        sassOptions: {
          includePaths: [
            './src/stylesheets',
            './node_modules/@uswds/uswds/packages'
          ]
        }
      }
    }
  }
};
