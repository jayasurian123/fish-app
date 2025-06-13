import { TQuestion } from "./types";

type QuestionScreenProps = {
  currentQuestion: TQuestion | undefined;
  shuffledOptions: string[];
  selectedOptionText: string | null;
  onOptionSelect: (optionText: string) => void;
  answerFeedbackMessage: string | null;
  getOptionButtonClasses: (optionText: string) => string;
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentQuestion,
  shuffledOptions,
  selectedOptionText,
  onOptionSelect,
  answerFeedbackMessage,
  getOptionButtonClasses,
}) => {
  if (!currentQuestion) {
    return (
      <p className="text-gray-600">
        No questions available for this session. Try clearing wrong answers or
        starting from beginning.
      </p>
    );
  }

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
        {currentQuestion.question}
      </h1>

      <div className="flex flex-col items-center mb-8">
        {shuffledOptions.map((optionText, index) => (
          <button
            key={`${currentQuestion.id}-${index}`}
            onClick={() => onOptionSelect(optionText)}
            className={getOptionButtonClasses(optionText)}
            disabled={selectedOptionText !== null}
          >
            {optionText}
          </button>
        ))}
      </div>

      {answerFeedbackMessage && (
        <p
          className={`text-center mb-4 font-semibold ${selectedOptionText === currentQuestion.option1 ? "text-green-600" : "text-red-600"}`}
        >
          {answerFeedbackMessage}
        </p>
      )}
    </>
  );
};

export default QuestionScreen;
