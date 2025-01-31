import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://beta.pokeapi.co/graphql/v1beta',
  documents: 'graphql/documents/**/*.graphql',
  generates: {
    'src/repositories/graphql.ts': {
      plugins: [
        // クエリやミューテーションに対応する型がTypeScriptの型として生成される
        'typescript', // TypeScript型の生成
        'typescript-operations', // クエリやミューテーションの型生成
        'typescript-graphql-request', // `getSdk` を生成
      ],
      config: {
        gqlImport: 'graphql-tag#gql',
      },
    },
  },
};

export default config;
