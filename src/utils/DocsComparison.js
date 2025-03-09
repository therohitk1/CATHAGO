import natural from "natural";
import cosineSimilarity from "cosine-similarity";

/**
 * Compare two documents based on their text content
 * @param {string} text1 - Text content of first document
 * @param {string} text2 - Text content of second document
 * @returns {Promise<number>} Similarity score between 0 and 1
 */
const compareDocs = async (text1, text2) => {
  try {
    if (!text1 || !text2) {
      console.warn("Warning: Empty text provided for comparison");
      return 0;
    }
    
    // Tokenization and preprocessing
    const tokenizer = new natural.WordTokenizer();
    const tokens1 = tokenizer.tokenize((text1 || "").toLowerCase());
    const tokens2 = tokenizer.tokenize((text2 || "").toLowerCase());

    // Remove stopwords
    const stopwords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "is",
      "are",
      "was",
      "were",
    ]);
    const filteredTokens1 = tokens1.filter((token) => !stopwords.has(token));
    const filteredTokens2 = tokens2.filter((token) => !stopwords.has(token));

    // Handle empty filtered tokens
    if (!filteredTokens1.length || !filteredTokens2.length) {
      return 0;
    }

    // TF-IDF Calculation
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(filteredTokens1.join(" "));
    tfidf.addDocument(filteredTokens2.join(" "));

    // Convert documents into vectors
    const vector1 = tfidf.listTerms(0).map((term) => term.tfidf);
    const vector2 = tfidf.listTerms(1).map((term) => term.tfidf);

    // Ensure both vectors have the same length
    while (vector1.length < vector2.length) vector1.push(0);
    while (vector2.length < vector1.length) vector2.push(0);

    // Compute cosine similarity
    const cosineSim = cosineSimilarity(vector1, vector2) || 0;

    // Jaccard similarity
    const set1 = new Set(filteredTokens1);
    const set2 = new Set(filteredTokens2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    const jaccardSimilarity =
      union.size > 0 ? intersection.size / union.size : 0;

    // Weighted average of both similarity measures
    const similarity = cosineSim * 0.7 + jaccardSimilarity * 0.3;

    return similarity;
  } catch (error) {
    console.error("Error comparing documents: ", error);
    return 0;
  }
};

export { compareDocs };