import { TQuestion } from "./types";

export const shuffleArray = <T extends TQuestion | string>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex;
  const newArray = [...array]; // Create a shallow copy

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
};
