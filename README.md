## linfun

[![npm version](https://badge.fury.io/js/linfun.svg)](https://badge.fury.io/js/linfun)
[![Downloads per month](https://img.shields.io/npm/dy/linfun.svg?maxAge=31536000)](https://github.com/davidryan59/linfun)
[![Build status](https://travis-ci.org/davidryan59/linfun.svg?master)](https://travis-ci.org/davidryan59)

Use class **Linfun** for *Continuous Piecewise Linear Functions* - see Wikipedia article: https://en.wikipedia.org/wiki/Piecewise_linear_function

### Quick start

In project:

``` sh
npm i linfun
```

In Javascript file:

``` js
import { Linfun, isLinfun } from 'linfun'
const lf = new Linfun([
  [1, 2],
  [3, 4]
])
console.log(lf)  // Linfun { id: 0, array: [ [ 1, 2 ], [ 3, 4 ] ] }
console.log(isLinfun(lf))  // true
```

These coords [t, v] define a function v = f(t) that is:
- constant v=2, below t=1
- constant v=4, above t=3
- increases from v=2 to v=4, between t=1 and t=3

### Description

Instances of Linfun are numeric functions from real numbers to real numbers. (A real number is any finite decimal or integer value. A real number can be positive, zero, or negative.) Linfuns are:
- piecewise - the function has separate definitions on separate intervals of the real number line
- linear - each definition on an interval is a straight line segment (v = at + b)
- continuous - if two intervals are adjacent, then where they meet the definitions match

Linfuns are defined by a series of coordinates [t, v], where v is the value of the Linfun at t. (Although t could represent time, it does not have to.) Then the whole Linfun is defined by [t1, v1], [t2, v2], ...[tn, vn] where each t must be **strictly larger** than the previous t.

The value of the Linfun is then:
- v1, from -Infinity to t1
- vn, from tn to +Infinity
- vi, at ti
- use linear interpolation from vi to v(i+1), between ti and t(i+1)

The general constructor is:

``` js
const lf = new Linfun([
  [t1, v1],
  [t2, v2],
  ...
  [tn, vn]
])
```

Notes:
- n will be a non-negative integer
- for n=0, returned Linfun has a single coord [0, 0] and is zero everywhere
- for n=1, returned Linfun has a single coord [t1, v1] and is constant v1 everywhere
- lf.length is guaranteed to be a positive integer, [0, 0] is added if no valid coords inputted
- for [t, v] if either t or v is not a finite number, then coord will be **ignored**
- if ti is not strictly greater than t(i-1), then [ti, vi] will be **ignored**
- After construction, the set of coords is available in `lf.array` which is **an array of coords**, each coord of the form [t, v], with t and v finite real numbers
- All of the following are **immutable** and cannot be changed after construction:
  - `lf`
  - `lf.array`
  - `lf.array[i]`

## API

### Importing & Constructor
``` js
import { Linfun } from 'linfun' // The class Linfun
import { isLinfun } from 'linfun' // A utility function to check if parameter is a Linfun

const lf = new Linfun([ [t1, v1], [t2, v2], ...[tn, vn] ])
// ti will be strictly greater than t(i-1),
// or else [ti, vi] will be ignored

console.log(isLinfun(lf)) // true
console.log(isLinfun('another thing')) // false
```

### Instance methods

``` js
lf.array
// Returns the (immutable) internal array, which is an
// array of coordinates, each coordinate of form [t, v]

lf.id         // Returns integer id of this Linfun
lf.length     // Returns the length of the internal array, guaranteed to be at least 1
lf.first      // Returns (immutable) first coordinate of internal array
lf.last       // Returns (immutable) last coordinate of internal array
lf.markAsLf   // Returns true
lf.toString() // Returns string representation of this Linfun

lf.map(fn)
// Returns new Linfun with coordinates mapped by fn
// To map only v, use: fn = (t, v) => number
// To map both t and v, use: fn = (t, v) => [number, number]

lf.linearMap(tAdd, tMult, vAdd, vMult)
// Linear mapping on a Linfun, according to:
// (t, v) => [tAdd + tMult * t, vAdd + vMult * v]

lf.split(tSplit)
// Returns [lf1, lf2]
// where lf1 contains all coordinates with t < tSplit
// and lf2 contains all coordinates with tSplit <= t
```

### Static or Class methods

``` js
Linfun.concat(lf1, lf2, ...lfn)
// Concatenates multiple Linfuns in increasing t order
// Similar to calling new Linfun(...) on concatenation of lfi.array,
// so any later coords will be ignored if they have non-increasing t
// However, between lf(i-1) and lfi,
// If t(i-1) at end of lf(i-1) matches ti at start of lfi,
// and values v(i-1) and vi are distinct,
// then a small delay in t(i+1) will be introduced, similar to a step function
// giving an extra coord of form [ti + deltaT, vi]
// deltaT is set to 1e-8

Linfun.eval(fn, defaultValue, lf1, lf2, ...lfn)
// Evaluates fn on values from multiple Linfuns, returns new Linfun
// Final set of t is any t appearing in any of the lfi
// Default value only used for an invalid lfi input
// Example: use: fn = (v1, v2) => v1 - v2
// to subtract lf2 from lf1
// which will be calculated at any t appearing in lf1 or lf2

Linfun.add(lf1, lf2, ...lfn)
// Add together multiple Linfuns, coordinate by coordinate.
// Since addition is linear, this is an exact addition of the underlying functions.

Linfun.mult(lf1, lf2, ...lfn)
// Multiply together multiple Linfuns, coordinate by coordinate.
// Since multiplication is NOT linear, this is only an approximation
// of multiplying the underlying functions.
// The finer-grained the Linfuns are, the more accurate multiplication becomes.
```
