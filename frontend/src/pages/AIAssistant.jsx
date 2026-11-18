
import '../styles/AIAssistant.css';
import { useEffect, useState } from 'react';

import {
  Bot,
  Send,
  User,
  Sparkles,
  FileText,
  Plus,
  MessageSquare,
  LoaderCircle
} from 'lucide-react';

import {
  getDocuments,
  sendChatMessage,
  getConversations,
  getConversationMessages
} from '../services/documentService';

function AIAssistant() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  const [question, setQuestion] = useState('');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am DocuMind AI. Select one of your uploaded documents to get started.'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeAssistant();
  }, []);

  // Load documents and previous conversations
  const initializeAssistant = async () => {
    try {
      setLoading(true);
      setError('');

      const [documentData, conversationData] = await Promise.all([
        getDocuments(),
        getConversations()
      ]);

      setDocuments(documentData);
      setConversations(conversationData);

      if (documentData.length > 0) {
        setSelectedDocumentId(documentData[0].id);
      }
    } catch (err) {
      setError(err.message || 'Unable to load your data.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDocument = documents.find(
    doc => doc.id === selectedDocumentId
  );

  const documentName = selectedDocument
    ? selectedDocument.originalFilename || selectedDocument.title
    : '';

  const suggestions = [
    'Summarize this document',
    'Explain the important concepts',
    'Generate interview questions',
    'Explain in simple words'
  ];

  // Send a message
  const sendMessage = async (customQuestion) => {
    const text = (customQuestion ?? question).trim();

    if (!text || !selectedDocumentId || sending) return;

    const documentId = selectedDocumentId;
    const currentConversationId = conversationId;

    setQuestion('');
    setError('');

    setMessages(previous => [
      ...previous,
      { role: 'user', text }
    ]);

    try {
      setSending(true);

      const data = await sendChatMessage(
        documentId,
        text,
        currentConversationId
      );

      // Save the conversation ID returned by the backend
      setConversationId(data.conversationId);

      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          text: data.answer
        }
      ]);

      // Refresh sidebar history
      const updatedConversations = await getConversations();
      setConversations(updatedConversations);

    } catch (err) {
      setError(err.message || 'Unable to get an AI response.');

      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          text: 'Sorry, I could not generate a response. Please try again.'
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  // Start a new conversation without deleting old ones
  const startNewConversation = () => {
    setConversationId(null);

    setMessages([
      {
        role: 'assistant',
        text: 'Hello! What would you like to learn from your document?'
      }
    ]);

    setQuestion('');
    setError('');
  };

  // Open an existing conversation
  const openConversation = async (conversation) => {
    if (sending || historyLoading) return;

    try {
      setHistoryLoading(true);
      setError('');

      const savedMessages = await getConversationMessages(
        conversation.conversationId
      );

      setConversationId(conversation.conversationId);
      setSelectedDocumentId(conversation.documentId);

      setMessages(
        savedMessages.map(message => ({
          role: message.role.toLowerCase() === 'user'
            ? 'user'
            : 'assistant',
          text: message.content
        }))
      );

      setQuestion('');

    } catch (err) {
      setError(err.message || 'Unable to open this conversation.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Changing documents starts a fresh conversation
  const handleDocumentChange = (documentId) => {
    setSelectedDocumentId(documentId);
    startNewConversation();
  };

  return (
    <div className="assistant-page">

      <div className="page-heading assistant-heading">
        <div>
          <span className="eyebrow">YOUR AI LEARNING PARTNER</span>
          <h2>AI Assistant</h2>
          <p>Have a conversation with your documents.</p>
        </div>
      </div>

      <div className="chat-workspace">

        <aside className="chat-sidebar">

          <button
            className="new-chat-btn"
            onClick={startNewConversation}
            disabled={sending || historyLoading}
          >
            <Plus size={17} /> New conversation
          </button>

          <p className="chat-sidebar-label">CURRENT DOCUMENT</p>

          <div className="selected-document">
            <FileText size={20} />

            <div>
              <strong>
                {loading
                  ? 'Loading documents...'
                  : documentName || 'No document selected'}
              </strong>

              <span>
                {selectedDocument
                  ? 'Uploaded document'
                  : 'Select a document'}
              </span>
            </div>
          </div>

          <label
            className="chat-sidebar-label"
            htmlFor="document-select"
          >
            CHANGE DOCUMENT
          </label>

          <select
            id="document-select"
            className="document-select"
            value={selectedDocumentId}
            onChange={e => handleDocumentChange(e.target.value)}
            disabled={loading || documents.length === 0 || sending}
          >
            <option value="">Select a document</option>

            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.originalFilename || doc.title}
              </option>
            ))}
          </select>

          {error && <p className="document-error">{error}</p>}

          {/* Saved conversation history */}
          <p className="chat-sidebar-label history-heading">
            RECENT CONVERSATIONS
          </p>

          <div className="conversation-history">

            {historyLoading && (
              <p className="history-empty">
                Loading conversation...
              </p>
            )}

            {!historyLoading && conversations.length === 0 && (
              <p className="history-empty">
                No saved conversations yet.
              </p>
            )}

            {conversations.map(conversation => {
              const doc = documents.find(
                item => item.id === conversation.documentId
              );

              return (
                <button
                  key={conversation.conversationId}
                  className={`conversation-history-item ${
                    conversationId === conversation.conversationId
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => openConversation(conversation)}
                  disabled={sending || historyLoading}
                >
                  <MessageSquare size={16} />

                  <span>
                    {doc
                      ? doc.originalFilename || doc.title
                      : 'Document conversation'}
                  </span>
                </button>
              );
            })}

          </div>

          <div className="chat-sidebar-bottom">
            <MessageSquare size={17} />
            <span>Document-based learning</span>
          </div>

        </aside>

        <section className="chat-main">

          <div className="chat-header">
            <div className="chat-bot-icon">
              <Bot size={22} />
            </div>

            <div>
              <h3>DocuMind AI</h3>
              <span>Ask, explore and understand</span>
            </div>
          </div>

          <div className="chat-messages">

            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={index}
              >
                <div className="chat-message-avatar">
                  {message.role === 'assistant'
                    ? <Bot size={18} />
                    : <User size={18} />}
                </div>

                <div className="chat-message-content">
                  <strong>
                    {message.role === 'assistant'
                      ? 'DocuMind AI'
                      : 'You'}
                  </strong>

                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="chat-message assistant">
                <div className="chat-message-avatar">
                  <Bot size={18} />
                </div>

                <div className="chat-message-content">
                  <strong>DocuMind AI</strong>

                  <p className="chat-typing">
                    <LoaderCircle size={16} className="spin" />
                    Reading your document and preparing an answer...
                  </p>
                </div>
              </div>
            )}

            {!loading && documents.length === 0 && (
              <p className="chat-disclaimer">
                Upload a document in My Documents before starting a conversation.
              </p>
            )}

          </div>

          <div className="chat-suggestions">
            {suggestions.map(item => (
              <button
                key={item}
                onClick={() => sendMessage(item)}
                disabled={!selectedDocumentId || sending}
              >
                <Sparkles size={13} /> {item}
              </button>
            ))}
          </div>

          <form
            className="chat-input-area"
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              id="assistant-question"
              name="question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={
                selectedDocumentId
                  ? 'Ask something about your document...'
                  : 'Upload and select a document first...'
              }
              disabled={!selectedDocumentId || sending}
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={!question.trim() || !selectedDocumentId || sending}
            >
              {sending
                ? <LoaderCircle size={19} className="spin" />
                : <Send size={19} />}
            </button>
          </form>

          <p className="chat-disclaimer">
            AI responses are generated using Gemini and your selected document.
          </p>

        </section>
      </div>
    </div>
  );
}

export default AIAssistant;
