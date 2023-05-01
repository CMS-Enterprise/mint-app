import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'pkg/graph/schema.graphql',
  documents: ['src/queriesCodegen/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false // Disabled until https://github.com/dotansimha/graphql-code-generator/issues/9293 is fixed
      }
    }
  }
};
export default config;
