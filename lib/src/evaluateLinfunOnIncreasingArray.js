/* eslint-disable prefer-destructuring */

// Input a series of t, in strictly increasing order
// Output a series of v, in the same order
// Use linear interpolation between specified linfun points

// By inputting array of t in increasing order,
// evaluation should run much faster than evaluating each t separately.

import isArray from 'isarray';

import isLinfun from './isLinfun';

const tMin = -1e300;

const evaluateLinfunOnIncreasingArray = (linfun, tArrayInput) => {
  // If t array is invalid, return empty array
  if (!isArray(tArrayInput) || tArrayInput.length < 1) return [];
  // If linfun is invalid, return array of zeroes
  if (!isLinfun(linfun)) return tArrayInput.map(() => 0);
  // If linfun does not have at least 2 coords,
  // e.g. at least 1 line segment, return array of constants
  const lfLen = linfun.length; // guaranteed at least 1
  const firstVal = linfun.first[1];
  const vArrayEval = tArrayInput.map(() => firstVal);
  if (lfLen < 2) return vArrayEval;
  // We have a linfun with length at least 2, i.e. at least one line segment to interpolate.
  // Clean up the input array
  const tArrayEval = [...tArrayInput];
  let tPrev = tMin;
  for (let i = 0; i < tArrayEval.length; i += 1) {
    let t = tArrayEval[i];
    // Make sure t is a number, and no smaller than previous t
    if (!Number.isFinite(t) || t < tPrev) {
      // t is invalid, re-use previous t, overwrite array
      t = tPrev;
      tArrayEval[i] = t;
    }
    // Store prev t for next round
    tPrev = t;
  }
  // Find first t in array that is after first t from linfun
  const tFirst = linfun.tMin;
  // 'aoit' = array of increasing t
  let aoitIdx = 0;
  const aoitLen = tArrayEval.length;
  while (tArrayEval[aoitIdx] <= tFirst && aoitIdx < aoitLen) {
    aoitIdx += 1;
  }
  // Iterate through array of increasing t,
  // comparing them to each line segment on the linfun
  let lfIdx = 1;
  let aoitThis;
  let segTPrev;
  let segTNext;
  let segVPrev;
  let segVNext;
  while (lfIdx < lfLen && aoitIdx < aoitLen) {
    segTPrev = linfun.array[lfIdx - 1][0];
    segTNext = linfun.array[lfIdx][0];
    segVPrev = linfun.array[lfIdx - 1][1];
    segVNext = linfun.array[lfIdx][1];
    aoitThis = tArrayEval[aoitIdx];
    if (segTNext < aoitThis) {
      // This line segment too far back, move on to next line segment
      lfIdx += 1;
    } else {
      // t from array is in this line segment.
      // Interpolate the value
      const fraction = (aoitThis - segTPrev) / (segTNext - segTPrev);
      const outputVal = segVPrev + fraction * (segVNext - segVPrev);
      vArrayEval[aoitIdx] = outputVal;
      aoitIdx += 1;
    }
  }
  // If there are t values after the lastTime from linfun,
  // set them all to the last value from linfun
  const lastValue = linfun.last[1];
  for (let i = aoitIdx; i < aoitLen; i += 1) vArrayEval[i] = lastValue;
  // Finished constructing result
  return vArrayEval;
};

export default evaluateLinfunOnIncreasingArray;
