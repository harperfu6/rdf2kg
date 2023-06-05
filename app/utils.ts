import { DataObject } from "./components/MyGraph2D";

export const removeDuplicateDataObject = (
  dataObject: DataObject[]
): DataObject[] => {

  // 同じIDのオブジェクトを削除
  return dataObject.filter(
    (object, index) =>
      dataObject.findIndex((obj) => obj.id === object.id) === index
  );
};

export const removeDuplicateText = (textList: string[]): string[] => {
  return textList.filter((text, index) => textList.indexOf(text) === index);
};
