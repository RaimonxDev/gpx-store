import { StateObject } from "./state-object";

export type SourceOfTruth<T> = Map<keyof T, StateObject<[T]>>;

export interface SourceOfTruthInitiate<T> {
  key: keyof T;
  state: T[keyof T];
}

export interface IndexState {
  user: USER;
  company: COMPANY;
  settings: SETTINGS;
}

export interface USER {
  id: string;
  name: string;
  age: number;
}

export interface COMPANY {
  id: string;
  name: string;
  address: string;
}

export interface SETTINGS {
  id: string;
  name: string;
}