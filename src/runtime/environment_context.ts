import { DeploymentStage } from "./deployment";
import { getEnvOrDefault } from "./get_env";

const makeEnvironmentContext = <E extends Record<string, () => any>>(
  envDefinition: E
) => {
  return new Proxy(
    {},
    {
      get: (t, p) => {
        if (typeof p !== "string") {
          throw new Error("Inconsistency error");
        }

        return envDefinition[p]();
      },
    }
  ) as { [K in keyof E]: ReturnType<E[K]> };
};

const expandByPrefixes = (prefixes: string[]) => (term: string) =>
  prefixes.map((prefix) => `${prefix}${term}`);

const expandByCommonClientPrefixes = expandByPrefixes([
  "",
  "REACT_APP_",
  "NEXT_PUBLIC_",
]);

export const EnvironmentContext = makeEnvironmentContext({
  nodeEnv: () => getEnvOrDefault<string>(process.env.NODE_ENV, "NODE_ENV"),
  stage: () =>
    getEnvOrDefault<DeploymentStage>(
      process.env.NEXT_PUBLIC_STAGE as DeploymentStage,
      ...expandByCommonClientPrefixes("STAGE")
    ),
});
