import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

const openNextConfig: OpenNextConfig = {
  default: {
    override: {
      wrapper: "aws-lambda-streaming",
    },
  },
};

export default openNextConfig;
