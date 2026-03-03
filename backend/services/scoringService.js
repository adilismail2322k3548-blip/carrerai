/**
 * Weighted scoring algorithm.
 *
 * Each career from the database has a `keywords` array and a base `weight`.
 * We compute an overlap score between the student's combined tokens and the
 * career keywords, then multiply by the career's base weight.
 *
 * @param {Object} assessmentData - Student assessment answers.
 * @param {Array}  careers        - Career documents from MongoDB.
 * @returns {Array} Sorted array of { title, score } descending.
 */
const computeCareerScores = (assessmentData, careers) => {
  // Flatten all student tokens into a lowercase set for quick lookup
  const studentTokens = new Set(
    [
      ...assessmentData.interests,
      ...assessmentData.skills,
      ...assessmentData.strengths,
      ...assessmentData.personalityTraits,
      ...assessmentData.preferredSubjects,
    ].map((t) => t.toLowerCase().trim())
  );

  const scored = careers.map((career) => {
    const keywords = career.keywords.map((k) => k.toLowerCase().trim());
    let overlap = 0;

    for (const kw of keywords) {
      // Exact match
      if (studentTokens.has(kw)) {
        overlap += 2;
        continue;
      }
      // Partial match (keyword contained in any student token or vice-versa)
      for (const token of studentTokens) {
        if (token.includes(kw) || kw.includes(token)) {
          overlap += 1;
          break;
        }
      }
    }

    // Normalize by number of keywords to avoid bias towards keyword-heavy careers
    const normalised = keywords.length > 0 ? overlap / keywords.length : 0;
    const score = normalised * career.weight;

    return { title: career.title, score: parseFloat(score.toFixed(4)) };
  });

  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score);
};

module.exports = { computeCareerScores };
