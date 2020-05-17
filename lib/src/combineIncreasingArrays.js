import isArray from 'isarray';

const minVal = -1e308;
const maxVal = 1e308;

// combineIncreasingArrays
// Function to take in multiple arrays of numeric values,
// each in increasing order, and output a single array containing
// all distinct values in increasing order

const privateCombine = (...theArrays) => {
  const len = theArrays.length;
  if (len === 0) return [];
  if (len === 1) return privateCombine(theArrays[0], []);
  if (len === 2) {
    // Main / final processing here
    // Start by only allowing numeric array entries through
    const arr0 = theArrays[0].filter((elt) => Number.isFinite(elt));
    const arr1 = theArrays[1].filter((elt) => Number.isFinite(elt));
    const l0 = arr0.length;
    const l1 = arr1.length;
    const result = new Array(l0 + l1);
    let i = 0;
    let i0 = 0;
    let i1 = 0;
    let tPrev = minVal;
    while (i0 < l0 || i1 < l1) {
      let t0 = arr0[i0];
      let t1 = arr1[i1];
      // If beyond end of array, need to use Infinity
      t0 = Number.isFinite(t0) ? t0 : Infinity;
      t1 = Number.isFinite(t1) ? t1 : Infinity;
      if (t0 < t1) {
        if (tPrev < t0) {
          tPrev = t0;
          if (t0 < maxVal) {
            result[i] = t0;
            i += 1;
          }
        }
        i0 += 1;
      } else {
        // t1 <= t0
        if (tPrev < t1) {
          tPrev = t1;
          if (t1 < maxVal) {
            result[i] = t1;
            i += 1;
          }
        }
        i1 += 1;
      }
    }
    return result.slice(0, i);
  }
  if (len === 3) {
    // Combine two shortest first,
    // then combine result with longest
    const arr0 = theArrays[0];
    const arr1 = theArrays[1];
    const arr2 = theArrays[2];
    const l0 = arr0.length;
    const l1 = arr1.length;
    const l2 = arr2.length;
    let idxLongest;
    if (l0 > l1) {
      idxLongest = l0 > l2 ? 0 : 2;
    } else {
      idxLongest = l1 > l2 ? 1 : 2;
    }
    const tempArrs = [arr0, arr1, arr2];
    const arrLongest = tempArrs.splice(idxLongest, 1)[0];
    return privateCombine(
      privateCombine(tempArrs[0], tempArrs[1]),
      arrLongest,
    );
  }
  // Iterative case, len > 3, split approx in half and iterate
  const splitIdx = Math.floor(0.5 * len);
  return privateCombine(
    privateCombine(...theArrays.slice(0, splitIdx)),
    privateCombine(...theArrays.slice(splitIdx)),
  );
};

const combineIncreasingArrays = (...paramArray) => {
  const arrayOfArrays = paramArray.filter((elt) => isArray(elt));
  return privateCombine(...arrayOfArrays);
};

export default combineIncreasingArrays;
