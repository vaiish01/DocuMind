
import { useEffect, useRef, useState } from 'react';

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
  Search,
  CheckCircle2
} from 'lucide-react';

import '../styles/Dashboard.css';

import {
  getDocuments,
  uploadDocument,
  getDashboardStats
} from '../services/documentService';

function formatFileSize(bytes) {
  if (!bytes) return '0 KB';

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date) {
  if (!date) return 'Recently';

  const uploadedDate = new Date(date);

  if (Number.isNaN(uploadedDate.getTime())) {
    return 'Recently';
  }

  return uploadedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function mapDocument(document, index) {
  const filename =
    document.originalFilename || document.title || 'Untitled';

  const extension = filename.split('.').pop().toUpperCase();

  const colors = ['purple', 'blue', 'orange', 'green'];

  return {
    id: document.id,
    name: document.title || filename,
    type: extension,
    size: formatFileSize(document.fileSize),
    date: formatDate(document.uploadedAt),
    color: colors[index % colors.length]
  };
}

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const [stats, setStats] = useState({
  totalDocuments: 0,
  aiConversations: 0,
  studySessions: 0
});
  // Fetch actual documents from PostgreSQL.
  const loadDocuments = async () => {
  try {
    const [documentsData, statsData] = await Promise.all([
      getDocuments(),
      getDashboardStats()
    ]);

    const mappedDocuments = documentsData.map(mapDocument);

    setDocuments(mappedDocuments);
    setStats(statsData);

  } catch (error) {
    setMessage(error.message || 'Unable to load dashboard data.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadDocuments();
  }, []);

  // Upload documents through Spring Boot.
  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    event.target.value = '';

    if (!files.length) return;

    const allowedExtensions = ['pdf', 'docx', 'txt'];

    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      setMessage('Only PDF, DOCX and TXT files are supported.');
    } else {
      setMessage('');
    }

    if (!validFiles.length) return;

    setUploading(true);

    try {
      for (const file of validFiles) {
        await uploadDocument(file);
      }

      await loadDocuments();

      setMessage(
        `${validFiles.length} document(s) uploaded successfully!`
      );
    } catch (error) {
      setMessage(error.message || 'Document upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const filteredDocuments = documents.filter(document =>
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
            disabled={uploading}
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>

          <input
            id="dashboard-document-upload"
            name="dashboardDocuments"
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

          <button onClick={() => setMessage('')}>
            ×
          </button>
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
<h3>{loading ? '—' : stats.totalDocuments}</h3>
<p>Documents in your workspace</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue-icon">
              <MessageSquareText size={20} />
            </div>

            <span className="stat-label">AI CONVERSATIONS</span>
          </div>

        <h3>{loading ? '—' : stats.aiConversations}</h3>
<p>Total AI conversations</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon peach-icon">
              <BookOpen size={20} />
            </div>

            <span className="stat-label">STUDY SESSIONS</span>
          </div>

          <h3>{loading ? '—' : stats.studySessions}</h3>
<p>Total study sessions</p>
        </div>

      </section>

      
      {/* Recent Documents */}

      <section className="dashboard-section documents-section">

        <div className="section-heading">
          <div>
            <h3>Recent Documents</h3>
            <p>Your recently added learning materials.</p>
          </div>
        </div>

        <div className="document-search">
          <Search size={17} />

          <input
            id="dashboard-document-search"
            name="dashboardSearch"
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

          {loading ? (
            <div className="empty-documents">
              Loading your documents...
            </div>
          ) : filteredDocuments.length > 0 ? (
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
                    aria-label={`Document: ${document.name}`}
                    onClick={() => {
                      setMessage(`${document.name} is in your library.`);
                    }}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                </div>
              );
            })
          ) : (
            <div className="empty-documents">
              {documents.length === 0
                ? 'No documents uploaded yet. Upload your first document!'
                : 'No documents found. Try another search.'}
            </div>
          )}

        </div>
      </section>

      {/* Bottom Tip */}

      

    </div>
  );
}

export default Dashboard;
