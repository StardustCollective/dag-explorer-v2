export const api = {
  get: <T>(url: string, params?: object): Promise<T> => {
    const searchUrl = Object.keys(params).length > 0 ? url + '?' + new URLSearchParams({ ...params }) : url;
    return fetch(searchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status.toString());
        }
        return response.json() as Promise<T>;
      })
      .catch((error: Error) => {
        throw error;
      });
  },
};
