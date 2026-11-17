import  '../styles/AIAssistant.css';
import { useState } from 'react';

import {
  Bot, Send, User, Sparkles,
  FileText, Plus, MessageSquare,
  Trash2
} from 'lucide-react';

function AIAssistant() {
  const [document, setDocument] = useState('Java Programming Notes.pdf');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am DocuMind AI. Select a document and ask me anything about its content.'
    }
  ]);

  const suggestions = [
    'Summarize this document',
    'Explain the important concepts',
    'Generate interview questions',
    'Explain in simple words'
  ];

  const sendMessage = (customQuestion) => {
    const text = (customQuestion || question).trim();
    if (!text) return;

    setMessages(previous => [
      ...previous,
      { role: 'user', text }
    ]);

    setQuestion('');

    setTimeout(() => {
      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          text: `This is a preview response for "${text}". Once Gemini and document processing are connected, DocuMind will analyze "${document}" and provide an answer based on its actual content.`
        }
      ]);
    }, 500);
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
          <button className="new-chat-btn"
            onClick={() => setMessages([
              { role: 'assistant', text: 'Hello! What would you like to learn today?' }
            ])}>
            <Plus size={17} /> New conversation
          </button>

          <p className="chat-sidebar-label">CURRENT DOCUMENT</p>

          <div className="selected-document">
            <FileText size={20} />
            <div>
              <strong>{document}</strong>
              <span>Selected source</span>
            </div>
          </div>

          <label className="chat-sidebar-label" htmlFor="document-select">
            CHANGE DOCUMENT
          </label>

          <select
            id="document-select"
            className="document-select"
            value={document}
            onChange={e => setDocument(e.target.value)}
          >
            <option>Java Programming Notes.pdf</option>
            <option>Database Management.docx</option>
            <option>Machine Learning Basics.pdf</option>
            <option>Web Development Notes.txt</option>
          </select>

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
              <div className={`chat-message ${message.role}`} key={index}>
                <div className="chat-message-avatar">
                  {message.role === 'assistant'
                    ? <Bot size={18} />
                    : <User size={18} />}
                </div>

                <div className="chat-message-content">
                  <strong>
                    {message.role === 'assistant' ? 'DocuMind AI' : 'You'}
                  </strong>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-suggestions">
            {suggestions.map(item => (
              <button key={item} onClick={() => sendMessage(item)}>
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
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask something about your document..."
            />

            <button type="submit" aria-label="Send message">
              <Send size={19} />
            </button>
          </form>

          <p className="chat-disclaimer">
            Demo responses only. Connect AI to get document-based answers.
          </p>

        </section>
      </div>

    </div>
  );
}

export default AIAssistant;
