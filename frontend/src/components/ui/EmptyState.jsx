import { motion } from 'framer-motion';
import Button from './Button.jsx';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon = Compass, 
  title = "Nothing to see here", 
  description = "There is no data available for this section yet.", 
  actionLabel, 
  onAction,
  actionLink,
  className = "" 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 rounded-[24px] border border-dashed border-gray-200 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-heading font-bold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionLabel && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="outline" size="sm">
              {actionLabel}
            </Button>
          </Link>
        ) : onAction ? (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null
      )}
    </motion.div>
  );
}
