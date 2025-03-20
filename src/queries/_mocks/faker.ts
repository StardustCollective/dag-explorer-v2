import crypto from "crypto";

import { Faker, en } from "@faker-js/faker";

export const getNumberFromString = (str: string) => {
  return parseInt(
    crypto.createHash("md5").update(str).digest("hex").slice(0, 10),
    16
  );
};

export const getFakerWithSeed = (seed: string | number) => {
  if (typeof seed === "string") {
    seed = getNumberFromString(seed);
  }

  return new Faker({ locale: [en], seed });
};
