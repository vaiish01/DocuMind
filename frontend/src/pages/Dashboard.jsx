
import { useRef, useState } from 'react';

import {
  Upload,
  FileText,
  File,
  FileType,
  MessageSquareText,
  BookOpen,
  Brain,
  ArrowUpRight,
  MoreHorizontal,
  Clock3,
  Sparkles,
  Plus,
  Search,
  CheckCircle2
} from 'lucide-react';

import '../styles/Dashboard.css';

const initialDocuments = [
  {
    id: 1,
    name: 'Java Programming Notes.pdf',
    type: 'PDF',
    size: '2.4 MB',
    date: 'Today',
    color: 'purple'
  },
  {
    id: 2,
    name: 'Database Management.docx',
    type: 'DOCX',
    size: '1.8 MB',
    date: 'Yesterday',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Machine Learning Basics.pdf',
    type: 'PDF',
    size: '3.2 MB',
    date: 'Oct 28, 2026',
    color: 'orange'
  },
  {
    id: 4,
    name: 'Web Development Notes.txt',
    type: 'TXT',
    size: '450 KB',
    date: 'Oct 26, 2026',
    color: 'green'
  }
];

function Dashboard() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const allowedExtensions = ['pdf', 'docx', 'txt'];

    const validFiles = files.filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });

    if (!validFiles.length) {
      setMessage('Please select a PDF, DOCX or TXT file.');
      event.target.value = '';
      return;
    }

    const newDocuments = validFiles.map((file, index) => {
      const extension = file.name.split('.').pop().toUpperCase();

      return {
        id: Date.now() + index,
        name: file.name,
        type: extension,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: 'Just now',
        color: 'purple'
      };
    });

    setDocuments((previous) => [
      ...newDocuments,
      ...previous
    ]);

    setMessage(
      `${newDocuments.length} document(s) added to your preview!`
    );

    event.target.value = '';
  };

  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (type) => {
    if (type === 'PDF') return FileText;
    if (type === 'DOCX') return FileType;
    return File;
  };

  const quickActions = [
    {
      title: 'Chat with Documents',
      description: 'Ask questions and get instant answers.',
      icon: MessageSquareText,
      color: 'lavender'
    },
    {
      title: 'Generate Summary',
      description: 'Turn lengthy documents into clear notes.',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Create a Quiz',
      description: 'Test your knowledge with AI-generated quizzes.',
      icon: Brain,
      color: 'peach'
    }
  ];

  return (
    <div className="dashboard">

      {/* Welcome Section */}

      <section className="welcome-section">
        <div>
          <div className="welcome-tag">
            <Sparkles size={14} />
            YOUR PERSONAL KNOWLEDGE SPACE
          </div>

          <h2>
            Turn your documents into
            <span> knowledge.</span>
          </h2>

          <p>
            Upload, explore, and learn smarter with your
            AI-powered document assistant.
          </p>

          <button
            className="primary-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            Upload Document
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            multiple
            hidden
            onChange={handleUpload}
          />

          <span className="upload-hint">
            PDF, DOCX and TXT supported
          </span>
        </div>

        <div className="welcome-art">
          <div className="art-glow"></div>
          <div className="art-document">
            <div className="art-top">
              <div className="art-icon">
                <FileText size={25} />
              </div>
              <Sparkles size={21} className="art-sparkle" />
            </div>

            <div className="art-line long"></div>
            <div className="art-line medium"></div>
            <div className="art-line short"></div>

            <div className="art-ai-badge">
              <Brain size={17} />
              AI powered
            </div>
          </div>

          <div className="floating-star star-one">✦</div>
          <div className="floating-star star-two">✧</div>
        </div>
      </section>

      {message && (
        <div className="upload-message" role="status">
          <CheckCircle2 size={17} />
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      {/* Statistics */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon lavender-icon">
              <FileText size={20} />
            </div>
            <span className="stat-label">TOTAL DOCUMENTS</span>
          </div>

          <h3>{documents.length}</h3>
          <p>Documents in your workspace</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue-icon">
              <MessageSquareText size={20} />
            </div>
            <span className="stat-label">AI CONVERSATIONS</span>
          </div>

          <h3>12</h3>
          <p>Questions explored so far</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon peach-icon">
              <BookOpen size={20} />
            </div>
            <span className="stat-label">STUDY SESSIONS</span>
          </div>

          <h3>8</h3>
          <p>Learning sessions completed</p>
        </div>

      </section>

      {/* Quick Actions */}

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h3>What would you like to do?</h3>
            <p>Pick up where you left off or start something new.</p>
          </div>
        </div>

        <div className="quick-actions-grid">

          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                className="quick-action-card"
                key={action.title}
                onClick={() => {
                  setMessage(`${action.title} will be available soon!`);
                }}
              >
                <div className={`quick-icon ${action.color}`}>
                  <Icon size={21} />
                </div>

                <div className="quick-action-text">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>

                <ArrowUpRight size={19} className="quick-arrow" />
              </button>
            );
          })}

        </div>
      </section>

      {/* Recent Documents */}

      <section className="dashboard-section documents-section">

        <div className="section-heading">
          <div>
            <h3>Recent Documents</h3>
            <p>Your recently added learning materials.</p>
          </div>

          <button
            className="text-button"
            onClick={() => setMessage('My Documents page is coming soon!')}
          >
            View all <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="document-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search your documents..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="documents-table">

          <div className="document-table-header">
            <span>DOCUMENT NAME</span>
            <span>FILE TYPE</span>
            <span>FILE SIZE</span>
            <span>ADDED</span>
            <span></span>
          </div>

          {filteredDocuments.length > 0 ? (
            filteredDocuments.slice(0, 5).map((document) => {
              const Icon = getFileIcon(document.type);

              return (
                <div className="document-row" key={document.id}>

                  <div className="document-name">
                    <div className={`file-icon ${document.color}`}>
                      <Icon size={20} />
                    </div>

                    <span>{document.name}</span>
                  </div>

                  <span className="document-type">
                    {document.type}
                  </span>

                  <span className="document-size">
                    {document.size}
                  </span>

                  <span className="document-date">
                    <Clock3 size={14} />
                    {document.date}
                  </span>

                  <button
                    className="more-button"
                    aria-label={`More options for ${document.name}`}
                    onClick={() => setMessage(document.name)}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                </div>
              );
            })
          ) : (
            <div className="empty-documents">
              No documents found. Try another search.
            </div>
          )}

        </div>
      </section>

      {/* Bottom Tip */}

      <section className="dashboard-tip">
        <div className="tip-icon">
          <Sparkles size={20} />
        </div>

        <div>
          <h4>A little tip for smarter learning</h4>
          <p>
            Upload your study material and ask DocuMind to
            explain difficult topics in simple language.
          </p>
        </div>

        <ArrowUpRight size={19} className="tip-arrow" />
      </section>

    </div>
  );
}

export default Dashboard;
