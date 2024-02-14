const glob = require('glob');

const allGraphQLFiles = glob.sync('pkg/graph/**/*.graphql');

module.exports = {
  client: {
    service: {
      name: 'mint-app',
      localSchemaFile: allGraphQLFiles
    }
  }
};
