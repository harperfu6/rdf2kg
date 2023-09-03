import { DataObject } from "./components/MyGraph2D";
import { Triple } from "./model/rdf";

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

export const filterInTriple = (
  triples: Triple[],
  filterRegexs: string[]
): Triple[] => {
  return triples.filter((triple) => {
    return filterRegexs.some((regex) => {
      const pattern = new RegExp(regex);
      return (
        pattern.test(triple.s) ||
        pattern.test(triple.p) ||
        pattern.test(triple.o)
      );
    });
  });
};

export const filterOutTriple = (
  triples: Triple[],
  filterRegexs: string[]
): Triple[] => {
  return triples.filter((triple) => {
    return filterRegexs.every((regex) => {
      const pattern = new RegExp(regex);
      return (
        !pattern.test(triple.s) &&
        !pattern.test(triple.p) &&
        !pattern.test(triple.o)
      );
    });
  });
};
