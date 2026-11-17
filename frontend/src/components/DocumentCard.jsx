
import {
  FileText,
  File,
  FileType,
  Eye,
  Trash2
} from 'lucide-react';

function DocumentCard({ file, onPreview, onDelete }) {

  const getFileIcon = () => {
    if (file.type === 'PDF') return <FileText size={25} />;
    if (file.type === 'DOCX') return <FileType size={25} />;
    return <File size={25} />;
  };

  return (
    <div className="file-card">
      <div className={`large-file-icon ${file.type.toLowerCase()}`}>
        {getFileIcon()}
      </div>

      <span className="file-type-label">
        {file.type} DOCUMENT
      </span>

      <h3 title={file.name}>{file.name}</h3>
      <p>{file.size}</p>

      <div className="file-card-actions">
        <button onClick={() => onPreview(file)}>
          <Eye size={16} /> Preview
        </button>

        <button
          className="delete-action"
          aria-label={`Delete ${file.name}`}
          onClick={() => onDelete(file.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;
