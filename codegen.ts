import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'pkg/graph/schema.graphql',
  documents: ['src/queriesCodegen/**/*.ts'],
  generates: {
    './src/gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false // Disabled until https://github.com/dotansimha/graphql-code-generator/issues/9293 is fixed
      },
      config: {
        scalars: {
          Date: 'luxon#DateTime'
        }
      }
    },
    './src/gql/introspection.json': {
      plugins: ['introspection'],
      config: {
        minify: true
      }
    }
  }
};
export default config;
