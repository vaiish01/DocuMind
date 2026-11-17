
import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import AIAssistant from './pages/AIAssistant';
import StudyTools from './pages/StudyTools';
import Settings from './pages/Settings';



function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'My Documents':
        return <Documents />;
      case 'AI Assistant':
        return <AIAssistant />;
      case 'Study Tools':
        return <StudyTools />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <Topbar activePage={activePage} />
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
