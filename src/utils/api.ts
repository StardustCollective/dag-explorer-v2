export const api = {
  get: async <T>(url: string, params?: Record<any, any>): Promise<T> => {
    const searchParams = new URLSearchParams({ ...params });
    const searchUrl = url + '?' + searchParams;

    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    return response.json();
  },
};
