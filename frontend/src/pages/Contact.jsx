import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent! We will get back to you shortly.');
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Get in touch</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Have a question, feedback, or need help with your account? Our team is here to assist you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="md:col-span-1 space-y-4">
            {[
              { icon: MessageSquare, title: 'Chat Support', desc: 'Available 24/7 for premium members' },
              { icon: Mail, title: 'Email Us', desc: 'support@readsphere.com' },
              { icon: Phone, title: 'Call Us', desc: '+1 (555) 123-4567' },
              { icon: MapPin, title: 'Office', desc: 'San Francisco, CA 94105' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-soft flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-border shadow-soft p-8">
              <h2 className="text-2xl font-bold text-text mb-6">Send a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="First Name" required />
                  <Input label="Last Name" required />
                </div>
                <Input label="Email Address" type="email" required />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text">Subject</label>
                  <select className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Author Services</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text">Message</label>
                  <textarea 
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                    rows={5}
                    placeholder="How can we help you today?"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="lg" icon={Send} loading={loading}>
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
