
import '../styles/Documents.css';
import { useEffect, useRef, useState } from 'react';
import DocumentCard from '../components/DocumentCard';
import {
  Search, FileText, X, FolderOpen, Filter, Plus
} from 'lucide-react';

import {
  getDocuments,
  uploadDocument,
  deleteDocument
} from '../services/documentService';

function formatFileSize(bytes) {
  if (!bytes) return '0 KB';

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function mapDocument(document) {
  const filename = document.originalFilename || document.title || 'Untitled';
  const extension = filename.split('.').pop().toUpperCase();

  return {
    id: document.id,
    name: document.title || filename,
    type: extension,
    size: formatFileSize(document.fileSize),
    extractedText: document.extractedText || ''
  };
}

function Documents() {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Load documents from the backend when the page opens.
  const loadDocuments = async () => {
    try {
      setError('');
      const documents = await getDocuments();
      setFiles(documents.map(mapDocument));
    } catch (err) {
      setError(err.message || 'Unable to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Upload selected files to Spring Boot.
  const handleUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = '';

    if (selectedFiles.length === 0) return;

    const allowed = ['pdf', 'docx', 'txt'];

    const validFiles = selectedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return allowed.includes(extension);
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Only PDF, DOCX and TXT files are supported.');
    } else {
      setError('');
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of validFiles) {
        await uploadDocument(file);
      }

      await loadDocuments();
    } catch (err) {
      setError(err.message || 'Document upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Delete document from PostgreSQL.
  const handleDelete = async (id) => {
    try {
      setError('');
      await deleteDocument(id);

      setFiles(previous => previous.filter(file => file.id !== id));

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to delete document.');
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || file.type === filter)
  );

  return (
    <div className="page-container">

      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR LIBRARY</span>
          <h2>My Documents</h2>
          <p>All your learning materials, organized in one place.</p>
        </div>

        <button
          className="page-primary-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Plus size={17} />
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          hidden
          onChange={handleUpload}
        />
      </div>

      <div className="document-summary">
        <div>
          <FolderOpen size={21} />
          <span>{files.length} documents in your library</span>
        </div>
        <span>Supported: PDF, DOCX, TXT</span>
      </div>

      {error && (
        <div className="document-error" role="alert">
          {error}
        </div>
      )}

      <div className="page-toolbar">
        <div className="page-search">
          <Search size={18} />
          <input
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-control">
          <Filter size={17} />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>PDF</option>
            <option>DOCX</option>
            <option>TXT</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="page-empty">
          <p>Loading your documents...</p>
        </div>
      ) : (
        <>
          <div className="file-grid">
            {filteredFiles.map(file => (
              <DocumentCard
                key={file.id}
                file={file}
                onPreview={setSelected}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="page-empty">
              <FolderOpen size={35} />
              <h3>No documents found</h3>
              <p>
                {files.length === 0
                  ? 'Upload your first document to get started.'
                  : 'Try another search or upload a new document.'}
              </p>
            </div>
          )}
        </>
      )}

      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="preview-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>

            <FileText size={38} color="#8973D5" />

            <h3>{selected.name}</h3>
            <p>File type: {selected.type}</p>
            <p>File size: {selected.size}</p>

            <div className="document-text-preview">
              <h4>Extracted Document Text</h4>
              <p>
                {selected.extractedText
                  ? selected.extractedText
                  : 'No readable text was found.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Documents;
