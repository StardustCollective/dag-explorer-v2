export const downloadFile = (
  filename: string,
  blob: Blob
) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchorElement = document.createElement("a");

  anchorElement.href = downloadUrl;
  anchorElement.download = filename;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(anchorElement);
};
