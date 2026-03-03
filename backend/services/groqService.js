const Groq = require('groq-sdk');

// Lazily create the client so missing env var only throws on first use
let _groq = null;
const getGroqClient = () => {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

/**
 * Build a structured prompt for career recommendations.
 * @param {Object} assessmentData - Processed student assessment data.
 * @param {Array}  careerScores   - Pre-sorted weighted scores [{title, score}].
 * @returns {string} Prompt string.
 */
const buildPrompt = (assessmentData, careerScores) => {
  const topCareers = careerScores.slice(0, 5).map((c) => c.title).join(', ');

  return `You are an expert career counselor AI. Based on the student profile below, recommend the top 3 most suitable careers.

Student Profile:
- Interests: ${assessmentData.interests.join(', ')}
- Skills: ${assessmentData.skills.join(', ')}
- Strengths: ${assessmentData.strengths.join(', ')}
- Weaknesses: ${assessmentData.weaknesses.join(', ')}
- Academic Performance: ${assessmentData.academicPerformance}
- Personality Traits: ${assessmentData.personalityTraits.join(', ')}
- Preferred Subjects: ${assessmentData.preferredSubjects.join(', ')}

Pre-scored top career candidates (by algorithm): ${topCareers}

Return ONLY a valid JSON array with exactly 3 objects. Each object must have these fields:
{
  "careerTitle": "string",
  "matchPercentage": number (0-100),
  "confidenceScore": number (0-100),
  "reasoning": "string",
  "requiredSkills": ["string"],
  "skillGapAnalysis": "string",
  "learningRoadmap": ["string"],
  "futureScope": "string"
}

Do not include any text outside the JSON array.`;
};

/**
 * Get career recommendations from Groq LLM.
 * @param {Object} assessmentData - Student assessment answers.
 * @param {Array}  careerScores   - Weighted scores from scoring service.
 * @returns {Promise<Array>} Array of 3 career recommendation objects.
 */
const getCareerRecommendations = async (assessmentData, careerScores) => {
  const prompt = buildPrompt(assessmentData, careerScores);

  const chatCompletion = await getGroqClient().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
    temperature: 0.4,
    max_tokens: 2048,
  });

  const raw = chatCompletion.choices[0]?.message?.content ?? '';

  // Extract the JSON array robustly (strip any surrounding text)
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(`Groq returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  try {
    const recommendations = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(recommendations)) {
      throw new Error('Parsed value is not an array');
    }
    return recommendations;
  } catch (parseErr) {
    throw new Error(`Failed to parse Groq response: ${parseErr.message}`);
  }
};

module.exports = { getCareerRecommendations };
