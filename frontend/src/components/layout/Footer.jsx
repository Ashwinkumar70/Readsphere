import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, Code, Camera, Briefcase, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Marketplace', to: '/marketplace' },
    { label: 'Reading Clubs', to: '/clubs' },
    { label: 'Collections', to: '/collections' },
    { label: 'AI Reader', to: '/reader/1' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Authors: [
    { label: 'Publish a Book', to: '/upload' },
    { label: 'Author Dashboard', to: '/author' },
    { label: 'Analytics', to: '/author' },
    { label: 'Revenue', to: '/author' },
  ],
  Community: [
    { label: 'Book Clubs', to: '/clubs' },
    { label: 'Discussions', to: '/clubs' },
    { label: 'Events', to: '/clubs' },
  ],
  Company: [
    { label: 'About', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
};

const socials = [
  { Icon: MessageCircle, label: 'Twitter', href: '#' },
  { Icon: Code, label: 'GitHub', href: '#' },
  { Icon: Camera, label: 'Instagram', href: '#' },
  { Icon: Briefcase, label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-sm">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ReadSphere</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-5">
              The AI-powered reading companion that combines Kindle, Goodreads, Spotify, and Discord into one premium platform.
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-muted hover:bg-primary-50 hover:text-primary transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-bold text-text mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-hero border border-border mb-8">
          <div className="flex-1">
            <h3 className="font-bold text-text mb-1">Get the best books in your inbox</h3>
            <p className="text-sm text-muted">Weekly curated picks from our AI + editorial team</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
            />
            <button className="px-5 py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-xl hover:shadow-glow-sm transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-sm text-muted">
            © 2024 ReadSphere, Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted flex items-center gap-1">
            Made with <Heart size={13} className="text-red-400 fill-red-400" /> for readers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
