export const isPromiseLike = <T>(value: any): value is PromiseLike<T> => {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof value.then === "function" &&
    typeof value.catch === "function" &&
    typeof value.finally === "function"
  );
};
