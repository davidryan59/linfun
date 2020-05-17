## linfun

Class **Linfun** - for *Continuous Piecewise Linear Functions* - see Wikipedia article: https://en.wikipedia.org/wiki/Piecewise_linear_function

[![Build status](https://travis-ci.org/davidryan59/linfun.svg?master)](https://travis-ci.org/davidryan59)

### Quick start

In project:

``` sh
npm i linfun
```

In Javascript file:

``` js
import Linfun from 'linfun'
const lf = new Linfun([
  [1, 2],
  [3, 4]
])
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
- for n=0, function is zero everywhere
- for n=1, function is constant v1 everywhere
- if ti is not strictly greater than t(i-1), then [ti, vi] will be **ignored**
- After construction, the set of coords is available in `lf.array` which is **an array of arrays of finite real numbers**
- All of the following are **immutable** and cannot be changed after construction:
  - `lf`
  - `lf.array`
  - `lf.array[i]`

## API

### Constructor

``` js
new Linfun([ [t1, v1], [t2, v2], ...[tn, vn] ])
```

### Instance methods

``` js
lf.length     // Returns the length of the internal array
lf.first      // Returns first coordinate of internal array
lf.last       // Returns last coordinate of internal array
lf.toString() // Returns string representation of this Linfun

lf.map(fn)
// Returns new Linfun with coordinates mapped by fn
// To map only v, use (t, v) => number
// To map both t and v, use (t, v) => [number, number]

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
// Any later coords will be ignored if they have non-increasing t
// If t at end of lfi matches t at start of lf(i+1),
// and values are different,
// then a small delay in t will be introduced, similar to a step function

Linfun.eval(fn, defaultValue, lf1, lf2, ...lfn)
// Evaluates fn on multiple Linfuns, returns new Linfun
// e.g. for three Linfuns (lf1, lf2, lf3) supply a function of the form
// (v1, v2, v3) => number
// Will only evaluate at coordinates that exist in any inputted Linfun
```
