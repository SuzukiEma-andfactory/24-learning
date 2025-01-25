import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  // schema: 'graphql/schemas/**/*.graphqls',
  schema: 'https://beta.pokeapi.co/graphql/v1beta',
  documents: 'graphql/documents/**/*.graphql',
  generates: {
    'src/repositories/graphql.ts': {
      plugins: [
        // クエリやミューテーションに対応する型がTypeScriptの型として生成される
        'typescript',
        '@graphql-codegen/typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
};

// pnpm graphql-codegen実行時エラーになるので要解消
export default config;
