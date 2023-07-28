import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'pkg/graph/schema.graphql',
  documents: ['src/queriesCodegen/**/*.ts'],
  generates: {
    './src/gql/': {
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
        }
      }
    }
  }
};
export default config;
