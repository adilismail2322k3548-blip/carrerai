import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/assessment/my')
      .then((res) => setAssessments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Welcome back, {user?.name} 👋
      </h1>
      <p className="text-gray-500 mb-8">Here is an overview of your career assessments.</p>

      <Link
        to="/assessment"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition mb-8"
      >
        + New Assessment
      </Link>

      {loading ? (
        <p className="text-gray-400">Loading assessments…</p>
      ) : assessments.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center text-gray-600">
          <p className="text-lg font-medium mb-2">No assessments yet.</p>
          <p>Take your first assessment to get personalised career recommendations!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((a) => (
            <Link
              key={a._id}
              to={`/results/${a._id}`}
              className="block bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    Assessment – {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Skills: {a.skills?.slice(0, 3).join(', ')}
                    {a.skills?.length > 3 ? '…' : ''}
                  </p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {a.recommendations?.length ?? 0} careers
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
