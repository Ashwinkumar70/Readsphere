import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardRoute } from '../../utils/roleRouter.js';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="p-6 max-w-[1400px] flex items-center justify-center min-h-[50vh]">
        <p className="text-muted text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return children;
}
