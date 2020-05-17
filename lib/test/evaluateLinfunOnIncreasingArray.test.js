import Linfun from '../src/Linfun';
import evaluateLinfunOnIncreasingArray from '../src/evaluateLinfunOnIncreasingArray';

test('Simple test using whole numbers', () => {
  const lf = new Linfun([
    [-1, 5],
    [1, -3],
    [4, 126],
    [1000, 122],
  ]);
  const arr = [-2, -1, 0, 1, 2, 3, 4, 502, 1000, 1001];
  const resultArr = evaluateLinfunOnIncreasingArray(lf, arr);
  expect(resultArr).toEqual([5, 5, 1, -3, 40, 83, 126, 124, 122, 122]);
});

test('Complicated test using decimals and invalid t array values', () => {
  const lf = new Linfun([
    [-1.05, 30.452],
    [-1.04999, -19.2434],
    [1.04999, 12.342],
  ]);
  const arr = [
    -1012922342.3234,
    -45.43,
    'invalid value',
    -1.05001,
    -1.05,
    -1.049995,
    -1.04999,
    -1.04998,
    '-0.5',
    -0.5,
    -45.43,
    -0.01,
    0,
    0.01,
    1.04998,
    1.04999,
    1.05,
    false,
    105,
    105050505.123,
  ];
  const resultArr = evaluateLinfunOnIncreasingArray(lf, arr);
  // Test result to 2 decimal places, using whole numbers
  const resultArr100 = resultArr.map((n) => Math.round(100 * n));
  expect(resultArr100).toEqual([
    3045,
    3045,
    3045,
    3045,
    3045,
    560,
    -1924,
    -1924,
    -1924,
    -1097,
    -1097,
    -360,
    -345,
    -330,
    1234,
    1234,
    1234,
    1234,
    1234,
    1234,
  ]);
});

// Cover some edge cases

test('Test on bad t array', () => {
  const lf = new Linfun([[1, 2], [2, 4]]);
  const arr = 'invalid string';
  const resultArr = evaluateLinfunOnIncreasingArray(lf, arr);
  expect(resultArr).toEqual([]);
});

test('Test on bad linfun', () => {
  const lf = 'invalid linfun';
  const arr = [3, 4, 5];
  const resultArr = evaluateLinfunOnIncreasingArray(lf, arr);
  expect(resultArr).toEqual([0, 0, 0]);
});

test('Test on linfun length 0', () => {
  const lf = new Linfun();
  const arr = [3, 4, 5];
  const resultArr = evaluateLinfunOnIncreasingArray(lf, arr);
  expect(resultArr).toEqual([0, 0, 0]);
});
