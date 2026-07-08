import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, FileText, Image, AlertCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function UploadBook() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', author: '', genre: 'Fiction', price: '9.99', description: ''
  });
  const files = { cover: null, pdf: null };

  const handleUpload = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Success step
      toast.success('Book published successfully!');
    }, 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text mb-2">Publish a Book</h1>
        <p className="text-muted">Share your story with 1.2M readers on ReadSphere</p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[
          { num: 1, label: 'Details' },
          { num: 2, label: 'Files' },
          { num: 3, label: 'Publish' }
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s.num ? 'bg-primary text-white' : 'bg-gray-100 text-muted'
              }`}>
                {step > s.num ? <CheckCircle size={14} /> : s.num}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-primary' : 'text-muted'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div className={`w-12 h-0.5 rounded-full ${step > s.num ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-card p-6 sm:p-8">
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={(e) => { e.preventDefault(); setStep(2); }}
            className="space-y-5"
          >
            <Input label="Book Title" placeholder="e.g. The Midnight Library" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <Input label="Author Name" placeholder="e.g. Matt Haig" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text">Genre</label>
                <select
                  value={form.genre}
                  onChange={e => setForm({...form, genre: e.target.value})}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option>Fiction</option>
                  <option>Sci-Fi</option>
                  <option>Self-Help</option>
                  <option>Finance</option>
                  <option>History</option>
                </select>
              </div>
              <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text">Description / Synopsis</label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                required
                rows={4}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                placeholder="Write a compelling description for your book..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Next Step →</Button>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleUpload}
            className="space-y-6"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Ensure you have the rights to publish this content. Your book will be scanned by our AI to enable the AI Reader features.
              </p>
            </div>

            {/* Cover Upload */}
            <div>
              <label className="text-sm font-semibold text-text mb-2 block">Book Cover</label>
              <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${files.cover ? 'border-primary bg-primary-50' : 'border-border hover:bg-gray-50'}`}>
                <Image size={32} className={files.cover ? 'text-primary mb-3' : 'text-muted mb-3'} />
                <p className="text-sm font-bold text-text mb-1">{files.cover ? 'Cover Uploaded' : 'Click to upload cover'}</p>
                <p className="text-xs text-muted">JPEG or PNG, up to 5MB (ideal ratio 2:3)</p>
                {/* Hidden input mockup */}
                <input type="file" className="hidden" />
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="text-sm font-semibold text-text mb-2 block">Book File (PDF/EPUB)</label>
              <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${files.pdf ? 'border-primary bg-primary-50' : 'border-border hover:bg-gray-50'}`}>
                <FileText size={32} className={files.pdf ? 'text-primary mb-3' : 'text-muted mb-3'} />
                <p className="text-sm font-bold text-text mb-1">{files.pdf ? 'Manuscript Uploaded' : 'Click to upload manuscript'}</p>
                <p className="text-xs text-muted">PDF or EPUB, up to 50MB</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button type="submit" loading={loading} icon={UploadCloud}>Publish Book</Button>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Book Published!</h2>
            <p className="text-muted mb-8 max-w-sm mx-auto">
              Your book is now live on the ReadSphere marketplace and AI processing has begun.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/author">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link to="/marketplace">
                <Button icon={BookOpen}>View in Marketplace</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
