const DUMMY_PDF_CONTENT = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] >>
endobj
trailer
<< /Size 4 /Root 1 0 R >>
%%EOF
`;

// Mobile and some slower browsers need the link to stay in the DOM (and the
// blob URL to stay valid) for a moment after the click, or the download is
// silently dropped — revoking/removing it synchronously is a known race.
const CLEANUP_DELAY_MS = 150;

export function downloadDummyPdf(fileName: string): void {
  const blob = new Blob([DUMMY_PDF_CONTENT], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  // No target="_blank" here: a programmatically-clicked link opening a new
  // tab can get silently popup-blocked on mobile Safari (nothing happens at
  // all — worse than navigating away). Desktop browsers honour `download`
  // and save the file directly in place. iOS Safari instead navigates to
  // its built-in PDF viewer in the same tab; the user can save it from there
  // via Share, and going back restores the wizard from localStorage.
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, CLEANUP_DELAY_MS);
}
