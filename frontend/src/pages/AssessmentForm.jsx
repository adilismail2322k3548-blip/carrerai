import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const QUESTIONS = [
  {
    id: 'interests',
    label: 'What are your main interests?',
    placeholder: 'e.g. Technology, Music, Writing, Sports',
    hint: 'Separate multiple interests with commas.',
    type: 'text',
  },
  {
    id: 'skills',
    label: 'What skills do you have?',
    placeholder: 'e.g. Python, Public Speaking, Graphic Design',
    hint: 'List any technical or soft skills.',
    type: 'text',
  },
  {
    id: 'strengths',
    label: 'What are your strengths?',
    placeholder: 'e.g. Problem-solving, Leadership, Creativity',
    hint: 'Think about what you are naturally good at.',
    type: 'text',
  },
  {
    id: 'weaknesses',
    label: 'What are your weaknesses?',
    placeholder: 'e.g. Time management, Public speaking',
    hint: 'Be honest — it helps the AI give better advice.',
    type: 'text',
  },
  {
    id: 'academicPerformance',
    label: 'Describe your academic performance',
    placeholder: 'e.g. 3.8 GPA, Top 10% of class, 85% average',
    hint: 'GPA, percentage, or a brief description.',
    type: 'text',
    single: true, // single string, not array
  },
  {
    id: 'personalityTraits',
    label: 'Which personality traits describe you best?',
    placeholder: 'e.g. Introverted, Analytical, Creative, Empathetic',
    hint: 'Separate multiple traits with commas.',
    type: 'text',
  },
  {
    id: 'preferredSubjects',
    label: 'What subjects do you enjoy most?',
    placeholder: 'e.g. Mathematics, Biology, History, Art',
    hint: 'School or university subjects.',
    type: 'text',
  },
];

const toArray = (value) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const current = QUESTIONS[step];

  const handleChange = (e) =>
    setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }));

  const next = () => {
    if (!answers[current.id]?.trim()) return;
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {};
      QUESTIONS.forEach(({ id, single }) => {
        payload[id] = single ? answers[id] ?? '' : toArray(answers[id] ?? '');
      });

      const { data } = await api.post('/assessment', payload);
      navigate(`/results/${data.assessment._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  const isLast = step === QUESTIONS.length - 1;
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold text-gray-800 mb-1">{current.label}</h2>
        <p className="text-sm text-gray-400 mb-4">{current.hint}</p>

        <input
          type="text"
          value={answers[current.id] ?? ''}
          onChange={handleChange}
          placeholder={current.placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          onKeyDown={(e) => {
            if (e.key === 'Enter') isLast ? handleSubmit() : next();
          }}
        />

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={prev}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !answers[current.id]?.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Analysing…' : 'Get My Career Recommendations'}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!answers[current.id]?.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
