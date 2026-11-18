
import { useState, useEffect } from 'react';

import {
  User, Shield, Save, Mail, Sparkles
} from 'lucide-react';

import '../styles/Settings.css';

function Settings() {
  const [name, setName] = useState('Iggy');
  const [email, setEmail] = useState('student@example.com');
  const [message, setMessage] = useState('');

  // Load saved profile details when the page opens
  useEffect(() => {
    const savedName = localStorage.getItem('documind-user-name');
    const savedEmail = localStorage.getItem('documind-user-email');

    if (savedName !== null) {
      setName(savedName);
    }

    if (savedEmail !== null) {
      setEmail(savedEmail);
    }
  }, []);

  // Save profile details
  const saveSettings = (event) => {
    event.preventDefault();

    localStorage.setItem('documind-user-name', name.trim());
    localStorage.setItem('documind-user-email', email.trim());

    setName(name.trim());
    setEmail(email.trim());

    setMessage('Your settings have been saved successfully!');
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
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

        
{/* About DocuMind */}
<section className="settings-card">
  <div className="settings-title">
    <div className="settings-icon">
      <Sparkles size={20} />
    </div>
    <div>
      <h3>About DocuMind</h3>
      <p>Your personal document study assistant.</p>
    </div>
  </div>

  <div className="privacy-info">
    <Sparkles size={19} />
    <div>
      <strong>Learn smarter with DocuMind</strong>
      <p>
        DocuMind is an AI-powered document intelligence and study
        assistant designed to make learning easier and more effective.
      </p>
    </div>
  </div>

  <div className="settings-about-details">
    <div>
      <strong>What you can do</strong>
      <p>Upload documents, ask questions, generate summaries,
        create flashcards and test your knowledge with quizzes.</p>
    </div>

    <div>
      <strong>Powered by AI</strong>
      <p>Get quick insights and understand your study materials
        through AI-powered assistance.</p>
    </div>

    <div>
      <strong>Our goal</strong>
      <p>Make studying simpler by turning lengthy documents
        into easy-to-understand learning resources.</p>
    </div>
  </div>

  <div className="settings-about-footer">
    <span>DocuMind</span>
    <span>AI-Powered Learning Assistant</span>
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
