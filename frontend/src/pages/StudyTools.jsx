
import '../styles/StudyTools.css';
import { useEffect, useState } from 'react';

import {
  BookOpen,
  Brain,
  Layers,
  ArrowRight,
  FileText,
  Sparkles,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Trophy,
  History,
  RefreshCw,
  Clock
} from 'lucide-react';

import {
  getDocuments,
  generateDocumentSummary,
  generateDocumentFlashcards,
  generateDocumentQuiz,
  saveStudySession,
  getStudySessions,
  getStudySession
} from '../services/documentService';

function StudyTools() {
  const [activeTool, setActiveTool] = useState('Summary');

  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  // Flashcard states
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Study history states
  const [studyHistory, setStudyHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [openingSessionId, setOpeningSessionId] = useState(null);
  const [historyError, setHistoryError] = useState('');

  // Quiz states
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Load documents
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getDocuments();
      setDocuments(data);

      if (data.length > 0) {
        setSelectedDocumentId(data[0].id);
      }
    } catch (err) {
      setError('Unable to load your documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load saved study history
  const loadStudyHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError('');

      const data = await getStudySessions();
      setStudyHistory(data);
    } catch (err) {
      setHistoryError(err.message || 'Unable to load study history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Save generated study activity
  const saveActivity = async (activityType, content) => {
    if (!selectedDocumentId) return;

    try {
      setSavingActivity(true);

      await saveStudySession(
        selectedDocumentId,
        activityType,
        content
      );

      await loadStudyHistory();
    } catch (err) {
      setError(
        err.message || 'Your result was generated but could not be saved.'
      );
    } finally {
      setSavingActivity(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadStudyHistory();
  }, []);

  const tools = [
    {
      name: 'Summary',
      icon: BookOpen,
      description: 'Understand long documents quickly.'
    },
    {
      name: 'Flashcards',
      icon: Layers,
      description: 'Remember important concepts.'
    },
    {
      name: 'Quiz',
      icon: Brain,
      description: 'Test your understanding.'
    }
  ];

  const selectedDocument = documents.find(
    doc => doc.id === selectedDocumentId
  );

  const documentName = selectedDocument
    ? selectedDocument.originalFilename || selectedDocument.title
    : '';

  const toolInformation = {
    Summary: {
      title: 'Document Summarizer',
      description: 'Generate a clear summary from your uploaded document.',
      icon: BookOpen
    },
    Flashcards: {
      title: 'Smart Flashcards',
      description: 'Create flashcards from important concepts in your document.',
      icon: Layers
    },
    Quiz: {
      title: 'Knowledge Check',
      description: 'Generate questions to test your understanding.',
      icon: Brain
    }
  };

  const currentTool = toolInformation[activeTool];

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleDocumentChange = (e) => {
    setSelectedDocumentId(e.target.value);

    setSummary('');
    setFlashcards([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);

    setQuizQuestions([]);
    resetQuiz();

    setError('');
  };

  // Generate summary
  const handleGenerateSummary = async () => {
    if (!selectedDocumentId) {
      setError('Please select a document first.');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      setSummary('');

      const result = await generateDocumentSummary(selectedDocumentId);

      setSummary(result);
      await saveActivity('SUMMARY', result);
    } catch (err) {
      setError(err.message || 'Unable to generate summary.');
    } finally {
      setGenerating(false);
    }
  };

  // Generate flashcards
  const handleGenerateFlashcards = async () => {
    if (!selectedDocumentId) {
      setError('Please select a document first.');
      return;
    }

    try {
      setGeneratingFlashcards(true);
      setError('');
      setFlashcards([]);
      setCurrentCardIndex(0);
      setShowAnswer(false);

      const result = await generateDocumentFlashcards(selectedDocumentId);

      setFlashcards(result);
      await saveActivity('FLASHCARDS', result);
    } catch (err) {
      setError(err.message || 'Unable to generate flashcards.');
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const currentCard = flashcards[currentCardIndex];

  // Generate quiz
  const handleGenerateQuiz = async () => {
    if (!selectedDocumentId) {
      setError('Please select a document first.');
      return;
    }

    try {
      setGeneratingQuiz(true);
      setError('');
      setQuizQuestions([]);

      const result = await generateDocumentQuiz(selectedDocumentId);

      if (!result || result.length === 0) {
        throw new Error('No quiz questions were generated.');
      }

      setQuizQuestions(result);
      resetQuiz();

      await saveActivity('QUIZ', result);
    } catch (err) {
      setError(err.message || 'Unable to generate quiz.');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  // Submit selected answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    if (selectedOption === currentQuestion.correctOptionIndex) {
      setQuizScore(prev => prev + 1);
    }

    setAnswerSubmitted(true);
  };

  // Move to next question and save completed attempt
  const handleNextQuestion = async () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      const finalScore =
        quizScore +
        (selectedOption === quizQuestions[currentQuestionIndex].correctOptionIndex
          ? 1
          : 0);

      setQuizScore(finalScore);
      setQuizFinished(true);

      await saveActivity('QUIZ_ATTEMPT', {
        questions: quizQuestions,
        score: finalScore,
        totalQuestions: quizQuestions.length
      });

      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setAnswerSubmitted(false);
  };

  // Retake the same quiz
  const handleRetakeQuiz = () => {
    resetQuiz();
  };

  // Open a saved study activity
  const openStudySession = async (sessionId) => {
    try {
      setOpeningSessionId(sessionId);
      setHistoryError('');
      setError('');

      const session = await getStudySession(sessionId);

      let savedContent;

      try {
        savedContent = JSON.parse(session.content);
      } catch {
        savedContent = session.content;
      }

      setSelectedDocumentId(session.documentId);

      setSummary('');
      setFlashcards([]);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setQuizQuestions([]);
      resetQuiz();

      if (session.activityType === 'SUMMARY') {
        setActiveTool('Summary');
        setSummary(savedContent);
      } else if (session.activityType === 'FLASHCARDS') {
        setActiveTool('Flashcards');
        setFlashcards(savedContent);
      } else if (session.activityType === 'QUIZ') {
        setActiveTool('Quiz');
        setQuizQuestions(savedContent);
      } else if (session.activityType === 'QUIZ_ATTEMPT') {
        setActiveTool('Quiz');
        setQuizQuestions(savedContent.questions || []);
        setQuizScore(savedContent.score || 0);
        setQuizFinished(true);
      }
    } catch (err) {
      setHistoryError(err.message || 'Unable to open saved activity.');
    } finally {
      setOpeningSessionId(null);
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const getActivityLabel = (activityType) => {
    const labels = {
      SUMMARY: 'Document Summary',
      FLASHCARDS: 'Flashcards',
      QUIZ: 'Generated Quiz',
      QUIZ_ATTEMPT: 'Quiz Result'
    };

    return labels[activityType] || 'Study Activity';
  };

  const getActivityIcon = (activityType) => {
    if (activityType === 'SUMMARY') return <BookOpen size={18} />;
    if (activityType === 'FLASHCARDS') return <Layers size={18} />;
    if (activityType === 'QUIZ' || activityType === 'QUIZ_ATTEMPT') {
      return <Brain size={18} />;
    }

    return <FileText size={18} />;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    return new Date(dateValue).toLocaleString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-container">

      <div className="page-heading">
        <div>
          <span className="eyebrow">LEARN SMARTER</span>
          <h2>Study Tools</h2>
          <p>
            Turn your documents into an engaging learning experience.
          </p>
        </div>
      </div>

      <div className="study-tool-grid">
        {tools.map(tool => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.name}
              className={`study-tool-card ${
                activeTool === tool.name ? 'selected' : ''
              }`}
              onClick={() => {
                setActiveTool(tool.name);
                setError('');
              }}
            >
              <div className="study-tool-icon">
                <Icon size={23} />
              </div>

              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <ArrowRight size={17} />
            </button>
          );
        })}
      </div>

      <section className="study-workspace">

        <div className="study-workspace-heading">
          <div>
            <span className="eyebrow">YOUR STUDY SPACE</span>
            <h3>{currentTool.title}</h3>
          </div>
        </div>

        {/* STUDY HISTORY */}
        <div className="study-history">

          <div className="study-history-heading">
            <div>
              <span className="eyebrow">YOUR PROGRESS</span>
              <h4>
                <History size={19} />
                Study History
              </h4>
            </div>

            <button
              type="button"
              className="history-refresh-button"
              onClick={loadStudyHistory}
              disabled={historyLoading}
              title="Refresh study history"
            >
              <RefreshCw
                size={16}
                className={historyLoading ? 'spin' : ''}
              />
              Refresh
            </button>
          </div>

          {historyLoading && studyHistory.length === 0 && (
            <p className="history-message">
              Loading your study history...
            </p>
          )}

          {historyError && (
            <p className="history-message history-error">
              {historyError}
            </p>
          )}

          {!historyLoading && !historyError && studyHistory.length === 0 && (
            <p className="history-message">
              Your generated summaries, flashcards and quiz results will
              appear here.
            </p>
          )}

          {studyHistory.length > 0 && (
            <div className="study-history-list">
              {studyHistory.map(session => {
                const historyDocument = documents.find(
                  doc => doc.id === session.documentId
                );

                const historyDocumentName = historyDocument
                  ? historyDocument.originalFilename || historyDocument.title
                  : 'Document';

                return (
                  <div className="study-history-item" key={session.id}>

                    <div className="study-history-icon">
                      {getActivityIcon(session.activityType)}
                    </div>

                    <div className="study-history-details">
                      <strong>
                        {getActivityLabel(session.activityType)}
                      </strong>

                      <span>{historyDocumentName}</span>

                      <small>
                        <Clock size={12} />
                        {formatDate(session.createdAt)}
                      </small>
                    </div>

                    <button
                      type="button"
                      className="history-open-button"
                      onClick={() => openStudySession(session.id)}
                      disabled={openingSessionId === session.id}
                    >
                      {openingSessionId === session.id
                        ? 'Opening...'
                        : 'Open'}
                    </button>

                  </div>
                );
              })}
            </div>
          )}

          {savingActivity && (
            <p className="history-saving-message">
              <LoaderCircle size={14} className="spin" />
              Saving your study activity...
            </p>
          )}

        </div>

        <div className="summary-tool">

          <label htmlFor="study-document-select">
            Select your document
          </label>

          <div className="summary-document">
            <FileText size={22} />

            <div>
              <strong>
                {loading
                  ? 'Loading documents...'
                  : documentName || 'No document selected'}
              </strong>

              <span>
                {selectedDocument
                  ? 'Uploaded document'
                  : 'Your study source'}
              </span>
            </div>
          </div>

          <select
            id="study-document-select"
            className="document-select"
            value={selectedDocumentId}
            onChange={handleDocumentChange}
            disabled={loading || documents.length === 0}
          >
            <option value="">Select a document</option>

            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.originalFilename || doc.title}
              </option>
            ))}
          </select>

          {error && (
            <p className="document-error">
              {error}
            </p>
          )}

          {/* SUMMARY TOOL */}
          {activeTool === 'Summary' && (

            <div className="generated-summary">

              {!summary && !generating && (
                <>
                  <div className="study-empty-icon">
                    <Sparkles size={26} />
                  </div>

                  <h4>Generate your AI summary</h4>

                  <p>
                    {selectedDocument
                      ? 'Get an overview, key points, important terms and conclusion from your document.'
                      : 'Upload a document in My Documents and select it here to get started.'}
                  </p>

                  <button
                    className="primary-button"
                    onClick={handleGenerateSummary}
                    disabled={!selectedDocumentId || loading}
                  >
                    <Sparkles size={17} />
                    Generate Summary
                  </button>
                </>
              )}

              {generating && (
                <div className="summary-loading">
                  <LoaderCircle size={28} className="spin" />

                  <h4>Generating your summary...</h4>

                  <p>
                    Gemini is reading your document and preparing
                    your summary. This may take a few moments.
                  </p>
                </div>
              )}

              {summary && (
                <div className="summary-result">

                  <div className="summary-result-heading">
                    <div>
                      <span className="eyebrow">
                        AI GENERATED
                      </span>

                      <h4>Document Summary</h4>

                      <p>{documentName}</p>
                    </div>

                    <Sparkles size={23} />
                  </div>

                  <div className="summary-content">
                    {summary}
                  </div>

                  <button
                    className="primary-button"
                    onClick={handleGenerateSummary}
                    disabled={generating}
                  >
                    <Sparkles size={17} />
                    Regenerate Summary
                  </button>

                </div>
              )}

            </div>
          )}

          {/* FLASHCARDS TOOL */}
          {activeTool === 'Flashcards' && (

            <div className="generated-summary flashcard-workspace">

              {!generatingFlashcards && flashcards.length === 0 && (
                <>
                  <div className="study-empty-icon">
                    <Layers size={26} />
                  </div>

                  <h4>Create your AI flashcards</h4>

                  <p>
                    Gemini will turn important concepts from your
                    selected document into question-and-answer cards.
                  </p>

                  <button
                    className="primary-button"
                    onClick={handleGenerateFlashcards}
                    disabled={!selectedDocumentId || loading}
                  >
                    <Sparkles size={17} />
                    Generate Flashcards
                  </button>
                </>
              )}

              {generatingFlashcards && (
                <div className="summary-loading">
                  <LoaderCircle size={28} className="spin" />

                  <h4>Creating your flashcards...</h4>

                  <p>
                    Gemini is identifying important concepts
                    and preparing your study cards.
                  </p>
                </div>
              )}

              {flashcards.length > 0 && currentCard && (
                <div className="flashcard-result">

                  <div className="flashcard-top">
                    <div>
                      <span className="eyebrow">
                        AI GENERATED FLASHCARDS
                      </span>

                      <h4>{documentName}</h4>
                    </div>

                    <span className="flashcard-count">
                      {currentCardIndex + 1} / {flashcards.length}
                    </span>
                  </div>

                  <div className="flashcard-progress">
                    <div
                      className="flashcard-progress-fill"
                      style={{
                        width: `${((currentCardIndex + 1) / flashcards.length) * 100}%`
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className={`flashcard ${showAnswer ? 'flipped' : ''}`}
                    onClick={() => setShowAnswer(prev => !prev)}
                  >
                    <span className="flashcard-label">
                      {showAnswer ? 'ANSWER' : 'QUESTION'}
                    </span>

                    <span className="flashcard-text">
                      {showAnswer
                        ? currentCard.answer
                        : currentCard.question}
                    </span>

                    <span className="flashcard-hint">
                      <RotateCcw size={15} />
                      Click to {showAnswer ? 'see question' : 'reveal answer'}
                    </span>
                  </button>

                  <div className="flashcard-navigation">

                    <button
                      type="button"
                      className="flashcard-nav-button"
                      onClick={handlePreviousCard}
                      disabled={currentCardIndex === 0}
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <button
                      type="button"
                      className="flashcard-nav-button"
                      onClick={handleNextCard}
                      disabled={currentCardIndex === flashcards.length - 1}
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>

                  </div>

                  <button
                    type="button"
                    className="flashcard-regenerate"
                    onClick={handleGenerateFlashcards}
                    disabled={generatingFlashcards}
                  >
                    <RotateCcw size={15} />
                    Generate new flashcards
                  </button>

                </div>
              )}

            </div>
          )}

          {/* QUIZ TOOL */}
          {activeTool === 'Quiz' && (

            <div className="generated-summary quiz-tool">

              {/* Initial quiz screen */}
              {quizQuestions.length === 0 && !generatingQuiz && (
                <>
                  <div className="study-empty-icon">
                    <Brain size={26} />
                  </div>

                  <h4>Test your knowledge</h4>

                  <p>
                    Generate a quiz based on your selected document.
                    Answer multiple-choice questions and see your score.
                  </p>

                  <button
                    className="primary-button"
                    onClick={handleGenerateQuiz}
                    disabled={!selectedDocumentId || loading}
                  >
                    <Sparkles size={17} />
                    Generate Quiz
                  </button>
                </>
              )}

              {/* Loading screen */}
              {generatingQuiz && (
                <div className="summary-loading">
                  <LoaderCircle size={28} className="spin" />

                  <h4>Preparing your quiz...</h4>

                  <p>
                    Gemini is creating questions from your document.
                    This may take a few moments.
                  </p>
                </div>
              )}

              {/* Quiz completed screen */}
              {quizQuestions.length > 0 && quizFinished && (
                <div className="quiz-result">
                  <div className="study-empty-icon">
                    <Trophy size={28} />
                  </div>

                  <span className="eyebrow">QUIZ COMPLETED</span>

                  <h4>Your final score</h4>

                  <div className="quiz-final-score">
                    {quizScore} / {quizQuestions.length}
                  </div>

                  <p>
                    {quizScore === quizQuestions.length
                      ? 'Excellent! You answered every question correctly.'
                      : quizScore >= quizQuestions.length / 2
                        ? 'Good effort! Keep practising to improve your score.'
                        : 'Keep learning! Review your document and try again.'}
                  </p>

                  <button
                    className="primary-button"
                    onClick={handleRetakeQuiz}
                  >
                    <RotateCcw size={17} />
                    Retake Quiz
                  </button>

                  <button
                    className="flashcard-regenerate"
                    onClick={handleGenerateQuiz}
                    disabled={generatingQuiz}
                  >
                    <Sparkles size={15} />
                    Generate new questions
                  </button>
                </div>
              )}

              {/* Active quiz screen */}
              {quizQuestions.length > 0 && !quizFinished && currentQuestion && (
                <div className="quiz-question-container">

                  <div className="flashcard-top">
                    <div>
                      <span className="eyebrow">
                        AI GENERATED QUIZ
                      </span>

                      <h4>{documentName}</h4>
                    </div>

                    <span className="flashcard-count">
                      {currentQuestionIndex + 1} / {quizQuestions.length}
                    </span>
                  </div>

                  <div className="quiz-progress">
                    <div
                      className="flashcard-progress-fill"
                      style={{
                        width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`
                      }}
                    />
                  </div>

                  <h4 className="quiz-question">
                    {currentQuestion.question}
                  </h4>

                  <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => {
                      const isCorrect =
                        index === currentQuestion.correctOptionIndex;

                      const isSelected = selectedOption === index;

                      let optionClass = '';

                      if (answerSubmitted && isCorrect) {
                        optionClass = 'correct';
                      } else if (
                        answerSubmitted &&
                        isSelected &&
                        !isCorrect
                      ) {
                        optionClass = 'incorrect';
                      } else if (isSelected) {
                        optionClass = 'selected';
                      }

                      return (
                        <button
                          type="button"
                          key={index}
                          className={`quiz-option ${optionClass}`}
                          onClick={() => {
                            if (!answerSubmitted) {
                              setSelectedOption(index);
                            }
                          }}
                          disabled={answerSubmitted}
                        >
                          <span className="quiz-option-letter">
                            {String.fromCharCode(65 + index)}.
                          </span>

                          <span>{option}</span>

                          {answerSubmitted && isCorrect && (
                            <CheckCircle size={18} />
                          )}

                          {answerSubmitted && isSelected && !isCorrect && (
                            <XCircle size={18} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer feedback */}
                  {answerSubmitted && (
                    <div className={`quiz-feedback ${
                      selectedOption === currentQuestion.correctOptionIndex
                        ? 'correct'
                        : 'incorrect'
                    }`}>
                      <strong>
                        {selectedOption === currentQuestion.correctOptionIndex
                          ? 'Correct answer!'
                          : 'Not quite!'}
                      </strong>

                      <p>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Submit / Next */}
                  {!answerSubmitted ? (
                    <button
                      className="primary-button"
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                    >
                      Submit Answer
                      <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button
                      className="primary-button"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex === quizQuestions.length - 1
                        ? 'View Results'
                        : 'Next Question'}
                      <ArrowRight size={17} />
                    </button>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default StudyTools;
