import path from "path";
import fs from "fs-extra";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

/**
 * Extracts text from various document types
 * @param {string} filePath - Path to the document file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromDocs = async (filePath) => {
  try {
    // Make sure the file exists before processing
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    let text = "";

    switch (fileExtension) {
      case ".pdf":
        try {
          const pdfBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          text = pdfData.text;
        } catch (pdfError) {
          console.error("PDF parsing error:", pdfError);
          text = "Error: Could not extract text from PDF file";
        }
        break;
      case ".docx":
        const docxResult = await mammoth.extractRawText({ path: filePath });
        text = docxResult.value;
        break;
      case ".doc":
        throw new Error(
          "DOC format is not supported directly. Please convert to DOCX."
        );
      case ".txt":
        text = await fs.readFile(filePath, "utf-8");
        break;
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    return text;
  } catch (error) {
    console.error("Error extracting text: ", error);
    throw error;
  }
};

export { extractTextFromDocs };

// import fs from "fs-extra";
// import pdfParse from "pdf-parse";

// /**
//  * Extracts text from a PDF file
//  * @param {string} filePath - Path to the PDF file
//  * @returns {Promise<string>} - Extracted text content
//  */
// const extractTextFromPdf = async (filePath) => {
//   try {
//     // Verify file exists
//     const exists = await fs.pathExists(filePath);
//     if (!exists) {
//       throw new Error(`PDF file not found: ${filePath}`);
//     }

//     // Read the PDF file as a buffer
//     const pdfBuffer = await fs.readFile(filePath);

//     // Parse the PDF
//     const pdfData = await pdfParse(pdfBuffer);

//     // Return the extracted text
//     return pdfData.text;
//   } catch (error) {
//     console.error("Error extracting text from PDF:", error);
//     throw new Error(`Failed to extract text from PDF: ${error.message}`);
//   }
// };

// export { extractTextFromPdf };