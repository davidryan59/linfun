// Input a series of times, in strictly increasing order
// Output a series of values, in the same order
// Use linear interpolation between specified linfun points

// By inputting array of times in increasing order,
// evaluation should run much faster than evaluating each time separately.

import isArray from 'isarray';

import isLinfun from './isLinfun';


const minT = -1e300;

const evaluateTsOnArrayOfIncreasingTimes = (linfun, evaluationTimesInput) => {
  // If time array is invalid, return empty array
  if (!isArray(evaluationTimesInput) || evaluationTimesInput.length < 1) return [];
  // If linfun is invalid, return array of zeroes
  if (!isLinfun(linfun)) return evaluationTimesInput.map(() => 0);
  // If linfun does not have at least 2 coords, e.g. at least 1 line segment, return array of constants
  let firstVal = 0;
  const tsLen = linfun.length;
  if (tsLen > 0) firstVal = linfun.first[1];
  const evaluationValues = evaluationTimesInput.map(() => firstVal);
  if (tsLen < 2) return evaluationValues;
  // We have a linfun with length at least 2, i.e. at least one line segment to interpolate.
  // Clean up the input array
  const evaluationTimes = [...evaluationTimesInput];
  let tPrev = minT;
  for (let i = 0; i < evaluationTimes.length; i++) {
    let t = evaluationTimes[i];
    // Make sure t is a number, and no smaller than previous value
    if (!Number.isFinite(t) || t < tPrev) {
      // t is invalid, re-use previous value, overwrite array
      t = tPrev;
      evaluationTimes[i] = t;
    }
    // Store prev value for next round
    tPrev = t;
  }
  // Find first time in array that is after first time from linfun
  const firstTime = linfun.first[0];
  // 'aoit' = array of increasing times
  let aoitIdx = 0;
  const aoitLen = evaluationTimes.length;
  while (evaluationTimes[aoitIdx] <= firstTime && aoitIdx < aoitLen) {
    aoitIdx++;
  }
  // Iterate through array of increasing times,
  // comparing them to each line segment on the linfun
  let tsIdx = 1;
  let aoitThis; let segTPrev; let segTNext; let segVPrev; let
    segVNext;
  while (tsIdx < tsLen && aoitIdx < aoitLen) {
    segTPrev = linfun.array[tsIdx - 1][0];
    segTNext = linfun.array[tsIdx][0];
    segVPrev = linfun.array[tsIdx - 1][1];
    segVNext = linfun.array[tsIdx][1];
    aoitThis = evaluationTimes[aoitIdx];
    if (segTNext < aoitThis) {
      // This line segment too far back, move on to next line segment
      tsIdx++;
    } else {
      // Time from array is in this line segment.
      // Interpolate the value
      const fraction = (aoitThis - segTPrev) / (segTNext - segTPrev);
      const outputVal = segVPrev + fraction * (segVNext - segVPrev);
      evaluationValues[aoitIdx] = outputVal;
      aoitIdx++;
    }
  }
  // If there are time values after the lastTime from linfun,
  // set them all to the last value from linfun
  const lastValue = linfun.last[1];
  for (let i = aoitIdx; i < aoitLen; i++) evaluationValues[i] = lastValue;
  // Finished constructing result
  return evaluationValues;
};

export default evaluateTsOnArrayOfIncreasingTimes;
