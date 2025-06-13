export type TQuestion = {
  id: number;
  question: string;
  option1: string; // This is now implicitly the correct answer
  option2: string;
  option3: string;
};

// Interface to store user's answer for a question
export type TUserAnswer = {
  questionId: number;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
};
