import { topics } from '../../document/utils/topics';
import * as R from 'ramda';

export const getTopicsForView = (
  selectedTopics: string | string[],
): { selectedTopics: string[]; topicsForSelections: string[][] } => {
  const selectedTopicsArray: string[] =
    typeof selectedTopics === 'string'
      ? JSON.parse(selectedTopics)
      : selectedTopics;

  const topicsForSelections = selectedTopicsArray
    .map<string[]>((topicId, index) => {
      const idPath = selectedTopicsArray.slice(0, index + 1);
      return R.keys(R.path(idPath, topics));
    })
    .filter((list) => list.length);

  return { selectedTopics: selectedTopicsArray, topicsForSelections };
};
