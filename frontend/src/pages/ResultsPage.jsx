import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ResultsPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/assessment/${id}`)
      .then((res) => setAssessment(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading your results…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const { recommendations } = assessment;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Your Career Recommendations</h1>
      <p className="text-gray-500 mb-8">
        Based on your assessment from {new Date(assessment.createdAt).toLocaleDateString()}.
      </p>

      <div className="space-y-8">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                #{idx + 1} – {rec.careerTitle}
              </h2>
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {rec.matchPercentage}% Match
                </span>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {rec.confidenceScore}% Confidence
                </span>
              </div>
            </div>

            {/* Reasoning */}
            <p className="text-gray-600 mb-4">{rec.reasoning}</p>

            {/* Required Skills */}
            {rec.requiredSkills?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {rec.requiredSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gap Analysis */}
            {rec.skillGapAnalysis && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Skill Gap Analysis</h3>
                <p className="text-sm text-gray-600">{rec.skillGapAnalysis}</p>
              </div>
            )}

            {/* Learning Roadmap */}
            {rec.learningRoadmap?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Learning Roadmap</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {rec.learningRoadmap.map((step, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Future Scope */}
            {rec.futureScope && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Future Scope</h3>
                <p className="text-sm text-gray-600">{rec.futureScope}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          to="/assessment"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Take Another Assessment
        </Link>
        <Link
          to="/dashboard"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
