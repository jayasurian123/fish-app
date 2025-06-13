// ResultScreen Component
interface ResultScreenProps {
  score: number;
  userAnswers: TUserAnswer[];
  onRestartQuiz: () => void;
  quizQuestionsLength: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  userAnswers,
  onRestartQuiz,
}) => {
  const incorrectAnswers = userAnswers.filter((answer) => !answer.isCorrect);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl text-center transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-fade-in-down">
          Quiz Completed!
        </h2>
        <p className="text-2xl text-gray-700 mb-8 animate-fade-in">
          You scored{" "}
          <span className="font-extrabold text-purple-600">{score}</span> out of{" "}
          <span className="font-extrabold text-blue-500">
            {userAnswers.length}
          </span>{" "}
          questions answered!
        </p>

        {incorrectAnswers.length > 0 && (
          <div className="text-left mt-8 p-4 bg-red-50 border border-red-200 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-red-700 mb-4">
              Questions You Got Wrong:
            </h3>
            {incorrectAnswers.map((answer) => (
              <div
                key={answer.questionId}
                className="mb-4 pb-4 border-b border-red-100 last:border-b-0"
              >
                <p className="font-semibold text-lg text-gray-800">
                  Question {answer.questionId}: {answer.questionText}
                </p>
                <p className="text-md text-red-600 mt-1">
                  Your Answer:{" "}
                  <span className="font-medium">{answer.selectedOption}</span>
                </p>
                <p className="text-md text-green-600">
                  Correct Answer:{" "}
                  <span className="font-medium">{answer.correctOption}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onRestartQuiz}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Start New Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
