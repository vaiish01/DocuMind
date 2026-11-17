
import { useState } from 'react';

import {
  User, Shield, Save, Mail, Sparkles
} from 'lucide-react';

import '../styles/Settings.css';

function Settings() {
  const [name, setName] = useState('Iggy');
  const [email, setEmail] = useState('student@example.com');
  const [message, setMessage] = useState('');

  const saveSettings = (event) => {
    event.preventDefault();
    setMessage('Your settings have been saved in this preview.');
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PERSONALIZE YOUR EXPERIENCE</span>
          <h2>Settings</h2>
          <p>Manage your profile and account preferences.</p>
        </div>
      </div>

      <form className="settings-layout" onSubmit={saveSettings}>

        {/* Profile Information */}
        <section className="settings-card">
          <div className="settings-title">
            <div className="settings-icon">
              <User size={20} />
            </div>
            <div>
              <h3>Profile Information</h3>
              <p>Update your personal details.</p>
            </div>
          </div>

          <div className="settings-profile">
            <div className="settings-avatar">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <strong>{name || 'Your Name'}</strong>
              <span>DocuMind Member</span>
            </div>
          </div>

          <label className="settings-field">
            Full Name
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label className="settings-field">
            Email Address
            <div className="settings-input-icon">
              <Mail size={16} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </label>
        </section>

        {/* Account & Privacy */}
        <section className="settings-card">
          <div className="settings-title">
            <div className="settings-icon">
              <Shield size={20} />
            </div>
            <div>
              <h3>Account & Privacy</h3>
              <p>Manage your account security.</p>
            </div>
          </div>

          <div className="privacy-info">
            <Sparkles size={19} />
            <div>
              <strong>Personal workspace</strong>
              <p>
                Your account and document security settings will be
                connected when authentication is implemented.
              </p>
            </div>
          </div>
        </section>

        {message && (
          <p className="settings-success">{message}</p>
        )}

        <div className="settings-save">
          <button className="page-primary-btn" type="submit">
            <Save size={17} /> Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}

export default Settings;
