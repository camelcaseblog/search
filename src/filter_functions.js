import { bigram, trigram } from 'n-gram';
import { compareTwoStrings as diceCompare } from 'string-similarity';
import levenshtein from 'fast-levenshtein';
import _ from 'lodash';

import values from './values';

export const startsWithFilter = inputValue =>
  values.filter(v => v.startsWith(inputValue));
export const includesFilter = inputValue =>
  values.filter(v => v.toLocaleLowerCase().includes(inputValue));
const similarityFilter = compareTwoStrings => inputValue => {
  let options = values.map(v => ({
    value: v,
    dist: compareTwoStrings(v.toLocaleLowerCase(), inputValue)
  }));
  options = options = _.sortBy(options, ['dist']);
  return options;
};
export const levenshteinFilter = similarityFilter(
  (a, b) => levenshtein.get(a, b, { useCollator: true }) / Math.max(a, b)
);
export const trigramFilter = similarityFilter((a, b) => {
  const aGrams = [...a.split(''), ...bigram(a), ...trigram(a)];
  const bGrams = [...b.split(''), ...bigram(b), ...trigram(b)];
  const bGramsSet = new Set(bGrams);
  const intersect = aGrams.filter(x => bGramsSet.has(x));
  return 1 - intersect.length / Math.max(aGrams.length, bGrams.length);
});
export const diceFilter = similarityFilter((a, b) => 1 - diceCompare(a, b));
