export type termValueType = {
  typeType: string;
  value: string;
};

export type rawResponseType = {
  p: termValueType;
  o: termValueType;
};

export type tripleType = {
  s: string;
  p: string;
  o: string;
};
