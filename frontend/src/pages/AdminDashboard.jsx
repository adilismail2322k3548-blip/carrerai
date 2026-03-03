import { useEffect, useState } from 'react';
import api from '../services/api';

const BLANK_CAREER = {
  title: '',
  description: '',
  keywords: '',
  requiredSkills: '',
  futureScope: '',
  weight: 5,
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState(BLANK_CAREER);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('stats'); // 'stats' | 'careers' | 'users'
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAll = () => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(console.error);
    api.get('/admin/careers').then((r) => setCareers(r.data)).catch(console.error);
    api.get('/admin/users').then((r) => setUsers(r.data)).catch(console.error);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      ...form,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      requiredSkills: form.requiredSkills.split(',').map((k) => k.trim()).filter(Boolean),
      weight: Number(form.weight),
    };
    try {
      if (editId) {
        await api.put(`/admin/careers/${editId}`, payload);
        setSuccess('Career updated successfully.');
      } else {
        await api.post('/admin/careers', payload);
        setSuccess('Career added successfully.');
      }
      setForm(BLANK_CAREER);
      setEditId(null);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving career');
    }
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({
      title: c.title,
      description: c.description || '',
      keywords: c.keywords?.join(', ') || '',
      requiredSkills: c.requiredSkills?.join(', ') || '',
      futureScope: c.futureScope || '',
      weight: c.weight || 5,
    });
    setTab('careers');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this career?')) return;
    try {
      await api.delete(`/admin/careers/${id}`);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        {['stats', 'careers', 'users'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-1 font-medium capitalize text-sm transition border-b-2 ${
              tab === t
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Students', value: stats.totalUsers },
            { label: 'Total Assessments', value: stats.totalAssessments },
            { label: 'Active Careers', value: stats.totalCareers },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}

          {/* Recent Assessments */}
          <div className="col-span-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Assessments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-2">Student</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAssessments?.map((a) => (
                    <tr key={a._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{a.user?.name ?? '—'}</td>
                      <td className="px-4 py-2">{a.user?.email ?? '—'}</td>
                      <td className="px-4 py-2">{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Careers Tab */}
      {tab === 'careers' && (
        <div className="space-y-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              {editId ? 'Edit Career' : 'Add New Career'}
            </h2>
            {(error || success) && (
              <div
                className={`rounded-lg p-3 mb-4 text-sm border ${
                  error
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}
              >
                {error || success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'title', label: 'Title', placeholder: 'Software Engineer' },
                { name: 'description', label: 'Description', placeholder: 'Brief description…' },
                { name: 'keywords', label: 'Keywords (comma-separated)', placeholder: 'coding, algorithms…' },
                { name: 'requiredSkills', label: 'Required Skills (comma-separated)', placeholder: 'Python, React…' },
                { name: 'futureScope', label: 'Future Scope', placeholder: 'Strong growth expected…' },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className={name === 'description' || name === 'futureScope' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (1–10)</label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  min={1}
                  max={10}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                  {editId ? 'Update Career' : 'Add Career'}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => { setEditId(null); setForm(BLANK_CAREER); }}
                    className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Career List */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((c) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{c.title}</td>
                    <td className="px-4 py-3">{c.weight}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {c.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
