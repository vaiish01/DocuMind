
const API_URL = '/api/documents';

// Get all uploaded documents
export async function getDocuments() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Unable to load documents.');
  }

  return response.json();
}

// Upload a document
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Document upload failed.');
  }

  return data;
}

// Delete a document
export async function deleteDocument(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Unable to delete document.');
  }
}

// Get one document
export async function getDocument(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Unable to load document.');
  }

  return response.json();
}

// Generate an AI summary
export async function generateDocumentSummary(documentId) {
  const response = await fetch('/api/ai/summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to generate summary.');
  }

  return data.answer;
}

// Generate AI flashcards
export async function generateDocumentFlashcards(documentId) {
  const response = await fetch('/api/ai/flashcards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to generate flashcards.');
  }

  return data.flashcards;
}

// Generate an AI quiz
export async function generateDocumentQuiz(documentId) {
  const response = await fetch('/api/ai/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to generate quiz.');
  }

  return data.questions;
}

// Send a chat message and return conversation ID + AI answer
export async function sendChatMessage(
  documentId,
  question,
  conversationId = null
) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId,
      conversationId,
      question,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to get an AI response.');
  }

  return data;
}

// Get all saved conversations
export async function getConversations() {
  const response = await fetch('/api/ai/conversations');

  if (!response.ok) {
    throw new Error('Unable to load conversation history.');
  }

  return response.json();
}

// Get messages from one saved conversation
export async function getConversationMessages(conversationId) {
  const response = await fetch(
    `/api/ai/conversations/${conversationId}/messages`
  );

  if (!response.ok) {
    throw new Error('Unable to load conversation messages.');
  }

  return response.json();
}

// Get dashboard statistics
export async function getDashboardStats() {
  const response = await fetch('/api/dashboard/stats');

  if (!response.ok) {
    throw new Error('Unable to load dashboard statistics.');
  }

  return response.json();
}

export const saveStudySession = async (documentId, activityType, content) => {
  const response = await fetch('/api/study-sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documentId,
      activityType,
      content: JSON.stringify(content)
    })
  });

  if (!response.ok) {
    throw new Error('Unable to save study activity.');
  }

  return response.json();
};

export const getStudySessions = async () => {
  const response = await fetch('/api/study-sessions');

  if (!response.ok) {
    throw new Error('Unable to load study history.');
  }

  return response.json();
};

export const getStudySession = async (sessionId) => {
  const response = await fetch(`/api/study-sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error('Unable to open saved study activity.');
  }

  return response.json();
};
