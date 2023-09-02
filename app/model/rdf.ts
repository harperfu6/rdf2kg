export type termValueType = {
  typeType: string;
  value: string;
};

export type rawResponseType = {
  p: termValueType;
  o: termValueType;
};

export type Triple = {
  s: string;
  p: string;
  o: string;
};
