export function mergeCanvases(photoCanvas, sigCanvas) {
  const merged = document.createElement("canvas");
  merged.width  = photoCanvas.width;
  merged.height = photoCanvas.height;
  const ctx = merged.getContext("2d");
  ctx.drawImage(photoCanvas, 0, 0); // photo layer first
  ctx.drawImage(sigCanvas,   0, 0); // sig transparent bg overlays cleanly
  return merged.toDataURL("image/jpeg", 0.92);
}
