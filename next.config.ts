import crypto from "crypto";

import type { NextConfig } from "next";
import { DefinePlugin } from "webpack";


const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { icon: true },
        },
      ],
    });

    config.plugins.push(
      new DefinePlugin({
        "process.env.NEXT_PUBLIC_DEPLOY_HASH": JSON.stringify(
          crypto.randomBytes(8).toString("base64url")
        ),
        "process.env.NEXT_PUBLIC_DEPLOY_TIME": JSON.stringify(
          new Date().toISOString()
        ),
      })
    );

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icons-metagraph.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icons-metagraph.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "stargazer-assets.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
