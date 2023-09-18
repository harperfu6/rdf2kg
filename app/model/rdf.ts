export type termValueType = {
  typeType: string;
  value: string;
};

export type rawResponseType = {
  s: termValueType;
  p: termValueType;
  o: termValueType;
};

export type Triple = {
  s: string;
  p: string;
  o: string;
};
