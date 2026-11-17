import  '../styles/Documents.css';
import { useRef, useState } from 'react';
import DocumentCard from '../components/DocumentCard';
import {
  Upload, Search, FileText, File,
  FileType, Trash2, Eye, X,
  FolderOpen, Filter, Plus
} from 'lucide-react';

function Documents() {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([
    { id: 1, name: 'Java Programming Notes.pdf', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Database Management.docx', type: 'DOCX', size: '1.8 MB' },
    { id: 3, name: 'Machine Learning Basics.pdf', type: 'PDF', size: '3.2 MB' },
    { id: 4, name: 'Web Development Notes.txt', type: 'TXT', size: '450 KB' }
  ]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const uploadFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const allowed = ['pdf', 'docx', 'txt'];

    const newFiles = selectedFiles
      .filter(file => allowed.includes(file.name.split('.').pop().toLowerCase()))
      .map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.name.split('.').pop().toUpperCase(),
        size: `${(file.size / 1048576).toFixed(2)} MB`
      }));

    setFiles(previous => [...newFiles, ...previous]);
    event.target.value = '';
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

        <button className="page-primary-btn"
          onClick={() => inputRef.current?.click()}>
          <Plus size={17} /> Upload Document
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          hidden
          onChange={uploadFiles}
        />
      </div>

      <div className="document-summary">
        <div>
          <FolderOpen size={21} />
          <span>{files.length} documents in your library</span>
        </div>
        <span>Supported: PDF, DOCX, TXT</span>
      </div>

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
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>PDF</option>
            <option>DOCX</option>
            <option>TXT</option>
          </select>
        </div>
      </div>

      
<div className="file-grid">
  {filteredFiles.map(file => (
    <DocumentCard
      key={file.id}
      file={file}
      onPreview={setSelected}
      onDelete={(id) => {
        setFiles(previous =>
          previous.filter(item => item.id !== id)
        );
      }}
    />
  ))}
</div>


      {filteredFiles.length === 0 && (
        <div className="page-empty">
          <FolderOpen size={35} />
          <h3>No documents found</h3>
          <p>Try another search or upload a new document.</p>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>

            <FileText size={38} color="#8973D5" />
            <h3>{selected.name}</h3>
            <p>File type: {selected.type}</p>
            <p>File size: {selected.size}</p>
            <p className="preview-note">
              Document preview will be available when file processing
              is connected to the backend.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Documents;
