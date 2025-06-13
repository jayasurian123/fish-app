import { TQuestion } from "./types";

type QuizControlsProps = {
  onNextQuestion: () => void;
  selectedOptionText: string | null;
  currentQuestion: TQuestion | undefined;
  userAnswersLength: number;
  maxQuestionsPerSession: number;
  questionsForSessionLength: number;
  currentQuestionIndex: number; // Added to handle indexing correctly
  showJumpSection: boolean;
  setShowJumpSection: (show: boolean) => void;
  jumpInput: string;
  setJumpInput: (value: string) => void;
  jumpError: string | null;
  onJumpToQuestion: (
    questionNum?: number,
    mode?: "all_questions" | "wrong_answers_only",
  ) => void;
  quizQuestionsLength: number;
  quizMode: "all_questions" | "wrong_answers_only";
};

const QuizControls: React.FC<QuizControlsProps> = ({
  onNextQuestion,
  selectedOptionText,
  currentQuestion,
  userAnswersLength,
  maxQuestionsPerSession,
  questionsForSessionLength,
  currentQuestionIndex,
  showJumpSection,
  setShowJumpSection,
  jumpInput,
  setJumpInput,
  jumpError,
  onJumpToQuestion,
  quizQuestionsLength,
  quizMode,
}) => {
  const isLastQuestionInSession =
    currentQuestionIndex === questionsForSessionLength - 1;
  const hasReachedMaxQuestions = userAnswersLength === maxQuestionsPerSession;

  return (
    <>
      <div className="text-center mt-8">
        <button
          onClick={onNextQuestion}
          disabled={selectedOptionText === null || !currentQuestion}
          className={`
            py-3 px-8 rounded-xl font-bold text-xl shadow-lg
            transform hover:scale-105 transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-blue-300
            ${selectedOptionText === null || !currentQuestion ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
          `}
        >
          {isLastQuestionInSession || hasReachedMaxQuestions
            ? "Finish Quiz"
            : "Next Question"}
        </button>
      </div>

      {showJumpSection && (
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Jump to Question
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="number"
              min="1"
              max={quizQuestionsLength}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={`Enter # (1 - ${quizQuestionsLength})`}
              className="p-3 border border-gray-300 rounded-lg text-lg text-center w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => onJumpToQuestion(undefined, quizMode)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Go
            </button>
          </div>
          {jumpError && (
            <p className="text-red-500 text-sm mt-2">{jumpError}</p>
          )}
        </div>
      )}

      <button
        onClick={() => setShowJumpSection(!showJumpSection)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50"
        title={showJumpSection ? "Hide Jump Controls" : "Show Jump Controls"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </>
  );
};

export default QuizControls;
