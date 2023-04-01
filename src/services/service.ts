import { GentlemanState, IndexState, SourceOfTruthInitiate } from "../models";

export const createStore = (SourceOfTruth: SourceOfTruthInitiate<IndexState>[]) => {
  return new GentlemanState<IndexState>(SourceOfTruth);
};
