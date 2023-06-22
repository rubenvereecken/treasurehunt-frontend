import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // This isn't working but the error isn't helpful so needs more digging
  schema: "grafbase/schema.graphql",
  generates: {
    "./gql/": {
      preset: "client",
      plugins: [],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
