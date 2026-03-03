import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Discover Your Ideal Career Path
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mb-10">
          CareerAI uses cutting-edge AI powered by Groq to analyze your skills,
          interests and personality — and deliver personalised career
          recommendations in seconds.
        </p>
        {user ? (
          <Link
            to="/dashboard"
            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full text-lg hover:bg-yellow-300 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full text-lg hover:bg-yellow-300 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border border-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-blue-700 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white text-gray-800 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Complete Assessment',
              desc: 'Answer questions about your interests, skills, and personality.',
            },
            {
              step: '2',
              title: 'AI Analysis',
              desc: 'Our algorithm + Groq LLM analyse your profile in real time.',
            },
            {
              step: '3',
              title: 'Get Recommendations',
              desc: 'Receive top 3 tailored career paths with roadmaps & skill gaps.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center p-6 rounded-xl shadow-md border">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                {step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-blue-200 text-center py-4 text-sm">
        © {new Date().getFullYear()} CareerAI – All rights reserved
      </footer>
    </div>
  );
};

export default LandingPage;
