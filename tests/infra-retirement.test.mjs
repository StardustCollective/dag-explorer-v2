import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { SourceTextModule, createContext } from "node:vm";

async function load(stage) {
  const vpcs = [];
  const apps = [];
  const vpc = { id: "preserved-vpc" };
  const context = createContext({
    $config: (value) => value,
    $app: { stage },
    sst: {
      aws: {
        Vpc: {
          get: (...args) => {
            vpcs.push(args);
            return vpc;
          },
        },
        Nextjs: class {
          constructor(name, options) {
            apps.push({ name, options });
          }
        },
      },
    },
  });
  const source = await readFile(
    new URL("../sst.config.ts", import.meta.url),
    "utf8"
  );
  const module = new SourceTextModule(source, { context });
  await module.link(() => {});
  await module.evaluate();
  return { config: module.namespace.default, vpcs, apps, vpc };
}

test("staging redeploy creates no app or VPC dependency", async () => {
  const { config, vpcs, apps } = await load("staging");
  await config.run();
  assert.equal(apps.length, 0);
  assert.equal(vpcs.length, 0);
});

test("production keeps its app, build command and VPC", async () => {
  const { config, vpcs, apps, vpc } = await load("production");
  await config.run();
  assert.deepEqual(vpcs, [
    ["ConstellationEcosystemVpc", "vpc-0d9b9fd415cfc0448"],
  ]);
  assert.equal(apps.length, 1);
  assert.equal(apps[0].name, "DagExplorerApp");
  assert.equal(apps[0].options.buildCommand, "pnpm open-next build");
  assert.equal(apps[0].options.vpc, vpc);
  assert.equal(config.app({ stage: "production" }).protect, true);
  assert.equal(config.app({ stage: "production" }).removal, "retain");
});

test("the staging guard preserves other existing stages", async () => {
  const { config, apps } = await load("development");
  await config.run();
  assert.equal(apps.length, 1);
});
