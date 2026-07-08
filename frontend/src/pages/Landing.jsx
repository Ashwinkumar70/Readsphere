import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, Users, TrendingUp, Star, ArrowRight,
  Zap, Brain, Headphones, MessageSquare, CheckCircle, Play
} from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import ClubCard from '../components/cards/ClubCard.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import {
  mockBooks, mockAuthors, mockClubs, mockTestimonials, mockPricingPlans
} from '../data/mockData.deprecated.js';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const aiFeatures = [
  { icon: Zap, title: 'Instant Explanations', description: 'Tap any paragraph to get an instant AI-powered explanation, summary, or context.', color: 'text-amber-500 bg-amber-50' },
  { icon: Brain, title: 'Smart Summaries', description: "Never lose track. Get chapter-by-chapter summaries and 'Story So Far' overviews.", color: 'text-primary bg-primary-50' },
  { icon: Headphones, title: 'Audio Explanations', description: 'Listen to AI audio explanations while reading. Perfect for complex non-fiction.', color: 'text-green-500 bg-green-50' },
  { icon: MessageSquare, title: 'Ask AI Anything', description: 'Chat with an AI that has read the book. Ask any question, get contextual answers.', color: 'text-blue-500 bg-blue-50' },
];

const stats = [
  { value: '50,000+', label: 'Books Available' },
  { value: '1.2M', label: 'Active Readers' },
  { value: '48K+', label: 'Reading Clubs' },
  { value: '4.9★', label: 'App Rating' },
];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* ====== HERO ====== */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/6 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <motion.div variants={fadeUp}>
                <Badge color="new" size="md" className="mb-6">
                  <Sparkles size={11} /> Now with AI Reading Companion
                </Badge>
                <h1 className="text-5xl sm:text-6xl font-bold text-text leading-tight tracking-tight">
                  Read Smarter.
                  <br />
                  <span className="gradient-text">Learn Faster.</span>
                  <br />
                  Together.
                </h1>
              </motion.div>

              <motion.p variants={fadeUp} className="text-xl text-muted leading-relaxed max-w-lg">
                ReadSphere is the AI-powered reading platform that combines the best of Kindle, Goodreads, Spotify, and Discord — all in one beautiful experience.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" icon={Sparkles}>
                    Start Reading Free
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="white" icon={Play} iconRight>
                    Explore Books
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {mockAuthors.slice(0, 5).map((author) => (
                    <Avatar key={author.id} src={author.avatar} name={author.name} size="sm" ring />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted">Loved by <span className="font-bold text-text">1.2M readers</span></p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white rounded-3xl shadow-card-hover p-5 border border-border"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={mockBooks[0].cover}
                      alt={mockBooks[0].title}
                      className="w-20 h-28 object-cover rounded-xl book-cover"
                    />
                    <div className="flex-1">
                      <Badge color="success" size="xs" dot className="mb-2">Currently Reading</Badge>
                      <h3 className="font-bold text-text text-sm mb-1">{mockBooks[0].title}</h3>
                      <p className="text-xs text-muted mb-3">{mockBooks[0].author}</p>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '67%' }} />
                      </div>
                      <p className="text-xs text-muted mt-1">67% complete · 93 pages left</p>
                    </div>
                  </div>

                  {/* AI chat bubble */}
                  <div className="bg-primary-50 rounded-2xl p-3 border border-primary-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Sparkles size={10} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-primary">AI Assistant</span>
                    </div>
                    <p className="text-xs text-text/80">
                      "The Midnight Library explores infinite possibility through Nora's regrets. This chapter introduces the philosophical concept of..."
                    </p>
                  </div>
                </motion.div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl p-3 shadow-card border border-border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">Sci-Fi Universe</p>
                      <p className="text-xs text-muted">8.4K members online</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -left-8 bg-white rounded-2xl p-3 shadow-card border border-border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                      <TrendingUp size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">Reading Streak</p>
                      <p className="text-xs text-muted">🔥 12 days in a row!</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-12 border-t border-border"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURED BOOKS ====== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <Badge color="primary" className="mb-3">Curated For You</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-text">Trending Books</h2>
              <p className="text-muted mt-2">Handpicked by our AI and editorial team</p>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost" icon={ArrowRight} iconRight>View All</Button>
            </Link>
          </motion.div>

          <motion.div variants={stagger} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {mockBooks.map(book => (
              <motion.div key={book.id} variants={fadeUp}>
                <BookCard book={book} size="lg" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ====== AI FEATURES ====== */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge color="primary" className="mb-4">
                <Sparkles size={11} /> AI-Powered
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                Your AI Reading Companion
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                Experience reading like never before. Our AI sits alongside you, ready to explain, summarize, and discuss.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {aiFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-border shadow-soft"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/reader/1">
              <Button size="lg" icon={Sparkles}>Try AI Reader Now</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== POPULAR AUTHORS ====== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <Badge color="secondary" className="mb-3">Authors</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-text">Popular Authors</h2>
            </div>
          </motion.div>

          <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {mockAuthors.map((author) => (
              <motion.div
                key={author.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-border p-5 text-center shadow-soft group cursor-pointer"
              >
                <div className="relative inline-block mb-3">
                  <Avatar src={author.avatar} name={author.name} size="xl" ring />
                  {author.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle size={11} className="text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-text text-sm group-hover:text-primary transition-colors">{author.name}</h3>
                <p className="text-xs text-muted mt-0.5">{author.genres[0]}</p>
                <div className="flex items-center justify-center gap-3 mt-3 text-xs text-muted">
                  <span><span className="font-bold text-text">{(author.followers / 1000).toFixed(0)}K</span> followers</span>
                  <span className="text-border">·</span>
                  <span><span className="font-bold text-text">{author.books}</span> books</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ====== CLUBS ====== */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
              <div>
                <Badge color="success" className="mb-3">Community</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-text">Join Reading Clubs</h2>
                <p className="text-muted mt-2">Connect with readers who share your passion</p>
              </div>
              <Link to="/clubs">
                <Button variant="ghost" icon={ArrowRight} iconRight>All Clubs</Button>
              </Link>
            </motion.div>

            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockClubs.slice(0, 3).map(club => (
                <motion.div key={club.id} variants={fadeUp}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge color="primary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Loved by Readers Worldwide</h2>
          </motion.div>
          <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-6">
            {mockTestimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-border shadow-soft"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text/80 leading-relaxed mb-5 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar src={t.avatar} name={t.name} size="md" />
                  <div>
                    <p className="text-sm font-bold text-text">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ====== PRICING ====== */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge color="primary" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted text-lg">Start free. Upgrade when you're ready.</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {mockPricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-6 border ${
                  plan.highlighted
                    ? 'bg-gradient-primary text-white border-transparent shadow-glow relative'
                    : 'bg-white border-border shadow-soft'
                }`}
              >
                {plan.highlighted && (
                  <Badge color="warning" size="sm" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-text'}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/80' : 'text-muted'}`}>{plan.description}</p>
                <div className="mb-5">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-text'}`}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className={`text-sm ml-1 ${plan.highlighted ? 'text-white/70' : 'text-muted'}`}>/{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-white/90' : 'text-text/80'}`}>
                      <CheckCircle size={15} className={plan.highlighted ? 'text-white mt-0.5 shrink-0' : 'text-success mt-0.5 shrink-0'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    full
                    variant={plan.highlighted ? 'white' : plan.id === 'free' ? 'outline' : 'primary'}
                    size="md"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <Badge className="mb-6 bg-white/20 text-white border-white/20">
              <Sparkles size={11} /> Start Your Journey
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Ready to Read Smarter?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Join 1.2 million readers who've transformed their reading experience with ReadSphere.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button size="xl" variant="white">Get Started — It's Free</Button>
              </Link>
              <Link to="/marketplace">
                <Button size="xl" variant="ghost" className="text-white border-white/30 hover:bg-white/10">
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
