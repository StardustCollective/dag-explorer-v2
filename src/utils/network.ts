export const detectSubdomain = () => {
  let subdomain;

  const host = window.location.host;
  const arr = host.split('.').slice(0, host.includes('localhost') ? -1 : -2);

  if (arr.length > 0) subdomain = arr[0];
  return subdomain;
};
