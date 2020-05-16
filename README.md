## linfun

[![Build status](https://travis-ci.org/davidryan59/linfun.svg?master)](https://travis-ci.org/davidryan59)

Class Linfun - for Continuous Piecewise Linear Functions

https://en.wikipedia.org/wiki/Piecewise_linear_function

Instances are  *continuous and piecewise* linear functions
Expressed in terms of a doubly-nested array of coords [
  [t1, v1],
  [t2, v2],
  [t3, v3],
  ...
  [tn, vn]
]
where all t, v are finite numbers (decimal or integer)
and t must be strictly increasing

The function defined is constant below t1 with value v1,
and constant above tn with value vn
Between ti and t(i+1) it linearly interpolates between vi and v(i+1)

Degenerate cases for n = 0, 1 are constant functions, with value 0 (n=0) or v1 (n=1)

Use a constructor of this format:
lf = new Linfun([
  [-0.5, -1],
  [1.1, 304],
  [1684, 0.0001]
])

Linfuns are immutable, to simplify many calculations, they cannot be changed once created.
Operations on Linfuns will return new instances of Linfun.

### CLI commands

- `npm i linfun` - Install this module in your project

- `npm run lint` - Run lint on lib folder
- `npm run test` - Run testing on lib folder, with watching and coverage
- `npm run build` - Build the code in lib folder into ES5 in the dist folder
- `npm run examples` - Run the examples, after building
