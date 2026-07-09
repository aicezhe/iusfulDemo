const JPEG_QUALITY = 0.75;

export async function compressImage(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Impossibile comprimere l'immagine su questo dispositivo.");
  }

  context.drawImage(imageBitmap, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });

  if (!blob) {
    throw new Error("Impossibile comprimere l'immagine su questo dispositivo.");
  }

  return new File([blob], file.name, { type: "image/jpeg" });
}
