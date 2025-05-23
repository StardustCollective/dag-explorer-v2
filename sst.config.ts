// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dag-explorer",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    /**
     * Constellation Ecosystem VPC
     */
    const vpc = sst.aws.Vpc.get(
      "ConstellationEcosystemVpc",
      "vpc-0d9b9fd415cfc0448"
    );

    new sst.aws.Nextjs("DagExplorerApp", {
      buildCommand: "pnpm open-next build",
      vpc,
    });
  },
});
