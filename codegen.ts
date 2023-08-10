import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'pkg/graph/schema.graphql',
  documents: ['src/gql/apolloGQL/**/*.ts'],
  generates: {
    './src/gql/gen/': {
      preset: 'client',
      config: {
        scalars: {
          // old codegen mappings from global.d.ts
          // maintain until we add better scalar mapping with graphql-codegen
          //
          // These currently just need to map to aliased types there
          // Hopefully in the future we can use custom/useful types!
          Time: 'Time',
          UUID: 'UUID',
          Upload: 'Upload'
        },
        namingConvention: {
          enumValues: 'change-case-all#upperCase#snakeCase'
        }
      }
    }
  }
};
export default config;
