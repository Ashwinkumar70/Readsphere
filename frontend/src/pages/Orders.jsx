import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/slices/orderSlice.js';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { Package, Download, SearchX, DownloadCloud } from 'lucide-react';
import axios from 'axios';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDownload = async (bookId) => {
    try {
      const { data } = await axios.get(`/api/v1/marketplace/downloads/${bookId}`);
      if (data.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Download failed');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading orders</h2>
        <p className="text-muted">{error}</p>
        <Button onClick={() => dispatch(fetchOrders())} className="mt-6">Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 min-h-[80vh]">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-text flex items-center gap-3">
            <Package size={32} className="text-primary" />
            Order History
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-border shadow-sm">
            <SearchX size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-text mb-2">No orders found</h3>
            <p className="text-muted">You haven't made any purchases yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b border-border gap-4">
                  <div>
                    <div className="text-sm text-muted mb-1">Order Placed: {new Date(order.created_at).toLocaleDateString()}</div>
                    <div className="text-sm text-muted">Order ID: <span className="font-mono">{order.id}</span></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-text">${Number(order.total_amount).toFixed(2)}</div>
                    <Badge color={order.status === 'Completed' ? 'success' : 'primary'}>{order.status}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-24 bg-gray-200 rounded overflow-hidden shrink-0">
                        {item.books?.cover_url && <img src={item.books.cover_url} alt={item.books.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-text">{item.books?.title}</h4>
                        <p className="text-sm text-muted">Qty: {item.quantity} • ${Number(item.unit_price).toFixed(2)}</p>
                      </div>
                      <div>
                        {order.status === 'Completed' && (
                          <Button variant="outline" size="sm" onClick={() => handleDownload(item.book_id)} className="flex items-center gap-2">
                            <DownloadCloud size={16} /> Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
