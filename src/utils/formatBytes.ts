export const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / 1024 ** unitIndex).toFixed(unitIndex ? 1 : 0)} ${units[unitIndex]}`;
};
