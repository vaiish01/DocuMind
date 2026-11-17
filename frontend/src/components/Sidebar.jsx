
import {
  LayoutDashboard,
  Files,
  MessageSquareText,
  GraduationCap,
  Settings,
  BrainCircuit,
  ChevronLeft
} from 'lucide-react';

import '../styles/Sidebar.css';

function Sidebar({ activePage, setActivePage }) {

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Documents', icon: Files },
    { name: 'AI Assistant', icon: MessageSquareText },
    { name: 'Study Tools', icon: GraduationCap }
  ];

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-icon">
          <BrainCircuit size={25} />
        </div>

        <div className="brand-name">
          <h2>DocuMind</h2>
          <span>Think beyond pages</span>
        </div>
      </div>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? 'active' : ''
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          className={`nav-item ${
            activePage === 'Settings' ? 'active' : ''
          }`}
          onClick={() => setActivePage('Settings')}
        >
          <Settings size={19} strokeWidth={1.8} />
          <span>Settings</span>
        </button>

        <div className="sidebar-profile">
          <div className="profile-avatar">I</div>

          <div className="profile-info">
            <strong>My Workspace</strong>
            <span>Free Plan</span>
          </div>

          <ChevronLeft size={17} className="profile-chevron" />
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
