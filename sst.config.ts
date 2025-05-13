// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dag-explorer",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: { profile: "lattice" },
      },
    };
  },
  async run() {
    new sst.aws.Nextjs("DagExplorerApp", {
      buildCommand: "pnpm open-next build",
    });
  },
});
