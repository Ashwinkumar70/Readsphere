import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

const faqCategories = [
  {
    title: 'Getting Started',
    questions: [
      { q: 'How do I start reading?', a: 'Simply browse the marketplace, click on any book you like, and hit "Read Preview" or purchase it to add it to your library.' },
      { q: 'What is ReadSphere Premium?', a: 'Premium gives you unlimited access to our entire library of over 50,000 books, advanced AI reading features, and ad-free offline reading.' },
    ]
  },
  {
    title: 'For Authors',
    questions: [
      { q: 'How do I publish a book?', a: 'Sign up for an Author account, go to your Author Dashboard, and click "Publish New Book". Follow the simple 3-step upload process.' },
      { q: 'What are the royalty rates?', a: 'Authors earn 70% royalties on all book sales, paid out monthly directly to your connected bank account.' },
    ]
  },
  {
    title: 'AI Features',
    questions: [
      { q: 'How does the AI Assistant work?', a: 'While reading, simply highlight any text or click the AI icon to get explanations, character summaries, or translations in real-time.' },
    ]
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-primary py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
        <div className="max-w-3xl mx-auto relative text-center">
          <h1 className="text-4xl font-bold text-white mb-6">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search for articles, guides, or FAQs..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-text shadow-lg outline-none focus:ring-4 focus:ring-white/20 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-12">
          {faqCategories.map((cat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <h2 className="text-2xl font-bold text-text mb-6">{cat.title}</h2>
              <div className="bg-white rounded-3xl border border-border shadow-soft overflow-hidden divide-y divide-border">
                {cat.questions.map((faq, j) => (
                  <details key={j} className="group p-6 cursor-pointer">
                    <summary className="font-bold text-text list-none flex items-center justify-between outline-none">
                      {faq.q}
                      <ChevronRight size={20} className="text-muted group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-4 text-muted leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-muted mb-4">Still need help?</p>
          <Link to="/contact" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
