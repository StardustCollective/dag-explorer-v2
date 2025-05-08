/**
 * Transformed Idea
 * https://gist.github.com/codeguy/6684588
 */

export const StringFormaters = {
  NORMALIZE: (str: string) => {
    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç";
    const to = "aaaaeeeeiiiioooouuuunc";

    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "gi"), to.charAt(i));
    }

    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  },
  CAMEL_CASE: (str: string) => {
    str = StringFormaters.NORMALIZE(str);
    return str
      .replace(/[^a-z0-9 -]/gi, "") // remove invalid chars
      .replace(/\w+/g, function (word, index) {
        return index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      })
      .replace(/\s+/g, "");
  },
  PASCAL_CASE: (str: string) => {
    str = StringFormaters.NORMALIZE(str);
    return str
      .replace(/[^a-z0-9 -]/gi, "") // remove invalid chars
      .replace(/(\w)(\w*)/g, function (g0, g1, g2) {
        return g1.toUpperCase() + g2.toLowerCase();
      })
      .replace(/\s+/g, "");
  },
  SNAKE_CASE: (str: string) => {
    str = StringFormaters.NORMALIZE(str);
    return str
      .replace(/[^a-z0-9 -]/gi, "") // remove invalid chars
      .replace(/\s+/g, "_")
      .toLowerCase();
  },
  SLUGIFY: (str: string) => {
    str = StringFormaters.NORMALIZE(str);
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/gi, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes
  },
  TITLE_CASE: (str: string) => {
    str = StringFormaters.NORMALIZE(str);
    return str
      .replace(/[^a-z0-9 -]/gi, "") // remove invalid chars
      .replace(/\w+/g, function (word) {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      })
      .replace(/\s+/g, " "); // ensure single spaces between words
  },
} as const;

export const stringFormat = (
  str: string,
  format: keyof typeof StringFormaters = "SLUGIFY"
) => StringFormaters[format](str);

export const shortenString = (
  value: string,
  prefixLength = 6,
  suffixLength = 6,
  ellipsis = "..."
) =>
  value.length <= prefixLength + suffixLength
    ? value
    : `${value.substring(0, prefixLength)}${ellipsis}${value.substring(
        value.length - suffixLength
      )}`;

export const xorOnStrings = (...strings: string[]) => {
  if (strings.length === 0) {
    return "";
  }

  const buffers = strings.map((s) => new TextEncoder().encode(s));
  const maxLength = Math.max(...buffers.map((b) => b.length));

  const paddedBuffers = buffers.map((buf) => {
    const padded = new Uint8Array(maxLength);
    padded.set(buf);
    return padded;
  });

  const xorResult = new Uint8Array(maxLength);
  for (let i = 0; i < maxLength; i++) {
    xorResult[i] = paddedBuffers.reduce((acc, buf) => acc ^ buf[i], 0);
  }

  return Buffer.from(xorResult).toString("base64url");
};

export const concatenateDeterministic = (
  strings: string[],
  separator = ",",
  compareFn = (a: string, b: string) => a.localeCompare(b)
) => {
  const sorted = [...strings].sort(compareFn);
  return sorted.join(separator);
};
