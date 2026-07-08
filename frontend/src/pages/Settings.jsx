import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Lock, Bell, CreditCard, Palette, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../store/slices/authSlice.js';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      const parts = user.name ? user.name.split(' ') : [''];
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  if (!user) return null;

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'security', label: 'Security & Login', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    
    const result = await dispatch(updateUserProfile({ name, bio: formData.bio }));
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Settings saved successfully');
    } else {
      toast.error(result.payload?.message || 'Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
        <p className="text-muted">Manage your account preferences and configurations.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === t.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted hover:bg-gray-100 hover:text-text'
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-3xl border border-border shadow-soft p-6 sm:p-8">
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-text mb-6">Account Profile</h2>
              
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                <Avatar src={user.avatar} name={user.name} size="2xl" />
                <div>
                  <div className="flex gap-3 mb-2">
                    <Button size="sm">Change Avatar</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                  <p className="text-xs text-muted">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                  <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <Input label="Email Address" type="email" value={user.email} disabled />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-muted text-right">{formData.bio.length} / 500 characters</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" loading={loading}>Save Changes</Button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-text mb-6">Appearance</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-text mb-3">Theme Preference</p>
                  <div className="grid grid-cols-3 gap-4 max-w-lg">
                    {[
                      { id: 'light', icon: Monitor, label: 'Light' },
                      { id: 'dark', icon: Monitor, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' }
                    ].map(t => (
                      <button key={t.id} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${t.id === 'light' ? 'border-primary bg-primary-50' : 'border-border hover:border-primary/40'}`}>
                        <t.icon size={24} className={t.id === 'light' ? 'text-primary' : 'text-muted'} />
                        <span className="text-sm font-bold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm font-bold text-text mb-3">Reader Font Settings</p>
                  <div className="flex gap-4">
                    <select className="px-4 py-2 rounded-xl border border-border text-sm outline-none">
                      <option>Inter (Sans-serif)</option>
                      <option>Georgia (Serif)</option>
                      <option>OpenDyslexic</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-border text-sm outline-none">
                      <option>Medium Text (18px)</option>
                      <option>Large Text (20px)</option>
                      <option>Small Text (16px)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Placeholder for other tabs */}
          {['security', 'notifications', 'billing'].includes(activeTab) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
              <SettingsIcon size={48} className="text-border mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text mb-2 capitalize">{activeTab} Settings</h3>
              <p className="text-muted">This section is under construction.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
