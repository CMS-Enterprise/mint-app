const { globSync } = require('glob');

const allGraphQLFiles = globSync('pkg/graph/schema/**/*.graphql');

module.exports = {
  client: {
    service: {
      name: 'mint-app',
      localSchemaFile: allGraphQLFiles
    },
    includes: ['./src/gql/operations/**/*.ts']
  }
};
