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
  // Desktop browsers honour `download` and save the file directly. iOS Safari
  // ignores `download` for blobs, so `target="_blank"` opens the PDF in a new
  // tab (where the user can save it via Share) without navigating our own tab
  // away and losing wizard state.
  link.target = "_blank";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, CLEANUP_DELAY_MS);
}
