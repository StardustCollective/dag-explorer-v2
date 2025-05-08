export enum DeploymentStage {
  PRODUCTION = "production",
  STAGING = "staging",
  TEST = "test",
}

export const isDeploymentStage = (value: unknown): value is DeploymentStage =>
  typeof value === "string" &&
  Object.values(DeploymentStage).includes(value as any);
