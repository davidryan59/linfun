import isArray from 'isarray';

import isLinfun from './isLinfun';
import combineIncreasingArrays from './combineIncreasingArrays';
import evaluateLinfunOnIncreasingArray from './evaluateLinfunOnIncreasingArray';

const tMin = -1e308;
const tSmallShift = 1e-8;
const toStringMaxEntries = 5;

const addArgs = (...argArray) => argArray.reduce((acc, elt) => acc + elt, 0);
const multArgs = (...argArray) => argArray.reduce((acc, elt) => acc * elt, 1);

let id = 0;
class Linfun {
  constructor(coordArray) {
    this.id = id;
    id += 1;
    const checkedCoordArray = [];
    if (isArray(coordArray)) {
      let tPrev = tMin;
      for (let i = 0; i < coordArray.length; i += 1) {
        const coord = coordArray[i];
        if (isArray(coord)) {
          const t = coord[0];
          const v = coord[1];
          if (Number.isFinite(t) && Number.isFinite(v) && tPrev < t) {
            const goodCoord = [t, v];
            Object.freeze(goodCoord);
            checkedCoordArray.push(goodCoord);
            tPrev = t;
          }
        }
      }
    }
    Object.freeze(checkedCoordArray);
    this.array = checkedCoordArray;
    Object.freeze(this);
  }

  get markAsLf() { return true; } /* eslint-disable-line class-methods-use-this */

  get length() { return this.array.length; }

  get first() { return (this.length > 0) ? this.array[0] : null; }

  get last() { return (this.length > 0) ? this.array[this.length - 1] : null; }

  toString() {
    let firstElts = this.array;
    let lastElt = null;
    if (this.length > toStringMaxEntries) {
      firstElts = this.array.slice(0, toStringMaxEntries - 1);
      lastElt = this.array[this.length - 1];
    }
    const firstText = firstElts.map((elt) => `[${elt}]`);
    let lastText = '';
    if (lastElt) lastText = `,...[${lastElt}]`;
    return `Linfun of length ${this.length}: ${firstText}${lastText}`;
  }

  static concat(...lfInputArray) {
    const lfArray = lfInputArray.filter((lf) => isLinfun(lf) && lf.length > 0);
    let collectCoords = null;
    if (lfArray.length < 2) {
      // 0 or 1 valid Linfuns supplied
      collectCoords = lfArray.map((lf) => lf.array);
    } else {
      // 2 or more valid Linfuns supplied
      // Extra work to deal with case where adjacent Linfuns
      // have exactly matching end / start t and different v
      // and then introduce an very short delay
      collectCoords = [lfArray[0].array];
      for (let i = 1; i < lfArray.length; i += 1) {
        const coordPrevLast = lfArray[i - 1].last;
        const coordNextFirst = lfArray[i].first;
        if (coordPrevLast[0] === coordNextFirst[0] && coordPrevLast[1] !== coordNextFirst[1]) {
          collectCoords.push([[coordNextFirst[0] + tSmallShift, coordNextFirst[1]]]);
        }
        collectCoords.push(lfArray[i].array);
      }
    }
    return new this(collectCoords.flat());
  }

  static eval(fnToEvaluate, defaultValue, ...lfArray) {
    const lfCheckedArray = lfArray.map((lf) => (isLinfun(lf) ? lf : { array: [], dummy: true }));
    const coordArrays = lfCheckedArray.map((lf) => lf.array);
    // This is a trebly nested array, inner arrays are [t, v]
    // Map to a doubly nested array, put t at the lowest level
    const tArrays = coordArrays.map((coordArray) => coordArray.map((coord) => coord[0]));
    // Use the private combine function to get array of any t coord used in any of the Linfuns
    const tCombinedArray = combineIncreasingArrays(...tArrays);
    const vArrays = lfCheckedArray.map((lf) => {
      if (lf.dummy) return tCombinedArray.map(() => defaultValue);
      return evaluateLinfunOnIncreasingArray(lf, tCombinedArray);
    });
    const constructorData = tCombinedArray.map((t) => [t, 0]);
    for (let i = 0; i < tCombinedArray.length; i += 1) {
      const inputs = vArrays.map((arr) => arr[i]);
      let output = fnToEvaluate(...inputs);
      if (!Number.isFinite(output)) output = 0;
      constructorData[i][1] = output;
    }
    return new this(constructorData);
  }

  static add(...lfArray) { return this.eval(addArgs, 0, ...lfArray); }

  static mult(...lfArray) { return this.eval(multArgs, 1, ...lfArray); }

  map(fnToMap) {
    if (!fnToMap || !fnToMap.call) return this;
    const newCoords = this.array.map(([t, v]) => {
      const fnResult = fnToMap(t, v);
      if (Number.isFinite(fnResult)) return [t, fnResult];
      if (isArray(fnResult)) {
        const tNew = fnResult[0];
        const vNew = fnResult[1];
        if (Number.isFinite(tNew) && Number.isFinite(vNew)) return [tNew, vNew];
      }
      return [t, v];
    });
    return new this.constructor(newCoords);
  }

  linearMap(tAdd, tMult, vAdd, vMult) {
    if (
      Number.isFinite(tAdd) && Number.isFinite(tMult)
      && Number.isFinite(vAdd) && Number.isFinite(vMult)
    ) {
      return this.map((t, v) => [tAdd + tMult * t, vAdd + vMult * v]);
    }
    return this;
  }

  split(tSplit) {
    if (Number.isFinite(tSplit)) {
      const originalCoords = this.array;
      const coords1 = originalCoords.filter((coord) => coord[0] < tSplit);
      const coords2 = originalCoords.filter((coord) => coord[0] >= tSplit);
      return [new this.constructor(coords1), new this.constructor(coords2)];
    }
    return [this, new this.constructor()];
  }
}

export default Linfun;
