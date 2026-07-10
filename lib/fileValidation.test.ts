import { describe, expect, it } from "vitest";
import { validateFile } from "./fileValidation";

const ALLOWED_TYPES = ["image/jpeg", "application/pdf"];
const MAX_SIZE_MB = 5;

function createFile(name: string, type: string, sizeInBytes: number): File {
  return new File([new Uint8Array(sizeInBytes)], name, { type });
}

describe("validateFile", () => {
  it("rejects a file with an unsupported format", () => {
    const file = createFile("documento.png", "image/png", 1024);
    const result = validateFile(file, MAX_SIZE_MB, ALLOWED_TYPES);

    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe(
      "Hai caricato un file .png. Serve un PDF o una foto JPEG.",
    );
  });

  it("accepts a JPEG within the size limit", () => {
    const file = createFile("foto.jpg", "image/jpeg", 1024);
    const result = validateFile(file, MAX_SIZE_MB, ALLOWED_TYPES);

    expect(result.valid).toBe(true);
  });

  it("rejects a file larger than the max size", () => {
    const file = createFile("documento.jpg", "image/jpeg", 5 * 1024 * 1024 + 1);
    const result = validateFile(file, MAX_SIZE_MB, ALLOWED_TYPES);

    expect(result.valid).toBe(false);
    expect(result.errorType).toBe("too-large");
  });

  it("rejects an empty (0-byte) file", () => {
    const file = createFile("documento.pdf", "application/pdf", 0);
    const result = validateFile(file, MAX_SIZE_MB, ALLOWED_TYPES);

    expect(result.valid).toBe(false);
  });

  it("accepts a valid PDF within the size limit", () => {
    const file = createFile("documento.pdf", "application/pdf", 1024);
    const result = validateFile(file, MAX_SIZE_MB, ALLOWED_TYPES);

    expect(result.valid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });
});
