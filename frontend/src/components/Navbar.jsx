import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-wide">
        Career<span className="text-yellow-300">AI</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-50 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-50 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
