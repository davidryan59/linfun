import isArray from 'isarray';

import isLinfun from './isLinfun';
import combineIncreasingNumericArrays from './combineIncreasingNumericArrays';
import evaluateTsOnArrayOfIncreasingTimes from './evaluateTsOnArrayOfIncreasingTimes';


const minT = -1e308;
const smallTimeShiftS = 1e-8;
const toStringMaxEntries = 5;

let id = 0;
class Linfun {
  constructor(coordArray) {
    // coordArray of form:
    // [[t1, v1], [t2, v2], ...]
    // for t, v numeric
    // t should be in strictly ascending order
    this.id = id++;
    const checkedCoordArray = [];
    if (isArray(coordArray)) {
      let tPrev = minT;
      for (let i = 0; i < coordArray.length; i++) {
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

  get markAsLf() { return true; }

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
    return `Time series of length ${this.length}: ${firstText}${lastText}`;
  }

  // Concatenate multiple linfun, in increasing order of time
  // Linfun.concat(lf1, lf2, lf3...)
  // Times in later TS have to be after those in earlier TS, otherwise they get ignored
  // If linfun exactly match (end of previous, start of next) an infinitesimal time delay is introduced
  // to allow step functions which still have increasing time coords.
  static concat(...tsInputArray) {
    // const argArray = (isArray(arguments[0])) ? arguments[0] : [...arguments]
    // const tsArray = argArray.filter(arg => isLinfun(arg) && arg.length > 0)
    // const argArray = (isArray(arguments[0])) ? arguments[0] : [...arguments]
    const tsArray = tsInputArray.filter((ts) => isLinfun(ts) && ts.length > 0);
    let collectCoords = null;
    if (tsArray.length < 2) {
      // 0 or 1 valid Linfun supplied
      collectCoords = tsArray.map((ts) => ts.array);
    } else {
      // 2 or more valid Linfun supplied
      // If consecutive blocks have matching start/end time,
      // and a jump in value, move block start slightly forward
      collectCoords = [tsArray[0].array];
      for (let i = 1; i < tsArray.length; i++) {
        const tsPrevLast = tsArray[i - 1].last;
        const tsNextFirst = tsArray[i].first;
        if (tsPrevLast[0] === tsNextFirst[0] && tsPrevLast[1] !== tsNextFirst[1]) {
          collectCoords.push([[tsNextFirst[0] + smallTimeShiftS, tsNextFirst[1]]]);
        }
        collectCoords.push(tsArray[i].array);
      }
    }
    return new this(collectCoords.flat());
  }

  // Evaluate a function (with default value) across a set of linfun
  // Linfun.evalFn(fn, 0, lf1, lf2, lf3...)
  // coord by coord, for every coord that appears in any of the linfun.
  // Return a new linfun as the result
  static eval(fnToEvaluate, defaultValue, ...tsArray) {
    const checkedTsArray = tsArray.map((ts) => (isLinfun(ts) ? ts : { array: [], dummy: true }));
    const coordArrays = checkedTsArray.map((ts) => ts.array);
    // This is a trebly nested array, inner arrays are [t, v]
    // Map to a doubly nested array, put t at the lowest level
    const timeArrays = coordArrays.map((coordArray) => coordArray.map((coord) => coord[0]));
    // Use the private function to get array of any time coord used in any of the linfun
    const combinedTimeArray = combineIncreasingNumericArrays(...timeArrays);
    const valueArrays = checkedTsArray.map((ts) => {
      if (ts.dummy) return combinedTimeArray.map(() => defaultValue);
      return evaluateTsOnArrayOfIncreasingTimes(ts, combinedTimeArray);
    });
    const constructorData = combinedTimeArray.map((t) => [t, 0]);
    for (let i = 0; i < combinedTimeArray.length; i++) {
      const inputs = valueArrays.map((arr) => arr[i]);
      let output = fnToEvaluate(...inputs);
      if (!Number.isFinite(output)) output = 0;
      constructorData[i][1] = output;
    }
    return new this(constructorData);
  }

  map(fnToMap) {
    // Return a new linfun with mapping on coordinates:
    // Option 1: map only values:
    // (t, v) => f(t, v)
    // Option 2: map both times and values:
    // (t, v) => [f(t, v), g(t, v)]
    if (!fnToMap || !fnToMap.call) return this;
    const newCoords = this.array.map(([t, v]) => {
      const fnResult = fnToMap(t, v);
      if (Number.isFinite(fnResult)) return [t, fnResult];
      if (isArray(fnResult)) {
        const newT = fnResult[0];
        const newV = fnResult[1];
        if (Number.isFinite(newT) && Number.isFinite(newV)) return [newT, newV];
      }
      return [t, v];
    });
    return new this.constructor(newCoords);
  }

  linearMap(tAdd, tMult, vAdd, vMult) {
    if (Number.isFinite(tAdd) && Number.isFinite(tMult) && Number.isFinite(vAdd) && Number.isFinite(vMult)) {
      return this.map((t, v) => [tAdd + tMult * t, vAdd + vMult * v]);
    }
    return this;
  }

  split(splitTime) {
    if (Number.isFinite(splitTime)) {
      const originalCoords = this.array;
      const coords1 = originalCoords.filter(([t, v]) => t < splitTime);
      const coords2 = originalCoords.filter(([t, v]) => t >= splitTime);
      return [new this.constructor(coords1), new this.constructor(coords2)];
    }
    return [this, new this.constructor()];
  }
}

export default Linfun;
