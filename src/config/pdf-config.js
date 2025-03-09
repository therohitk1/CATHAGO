import path from "path";
import fs from "fs-extra";

// This function should be called before importing pdf-parse
export const setupPdfEnv = () => {
  // Create necessary directories
  const testDir = path.join(process.cwd(), "test");
  const testDataDir = path.join(testDir, "data");
  
  // Ensure both directories exist
  fs.ensureDirSync(testDir);
  fs.ensureDirSync(testDataDir);
  
  // Check if the specific file exists
  const testPdfPath = path.join(testDataDir, "05-versions-space.pdf");
  if (!fs.existsSync(testPdfPath)) {
    // Create a minimal valid PDF file
    const minimalPdf = "%PDF-1.4\n1 0 obj<>\nendobj\n2 0 obj<>\nendobj\nxref\n0 3\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\ntrailer<>\nstartxref\n101\n%%EOF";
    fs.writeFileSync(testPdfPath, minimalPdf);
  }
};