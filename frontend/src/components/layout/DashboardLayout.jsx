import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../store/slices/dashboardSlice.js';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const { data, loading, error, lastFetched } = useSelector(state => state.dashboard);

  useEffect(() => {
    // Prevent infinite loops / multiple calls. Only fetch if no data.
    if (!data && !loading && !error) {
      dispatch(fetchDashboard());
    }
  }, [dispatch, data, loading, error]);

  const handleRetry = () => {
    dispatch(fetchDashboard());
  };

  if (loading) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw size={24} className="text-primary animate-spin" />
        <p className="text-muted text-sm font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 flex flex-col items-center justify-center text-center space-y-3">
          <AlertCircle size={32} />
          <div>
            <p className="font-bold text-lg">Error loading dashboard</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2 text-red-600 border-red-200 hover:bg-red-100">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {children}
    </div>
  );
}
