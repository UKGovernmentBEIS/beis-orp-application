import { topics } from '../../document/utils/topics';
import * as R from 'ramda';
import { topicsDisplayMap } from '../../document/utils/topics-display-mapping';

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

export const getTopicPathFromLeaf = (leaf: string): string[] => {
  const exceptions = {
    '/money/personal-tax/inheritance-tax/reliefs':
      '/money/personal-tax/personal-tax-inheritance-tax/reliefs',
    '/money/personal-tax/inheritance-tax/paying-hmrc':
      '/money/personal-tax/personal-tax-inheritance-tax/paying-hmrc',
  };
  const m = leaf.split('/').filter((text) => text);
  return m.map((topicKey, index) => {
    const keysUpToNow = m.slice(0, index + 1);
    const key = `/${keysUpToNow.join('/')}`;
    return topicsDisplayMap[exceptions[key] ?? key];
  });
};
