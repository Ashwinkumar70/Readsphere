import { motion } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { mockPricingPlans } from '../data/mockData.deprecated.js';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-hero py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-7xl mx-auto relative">
        <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <Badge color="primary" className="mb-4">
            <Zap size={12} className="mr-1" /> Upgrade Your Reading
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted">
            Whether you're a casual reader or publishing your next bestseller, we have a plan for you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mockPricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className={`rounded-3xl p-8 border ${
                plan.highlighted
                  ? 'bg-gradient-primary text-white border-transparent shadow-glow relative'
                  : 'bg-white border-border shadow-soft'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge color="warning" size="md" className="shadow-sm">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-text'}`}>
                  {plan.name}
                </h2>
                <p className={`text-sm h-10 ${plan.highlighted ? 'text-white/80' : 'text-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-black tracking-tight ${plan.highlighted ? 'text-white' : 'text-text'}`}>
                  {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className={`text-base ml-1 ${plan.highlighted ? 'text-white/70' : 'text-muted'}`}>
                    /{plan.period}
                  </span>
                )}
              </div>

              <Button
                full
                variant={plan.highlighted ? 'white' : plan.id === 'free' ? 'outline' : 'primary'}
                size="lg"
                className="mb-8"
              >
                {plan.cta}
              </Button>

              <div className="space-y-4">
                <p className={`text-xs font-bold uppercase tracking-wider ${plan.highlighted ? 'text-white/90' : 'text-text'}`}>
                  What's included
                </p>
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-3 text-sm font-medium ${plan.highlighted ? 'text-white' : 'text-text'}`}>
                      <CheckCircle size={18} className={plan.highlighted ? 'text-white shrink-0 mt-0.5' : 'text-primary shrink-0 mt-0.5'} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div variants={fadeUp} className="mt-20 max-w-4xl mx-auto bg-white rounded-3xl border border-border p-8 sm:p-12 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div>
            <h3 className="text-2xl font-bold text-text mb-2">Need a plan for your school or organization?</h3>
            <p className="text-muted">Get tailored pricing for teams of 50+ members.</p>
          </div>
          <Button variant="secondary" size="lg" className="shrink-0">Contact Sales</Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
