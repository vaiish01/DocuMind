
# DocuMind 📚

### AI-Powered Document Intelligence & Study Assistant

DocuMind is an AI-powered document intelligence and study assistant that helps users understand and learn from their documents more efficiently. It allows users to upload documents, interact with their content through an AI assistant, generate summaries, create flashcards, and test their knowledge with interactive quizzes.

Built with React, Spring Boot, Google Gemini AI, and PostgreSQL, DocuMind transforms lengthy study materials into useful and easy-to-understand learning resources.

---

## ✨ Features

### 📄 Document Management
- Upload PDF, DOCX, and TXT documents.
- View uploaded documents in one place.
- Search and filter documents.
- Preview extracted document content.
- Delete documents when no longer needed.

### 🤖 AI Assistant
- Ask questions about uploaded documents.
- Get AI-generated answers based on document content.
- Continue conversations with the AI assistant.
- Save and revisit previous conversations.

### 📖 AI Study Tools
- Generate summaries from uploaded documents.
- Create AI-powered flashcards.
- Generate multiple-choice quizzes.
- Attempt quizzes and view scores.
- Review previously generated study activities.

### 📊 Dashboard
- View an overview of uploaded documents.
- Access AI conversations and study activities.
- Navigate quickly between different sections.



---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| Java 17 | Backend programming language |
| Spring Boot | Backend framework and REST APIs |
| Spring AI | AI integration |
| Google Gemini | AI-powered responses and study content |
| PostgreSQL | Database |
| Spring Data JPA | Database operations |
| Apache Tika | Document text extraction |
| Maven | Backend dependency management |
| CSS | Styling and responsive UI |

---



## 🚀 Getting Started

Follow these steps to run DocuMind locally.

### Prerequisites

Make sure you have installed:

- Java 17 or later
- Node.js and npm
- PostgreSQL
- Git
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd DocuMind
```

### 2. Database Setup

Open PostgreSQL and create a database:

```sql
CREATE DATABASE documind_db;
```

Update the database credentials in the backend environment.

### 3. Backend Setup

Navigate to the backend folder:

```bash
cd backend/documind-backend
```

Set the required environment variables in PowerShell:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
```

Run the Spring Boot application:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

### 4. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

---

## 🔗 API Endpoints

### Document APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload a document |
| GET | `/api/documents` | Retrieve all documents |
| GET | `/api/documents/{id}` | Retrieve a document |
| DELETE | `/api/documents/{id}` | Delete a document |

### AI APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Chat with a document |
| POST | `/api/ai/summary` | Generate a summary |
| POST | `/api/ai/flashcards` | Generate flashcards |
| POST | `/api/ai/quiz` | Generate a quiz |
| GET | `/api/ai/conversations` | Retrieve saved conversations |
| GET | `/api/ai/conversations/{conversationId}/messages` | Retrieve conversation messages |

### Study Session APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/study-sessions` | Save a study activity |
| GET | `/api/study-sessions` | Retrieve study history |
| GET | `/api/study-sessions/{id}` | Retrieve a saved activity |

### Dashboard API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Retrieve dashboard statistics |

---

## 🔐 Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `DB_PASSWORD` | PostgreSQL database password |

**Important:** Never upload your actual API key or database password to GitHub.

---

## ⚠️ Current Limitations

- Scanned PDFs requiring OCR are not supported.
- The maximum document upload size is 10 MB.
- Original uploaded files are not permanently stored; extracted text and document metadata are stored in PostgreSQL.

---

## 🎯 Project Objective

The goal of DocuMind is to make document-based learning easier by combining document management with AI-powered assistance and interactive study tools.

Instead of manually reading lengthy documents and preparing notes, users can use DocuMind to extract key information, understand concepts, revise important topics, and evaluate their knowledge.

---

## 👩‍💻 Author

**Vaishnavi Patil**

Built as a Java Full Stack and AI-integrated project.
