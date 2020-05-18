import { Linfun, isLinfun, packageName } from '../src';

test('test Linfun in index.js', () => {
  const lf = new Linfun([
    [-5, 79.86],
    [0, 345],
    [1092345, 0.00010392],
  ]);
  expect(lf.array).toEqual([
    [-5, 79.86],
    [0, 345],
    [1092345, 0.00010392],
  ]);
});

test('test isLinfun in index.js', () => {
  const lf = new Linfun([[56, 78]]);
  expect(isLinfun(lf)).toBeTruthy();
});

test('test packageName in index.js', () => {
  expect(packageName).toEqual('linfun');
});
