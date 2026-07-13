import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "July 13, 2026";
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="pt-12 pb-24 px-6 relative overflow-hidden" style={{ background: '#004741' }}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center text-white mt-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Privacy Policy</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Your privacy is critically important to us. Learn how ReadSphere collects, uses, and protects your personal data.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
            <Shield size={16} style={{ color: '#C89B3C' }} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-soft border border-border p-8 md:p-12">
          
          <div className="prose prose-lg max-w-none text-muted">
            <p className="lead text-lg font-medium text-text mb-8">
              At ReadSphere, we respect your privacy regarding any information we may collect while operating our website. We have developed this privacy policy to help you understand how we manage your data.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>1. Data Collection</h2>
            <p className="mb-4">
              We collect information that you provide directly to us, such as when you create or modify your account, purchase a book, or communicate with us. The types of personal information we may collect include:
            </p>
            <ul className="space-y-2 my-4 list-disc pl-6">
              <li>Your name, username, and email address.</li>
              <li>Your reading history, bookmarks, and highlights to power our AI Assistant features.</li>
              <li>Payment information (processed securely through third-party providers like Stripe).</li>
              <li>Device and usage data collected automatically when you access ReadSphere.</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>2. Data Usage</h2>
            <p className="mb-4">
              We use the information we collect primarily to provide, maintain, and improve our services. This includes:
            </p>
            <ul className="space-y-2 my-4 list-disc pl-6">
              <li>Authenticating your account via Google OAuth or standard email/password login.</li>
              <li>Personalizing your reading experience and generating book recommendations.</li>
              <li>Processing transactions and sending related information such as purchase confirmations.</li>
              <li>Detecting, investigating, and preventing fraudulent transactions and other illegal activities.</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>3. Cookies & Tracking</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            <p className="mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>4. Third-Party Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>5. Data Security</h2>
            <p className="mb-4">
              The security of your data is important to us. We adopt appropriate data collection, storage, and processing practices, along with security measures, to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>6. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have rights under privacy laws like the GDPR or CCPA to access, correct, delete, or restrict the use of your personal data. You can exercise these rights directly within your account settings or by contacting our support team.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-text m-0">Privacy Concerns?</h3>
                <p className="text-sm m-0 mt-1">Reach out to our Data Protection Officer.</p>
              </div>
              <Link to="/contact" className="inline-flex items-center justify-center h-10 px-6 font-semibold text-white rounded-xl transition-colors whitespace-nowrap" style={{ background: '#004741' }}>
                Contact Privacy Team
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
