export function saveBlob(blob: Blob, filename: string): void {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

export function openBlob(blob: Blob): void {
  const href = URL.createObjectURL(blob);
  window.open(href, "_blank");
  setTimeout(() => URL.revokeObjectURL(href), 10000);
}