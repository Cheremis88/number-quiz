export type TTask = {
  question: string,
  answer: number
}

export type TAnswer = number;

export type TResult = {
  correctAnswers: TAnswer[],
  userAnswers: TAnswer[],
  difference: TAnswer[],
  color: string[];
}