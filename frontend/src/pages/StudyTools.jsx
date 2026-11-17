import '../styles/StudyTools.css';
import { useState } from 'react';

import {
  BookOpen, Brain, Layers, Sparkles,
  ArrowRight, RotateCw, CheckCircle2
} from 'lucide-react';

const quizQuestions = [
  {
    question: 'Which keyword is used to inherit a class in Java?',
    options: ['implements', 'extends', 'inherits', 'super'],
    answer: 'extends'
  },
  {
    question: 'Which concept allows one interface to have multiple implementations?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Casting'],
    answer: 'Polymorphism'
  },
  {
    question: 'Which keyword creates an object in Java?',
    options: ['class', 'this', 'new', 'static'],
    answer: 'new'
  }
];

const flashcards = [
  {
    front: 'What is OOP?',
    back: 'Object-Oriented Programming is a programming approach based on objects and classes.'
  },
  {
    front: 'What is inheritance?',
    back: 'Inheritance allows one class to acquire properties and methods from another class.'
  },
  {
    front: 'What is encapsulation?',
    back: 'Encapsulation bundles data and methods together and restricts direct access to internal data.'
  }
];

function StudyTools() {
  const [activeTool, setActiveTool] = useState('Summary');
  const [flipped, setFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState('');
  const [generated, setGenerated] = useState(false);

  const currentQuestion = quizQuestions[questionIndex];

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

  const nextCard = () => {
    setCardIndex((cardIndex + 1) % flashcards.length);
    setFlipped(false);
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;

    const updatedScore = score +
      (selectedAnswer === currentQuestion.answer ? 1 : 0);

    setScore(updatedScore);

    if (questionIndex === quizQuestions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer('');
    }
  };

  const resetQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="page-container">

      <div className="page-heading">
        <div>
          <span className="eyebrow">LEARN SMARTER</span>
          <h2>Study Tools</h2>
          <p>Turn your documents into an engaging learning experience.</p>
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
              onClick={() => setActiveTool(tool.name)}
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
            <h3>
              {activeTool === 'Summary' && 'Document Summarizer'}
              {activeTool === 'Flashcards' && 'Smart Flashcards'}
              {activeTool === 'Quiz' && 'Knowledge Check'}
            </h3>
          </div>

          <span className="demo-badge">Sample content</span>
        </div>

        {activeTool === 'Summary' && (
          <div className="summary-tool">
            <div className="summary-document">
              <FileLabel />
              <div>
                <strong>Java Programming Notes.pdf</strong>
                <span>Sample study document</span>
              </div>
            </div>

            <button
              className="page-primary-btn"
              onClick={() => setGenerated(true)}
            >
              <Sparkles size={17} /> Generate Summary
            </button>

            {generated && (
              <div className="generated-summary">
                <h4>Java Programming — Key Concepts</h4>
                <p>
                  Java is an object-oriented, platform-independent
                  programming language. It uses the JVM to execute
                  compiled bytecode.
                </p>
                <ul>
                  <li>OOP concepts: inheritance, polymorphism, encapsulation and abstraction.</li>
                  <li>Classes define the structure of objects.</li>
                  <li>Methods contain reusable blocks of code.</li>
                  <li>Exception handling helps manage runtime errors.</li>
                </ul>
                <p className="demo-explanation">
                  This is sample content, not a summary generated from an uploaded file.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTool === 'Flashcards' && (
          <div className="flashcard-tool">
            <span className="flashcard-count">
              CARD {cardIndex + 1} OF {flashcards.length}
            </span>

            <button
              className={`flashcard ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped(!flipped)}
            >
              <span>{flipped ? 'ANSWER' : 'QUESTION'}</span>
              <h3>
                {flipped
                  ? flashcards[cardIndex].back
                  : flashcards[cardIndex].front}
              </h3>
              <small>Click to flip</small>
            </button>

            <button className="page-primary-btn" onClick={nextCard}>
              <RotateCw size={16} /> Next Card
            </button>
          </div>
        )}

        {activeTool === 'Quiz' && (
          <div className="quiz-tool">
            {!finished ? (
              <>
                <div className="quiz-progress">
                  <span>QUESTION {questionIndex + 1} OF {quizQuestions.length}</span>
                  <span>Score: {score}</span>
                </div>

                <h3>{currentQuestion.question}</h3>

                <div className="quiz-options">
                  {currentQuestion.options.map(option => (
                    <button
                      key={option}
                      className={selectedAnswer === option ? 'chosen' : ''}
                      onClick={() => setSelectedAnswer(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  className="page-primary-btn"
                  disabled={!selectedAnswer}
                  onClick={submitAnswer}
                >
                  {questionIndex === quizQuestions.length - 1
                    ? 'Finish Quiz'
                    : 'Next Question'}
                  <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <div className="quiz-result">
                <CheckCircle2 size={43} />
                <h3>Quiz Completed!</h3>
                <p>You scored {score} out of {quizQuestions.length}.</p>
                <button className="page-primary-btn" onClick={resetQuiz}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

      </section>
    </div>
  );
}

function FileLabel() {
  return (
    <div className="summary-file-icon">
      <BookOpen size={22} />
    </div>
  );
}

export default StudyTools;
