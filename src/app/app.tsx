import React, { useState, useEffect, useMemo, useCallback } from "react";
import StartScreen from "./StartScreen";
import ResultScreen from "./ResultScreen";
import { TUserAnswer } from "./types";
import QuestionScreen from "./QuestionScreen";
import { quizQuestions } from "./questions";
import { shuffleArray } from "./utils";
import QuizControls from "./QuizControls";

const MAX_QUESTIONS_PER_SESSION = 20;
const LOCAL_STORAGE_KEY = "quizWrongAnswerIds"; // Key for localStorage

// Main App Component
const App: React.FC = () => {
  const [quizStartIndex, setQuizStartIndex] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionText, setSelectedOptionText] = useState<string | null>(
    null,
  );
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [jumpQuestionInput, setJumpQuestionInput] = useState<string>("");
  const [jumpError, setJumpError] = useState<string | null>(null);
  const [showJumpSection, setShowJumpSection] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<TUserAnswer[]>([]);
  const [quizMode, setQuizMode] = useState<
    "all_questions" | "wrong_answers_only"
  >("all_questions");

  // Local storage specific states
  const [wrongAnswerIds, setWrongAnswerIds] = useState<number[]>([]);
  const [loadingWrongAnswers, setLoadingWrongAnswers] = useState<boolean>(true);
  const [answerFeedbackMessage, setAnswerFeedbackMessage] = useState<
    string | null
  >(null);

  // Load wrong answers from localStorage on component mount
  useEffect(() => {
    try {
      const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        if (Array.isArray(parsedIds)) {
          setWrongAnswerIds(parsedIds);
        }
      }
    } catch (error) {
      console.error("Error loading wrong answers from local storage:", error);
      setWrongAnswerIds([]);
    } finally {
      setLoadingWrongAnswers(false);
    }
  }, []);

  // Function to save wrong answer IDs to localStorage
  const saveWrongAnswerIds = useCallback((ids: number[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Error saving wrong answers to local storage:", error);
    }
  }, []);

  // Derived state for questions to be presented in the current quiz session
  const questionsForSession = (() => {
    if (quizMode === "wrong_answers_only") {
      const filteredQuestions = quizQuestions.filter((q) =>
        wrongAnswerIds.includes(q.id),
      );
      return filteredQuestions.length > 0 ? filteredQuestions : [];
    }
    // For 'all_questions' mode, get the next 15 questions sequentially.
    const startIndex = quizStartIndex;
    const endIndex = Math.min(
      startIndex + MAX_QUESTIONS_PER_SESSION,
      quizQuestions.length,
    );
    const sessionQuestions = quizQuestions.slice(startIndex, endIndex);
    return sessionQuestions;
  })();

  const currentQuestion = questionsForSession[currentQuestionIndex];

  // Memoized shuffled options for the current question
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
    ];
    return shuffleArray(options);
  }, [currentQuestion]);

  // Function to handle option selection
  const handleOptionSelect = (optionText: string) => {
    if (selectedOptionText === null) {
      setSelectedOptionText(optionText); // Set the selected option immediately for styling

      const isCorrect = optionText === currentQuestion.option1;

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        if (wrongAnswerIds.includes(currentQuestion.id)) {
          const updatedWrongIds = wrongAnswerIds.filter(
            (id) => id !== currentQuestion.id,
          );
          setWrongAnswerIds(updatedWrongIds);
          saveWrongAnswerIds(updatedWrongIds);
        }
      } else {
        if (!wrongAnswerIds.includes(currentQuestion.id)) {
          const updatedWrongIds = [...wrongAnswerIds, currentQuestion.id];
          setWrongAnswerIds(updatedWrongIds);
          saveWrongAnswerIds(updatedWrongIds);
        }
      }

      setUserAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          questionId: currentQuestion.id,
          questionText: currentQuestion.question,
          selectedOption: optionText,
          correctOption: currentQuestion.option1,
          isCorrect: isCorrect,
        },
      ]);
    }
  };

  // Function to determine the button styling based on selection and correctness
  const getOptionButtonClasses = (optionText: string) => {
    let classes =
      "p-4 m-2 rounded-lg text-lg w-full md:w-3/4 lg:w-2/3 transition-all duration-300 ";
    if (selectedOptionText !== null) {
      if (optionText === currentQuestion.option1) {
        classes += "bg-green-500 text-white shadow-md ";
      } else if (
        optionText === selectedOptionText &&
        optionText !== currentQuestion.option1
      ) {
        classes += "bg-red-500 text-white shadow-md ";
      } else {
        classes += "bg-gray-200 text-gray-700 opacity-60 ";
      }
    } else {
      classes +=
        "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ";
    }
    return classes;
  };

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    if (selectedOptionText === null) {
      setAnswerFeedbackMessage("Please select an answer before proceeding.");
      return;
    }

    setSelectedOptionText(null);
    setJumpError(null);
    setShowJumpSection(false);
    setAnswerFeedbackMessage(null); // Clear feedback message for next question

    if (
      currentQuestionIndex < questionsForSession.length - 1 &&
      userAnswers.length < MAX_QUESTIONS_PER_SESSION
    ) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  // Function to handle jumping to a specific question (from quiz or start screen)
  const handleJumpToQuestion = (
    questionNum?: number,
    mode: "all_questions" | "wrong_answers_only" = "all_questions",
  ) => {
    const targetQuestionNumber = questionNum || parseInt(jumpQuestionInput, 10);

    const questionsToConsider =
      mode === "wrong_answers_only"
        ? quizQuestions.filter((q) => wrongAnswerIds.includes(q.id))
        : quizQuestions;

    if (
      isNaN(targetQuestionNumber) ||
      targetQuestionNumber < 1 ||
      targetQuestionNumber > questionsToConsider.length
    ) {
      setJumpError(
        `Please enter a valid question number between 1 and ${questionsToConsider.length} for the selected mode.`,
      );
      return;
    }

    setQuizMode(mode);
    // When jumping in 'all_questions' mode, currentQuestionIndex should align with the global index
    // so the slicing in useMemo starts correctly.
    // setCurrentQuestionIndex(
    //   mode === "all_questions" ? targetQuestionNumber - 1 : 0,
    // );
    setQuizStartIndex(mode === "all_questions" ? targetQuestionNumber - 1 : 0);
    setSelectedOptionText(null);
    setJumpError(null);
    setJumpQuestionInput("");
    setShowJumpSection(false);
    setQuizStarted(true);
    setUserAnswers([]);
    setScore(0);
    setAnswerFeedbackMessage(null);
  };

  // Function to restart the quiz and go to start screen
  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedOptionText(null);
    setScore(0);
    setShowResult(false);
    setJumpQuestionInput("");
    setJumpError(null);
    setShowJumpSection(false);
    setUserAnswers([]);
    setQuizMode("all_questions");
    setAnswerFeedbackMessage(null);
  };

  // Function to clear all wrong answers from localStorage
  const handleClearWrongAnswers = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all recorded wrong answers? This cannot be undone.",
      )
    ) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setWrongAnswerIds([]);
    }
  };

  // Show loading state while wrong answers are being loaded from localStorage
  if (loadingWrongAnswers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 font-sans text-white text-2xl">
        Loading Quiz Data...
      </div>
    );
  }

  // --- Render different screens based on quiz state ---
  if (!quizStarted) {
    return (
      <StartScreen
        quizQuestionsLength={quizQuestions.length}
        maxQuestionsPerSession={MAX_QUESTIONS_PER_SESSION}
        wrongAnswerIdsLength={wrongAnswerIds.length}
        onStartQuiz={handleJumpToQuestion} // Renamed for clarity, but same handler
        onClearWrongAnswers={handleClearWrongAnswers}
        jumpInput={jumpQuestionInput}
        setJumpInput={setJumpQuestionInput}
        jumpError={jumpError}
      />
    );
  }

  if (showResult) {
    return (
      <ResultScreen
        score={score}
        userAnswers={userAnswers}
        onRestartQuiz={handleRestartQuiz}
        quizQuestionsLength={quizQuestions.length}
      />
    );
  }

  // Fallback if currentQuestion is unexpectedly undefined, though it should be handled by logic
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 font-sans text-white text-2xl">
        No more questions available. Please restart the quiz!
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 font-sans relative">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl transform hover:scale-[1.01] transition-transform duration-300">
        <div className="text-center mb-6">
          <p className="text-xl font-semibold text-gray-600">
            Question {currentQuestionIndex + 1} of {questionsForSession.length}
            {quizMode === "wrong_answers_only" && (
              <span className="text-orange-500"> (Review Mode)</span>
            )}
          </p>
          <p className="text-lg text-gray-500">Current Score: {score}</p>
        </div>

        <QuestionScreen
          currentQuestion={currentQuestion}
          shuffledOptions={shuffledOptions} // Now passed as a pre-computed value
          selectedOptionText={selectedOptionText}
          onOptionSelect={handleOptionSelect}
          answerFeedbackMessage={answerFeedbackMessage}
          getOptionButtonClasses={getOptionButtonClasses}
        />

        <QuizControls
          onNextQuestion={handleNextQuestion}
          selectedOptionText={selectedOptionText}
          currentQuestion={currentQuestion}
          userAnswersLength={userAnswers.length}
          maxQuestionsPerSession={MAX_QUESTIONS_PER_SESSION}
          questionsForSessionLength={questionsForSession.length}
          currentQuestionIndex={currentQuestionIndex}
          showJumpSection={showJumpSection}
          setShowJumpSection={setShowJumpSection}
          jumpInput={jumpQuestionInput}
          setJumpInput={setJumpQuestionInput}
          jumpError={jumpError}
          onJumpToQuestion={handleJumpToQuestion}
          quizQuestionsLength={quizQuestions.length}
          quizMode={quizMode}
        />
      </div>
    </div>
  );
};

export default App;
