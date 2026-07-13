import { Link } from 'react-router-dom';
import { BookOpen, Shield } from 'lucide-react';

export default function TermsOfService() {
  const lastUpdated = "July 13, 2026";
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="pt-12 pb-24 px-6 relative overflow-hidden" style={{ background: '#004741' }}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center text-white mt-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Terms of Service</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Please read these terms carefully before using ReadSphere. They outline your rights, our responsibilities, and the rules of our platform.
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
              Welcome to ReadSphere. By accessing or using our platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>1. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <ul className="space-y-2 my-4 list-disc pl-6">
              <li>You are responsible for safeguarding the password that you use to access the Service.</li>
              <li>You agree not to disclose your password to any third party.</li>
              <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>2. Content Ownership & Copyright</h2>
            <p className="mb-4">
              ReadSphere respects the intellectual property of others and expects its users to do the same. If you are an author publishing content on our platform:
            </p>
            <ul className="space-y-2 my-4 list-disc pl-6">
              <li>You retain all rights to any original content you submit, post or display on or through the Service.</li>
              <li>By submitting content to ReadSphere, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, and publish that content solely for the purpose of operating the platform.</li>
              <li>You agree not to post content that infringes on any third-party copyrights or trademarks.</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>3. Prohibited Activities</h2>
            <p className="mb-4">
              You agree not to engage in any of the following activities:
            </p>
            <ul className="space-y-2 my-4 list-disc pl-6">
              <li>Scraping, copying, or illegally distributing copyrighted materials found on ReadSphere.</li>
              <li>Using the platform for any illegal or unauthorized purpose.</li>
              <li>Attempting to interfere with, compromise the system integrity, or decipher any transmissions to or from the servers running the Service.</li>
              <li>Using the AI reading assistant features to generate and mass-publish automated content without human editorial oversight.</li>
            </ul>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>4. Purchases and Subscriptions</h2>
            <p className="mb-4">
              If you wish to purchase any product or service made available through ReadSphere ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, and your billing address. All transactions are processed through secure third-party payment gateways.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>5. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall ReadSphere, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2 className="text-2xl mt-10 mb-4 border-b border-border pb-2 font-bold" style={{ color: '#004741', fontFamily: 'Outfit, sans-serif' }}>6. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-text m-0">Questions about our Terms?</h3>
                <p className="text-sm m-0 mt-1">Our support team is here to help.</p>
              </div>
              <Link to="/contact" className="inline-flex items-center justify-center h-10 px-6 font-semibold text-white rounded-xl transition-colors whitespace-nowrap" style={{ background: '#004741' }}>
                Contact Support
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
