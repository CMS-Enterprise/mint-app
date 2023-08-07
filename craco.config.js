const path = require('path');

const importPath = path.join(path.dirname(require.resolve('@uswds/uswds')),"/../..", "packages")
console.log("===== WEE HAH! =====")
console.log(importPath)

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        sourceMap: true,
        sassOptions: {
          includePaths: [
            './src/stylesheets',
            // './node_modules/@uswds/uswds/packages'
            importPath
          ]
        }
      }
    }
  },
  devServer: {
    port: 3005
  }
};
