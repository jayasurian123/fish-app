// StartScreen Component
interface StartScreenProps {
  quizQuestionsLength: number;
  maxQuestionsPerSession: number;
  wrongAnswerIdsLength: number;
  onStartQuiz: (
    questionNum?: number,
    mode?: "all_questions" | "wrong_answers_only",
  ) => void;
  onClearWrongAnswers: () => void;
  jumpInput: string;
  setJumpInput: (value: string) => void;
  jumpError: string | null;
}

const StartScreen: React.FC<StartScreenProps> = ({
  quizQuestionsLength,
  maxQuestionsPerSession,
  wrongAnswerIdsLength,
  onStartQuiz,
  onClearWrongAnswers,
  jumpInput,
  setJumpInput,
  jumpError,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-fade-in-down">
          Sie ein Mukkuvan!
        </h2>
        <p className="text-xl text-gray-700 mb-8 animate-fade-in">
          There are {quizQuestionsLength} questions in total. Each session will
          have a maximum of {maxQuestionsPerSession} questions.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => onStartQuiz(1, "all_questions")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full"
          >
            Start Quiz from Beginning
          </button>

          {wrongAnswerIdsLength > 0 && (
            <button
              onClick={() => onStartQuiz(1, "wrong_answers_only")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 w-full"
            >
              Review {wrongAnswerIdsLength} Wrong Answer
              {wrongAnswerIdsLength !== 1 ? "s" : ""}
            </button>
          )}

          <div className="w-full mt-4 border-t pt-4 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Or Jump to a Specific Question:
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
                onClick={() => onStartQuiz(undefined, "all_questions")}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Go
              </button>
            </div>
            {jumpError && (
              <p className="text-red-500 text-sm mt-2">{jumpError}</p>
            )}
          </div>

          {wrongAnswerIdsLength > 0 && (
            <button
              onClick={onClearWrongAnswers}
              className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Clear All Wrong Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
