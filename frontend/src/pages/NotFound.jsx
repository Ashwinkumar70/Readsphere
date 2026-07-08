import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <BookOpen size={48} className="text-primary" />
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-black text-text mb-4 tracking-tighter">
          4<span className="text-primary">0</span>4
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4">
          Page not found
        </h2>
        
        <p className="text-muted text-lg max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back to the library.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg">Return to Home</Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="outline" size="lg">Browse Marketplace</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
