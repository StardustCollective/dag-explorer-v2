// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

const BaseDeploymentDomain = "dagexplorer-app.constellationnetwork.net";

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
    const { HgtpNetwork } = await import("./src/common/consts/network.ts");

    new sst.aws.Nextjs("DagExplorerApp", {
      buildCommand: "pnpm open-next build",
      domain: {
        name: `${$app.stage}.${BaseDeploymentDomain}`,
        aliases: Object.values(HgtpNetwork).map(
          (network) => `${network}.${$app.stage}.${BaseDeploymentDomain}`
        ),
      },
    });
  },
});
