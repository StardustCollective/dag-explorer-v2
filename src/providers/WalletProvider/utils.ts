/* eslint-disable @typescript-eslint/no-explicit-any */
// Sort object by keys
export const sortKeysFromObject = (
  srcObj: Record<any, any>,
): Record<any, any> => {
  if (Array.isArray(srcObj)) {
    return srcObj.map(sortKeysFromObject)
  } else if (typeof srcObj === 'object' && srcObj !== null) {
    return Object.keys(srcObj)
      .sort()
      .reduce(
        (srtObj, key) => {
          const value = srcObj[key]
          srtObj[key] = sortKeysFromObject(value)
          return srtObj
        },
        {} as Record<any, any>,
      )
  } else {
    return srcObj
  }
}
// Recursively remove nulls
export const removeNullsFromObject = (
  obj: Record<any, any>,
): Record<any, any> => {
  if (Array.isArray(obj)) {
    return obj
      .filter((v) => v !== null)
      .map((v) => (v && typeof v === 'object' ? removeNullsFromObject(v) : v))
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [
          k,
          v && typeof v === 'object' ? removeNullsFromObject(v) : v,
        ]),
    )
  } else {
    return obj
  }
}

export const getSignableDataPayload = (data: Record<any, any>) => {
  data = removeNullsFromObject(data)
  data = sortKeysFromObject(data)
  return btoa(JSON.stringify(data))
}
