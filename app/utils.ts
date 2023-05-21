export const removeDuplicateText = (textList: string[]): string[] => {
  return textList.filter((text, index) => textList.indexOf(text) === index);
};
