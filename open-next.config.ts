import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

const openNextConfig: OpenNextConfig = {
  default: {
    override: {
      wrapper: "aws-lambda-streaming",
    },
  },
  imageOptimization: {
    /**
     * OpenNext 3.x installs sharp 0.32.6 here by default, which bundles image
     * libraries with remote code execution bugs (GHSA-2464-fhr4-w9xw). 0.35.5 is
     * the first fixed release. SST runs this Lambda on arm64.
     */
    install: {
      packages: ["sharp@0.35.5"],
      arch: "arm64",
      nodeVersion: "22",
      libc: "glibc",
      // sharp 0.33+ ships its binaries as optional packages, which npm selects
      // by --os and --cpu rather than the --platform and --arch flags set above.
      additionalArgs: "--os=linux --cpu=arm64",
    },
  },
};

export default openNextConfig;
