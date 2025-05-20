export type IL0Proof = {
  id: string;
  signature: string;
}

export type ISignedL0Value<T> = {
  value: T;
  proofs: IL0Proof[];
}