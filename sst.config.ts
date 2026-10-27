// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "dag-explorer",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { aws: "6.66.2" },
    };
  },
  async run() {
    if ($app.stage === "staging") return {};

    /**
     * Constellation Ecosystem VPC
     */
    const vpc = sst.aws.Vpc.get(
      "ConstellationEcosystemVpc",
      "vpc-0d9b9fd415cfc0448"
    );

    /**
     * Nextjs defaults its server Lambda to nodejs20.x and hardcodes it for the
     * image optimizer and ISR functions. Node 20 no longer gets security fixes.
     */
    $transform(sst.aws.Function, (args) => {
      args.runtime = "nodejs22.x";
    });

    new sst.aws.Nextjs("DagExplorerApp", {
      buildCommand: "pnpm open-next build",
      vpc,
    });
  },
});
