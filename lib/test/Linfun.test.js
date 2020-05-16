import Linfun from '../src/Linfun';

test('test empty constructor', () => {
  const lf1 = new Linfun();
  expect(lf1.length).toEqual(0);
  expect(lf1.array).toEqual([]);
  expect(lf1.first).toBeNull();
  expect(lf1.last).toBeNull();
});

test('test coords with increasing times', () => {
  const lf1 = new Linfun([
    [3.21, 5.69],
    [3.21001, 3.45],
    [3.22, 3.4405],
  ]);
  expect(lf1.length).toEqual(3);
  expect(lf1.array).toEqual([
    [3.21, 5.69],
    [3.21001, 3.45],
    [3.22, 3.4405],
  ]);
});

test('test coords with non-increasing times', () => {
  const lf1 = new Linfun([
    [3.21, 5.69],
    [3.20001, 3.45],
    [3.22, 3.4405],
  ]);
  expect(lf1.length).toEqual(2);
  expect(lf1.array).toEqual([
    [3.21, 5.69],
    [3.22, 3.4405],
  ]);
});

test('test repeated time coord makes 2nd coord disappear', () => {
  const lf1 = new Linfun([
    [4, 3],
    [6, 2],
    [6, 3],
    [9, -40],
  ]);
  expect(lf1.length).toEqual(3);
  expect(lf1.array).toEqual([
    [4, 3],
    [6, 2],
    [9, -40],
  ]);
});

test('test non-linear coords', () => {
  const lf1 = new Linfun([
    [1, 1],
    [2, 2],
    [3, 4],
    [4, 4],
  ]);
  expect(lf1.length).toEqual(4);
  expect(lf1.array).toEqual([
    [1, 1],
    [2, 2],
    [3, 4],
    [4, 4],
  ]);
});

test('test linear coords, keep middle two coords even though they are on line from surrounding coords', () => {
  const lf1 = new Linfun([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]);
  expect(lf1.length).toEqual(4);
  expect(lf1.array).toEqual([
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]);
});

test('test immutability of Time Series, cannot add a new parameter', () => {
  const lf1 = new Linfun([[-4, -8], [2, 0], [3, -1]]);
  expect(lf1.newParam).toBeUndefined();
  try { lf1.newParam = 'try to set it'; } catch (e) { null; }
  expect(lf1.newParam).toBeUndefined();
});

test('test immutability of Time Series array, cannot push a new coordinate', () => {
  const lf1 = new Linfun([[-4, -8], [2, 0], [3, -1]]);
  expect(lf1.array.length).toEqual(3);
  try { lf1.array.push([4, 5]); } catch (e) { null; }
  expect(lf1.array.length).toEqual(3);
});

test('test immutability of Time Series first coord, cannot alter value', () => {
  const lf1 = new Linfun([[-4, -8], [2, 0], [3, -1]]);
  expect(lf1.first[0]).toEqual(-4);
  try { lf1.first[0] = -5; } catch (e) { null; }
  expect(lf1.first[0]).toEqual(-4);
});

test('test concatenating, for increasing coords', () => {
  const lf1 = new Linfun([[5, 3], [6, -25]]);
  const lf2 = new Linfun([[8, 340], [1023, -0.01], [30032, -44934.2323]]);
  const lf3 = Linfun.concat(lf1, lf2);
  expect(lf3.length).toEqual(5);
  expect(lf3.array).toEqual([
    [5, 3],
    [6, -25],
    [8, 340],
    [1023, -0.01],
    [30032, -44934.2323],
  ]);
});

test('test concatenating, for a variety of valid and invalid inputs', () => {
  // Note - any coords that are not increasing in time will be removed
  // If time coords match across a concat, the second will be shifted slightly forward
  const lf1 = new Linfun([[1, 1], [2, 2], [3, 3]]);
  const lf2 = new Linfun();
  const lf3 = new Linfun([[3, 4], [4, 4], [5, 3], [6, 3]]); // First point gets shifted forwards
  const lf4 = new Linfun([[5.1, 42], [6, -3], [8, 10], [10, 8], [10, 9], [11, 0]]); // First two points non-increasing times, so are removed
  const lf5 = Linfun.concat(lf1, lf2, 'string', lf3, lf4); // Invalid linfun gets ignored
  expect(lf5.length).toEqual(10);
  expect(lf5.array).toEqual([
    [1, 1],
    [2, 2],
    [3, 3],
    [3.00000001, 4],
    [4, 4],
    [5, 3],
    [6, 3],
    [8, 10],
    [10, 8],
    [11, 0],
  ]);
});

test('test concatenating only 1 linfun', () => {
  const lf1 = new Linfun([[3, 5], [90, -2.30]]);
  const lf2 = Linfun.concat(lf1);
  expect(lf2.array).toEqual([
    [3, 5],
    [90, -2.3],
  ]);
});

test('test adding 4 linfun pointwise, including an invalid linfun', () => {
  const lf1 = new Linfun([[0, 0], [2, 1]]);
  const lf2 = new Linfun([[-1, 0], [3, 1]]);
  const lf3 = 'invalid entry';
  const lf4 = new Linfun([[3.5, 0], [4, 1], [5, 0]]);
  const result = Linfun.eval((a, b, c, d) => a + b + c + d, 0, lf1, lf2, lf3, lf4);
  expect(result.array).toEqual([
    [-1, 0],
    [0, 0.25],
    [2, 1.75],
    [3, 2],
    [3.5, 2],
    [4, 3],
    [5, 2],
  ]);
});

test('test multiplying 3 linfun pointwise', () => {
  const lf1 = new Linfun([[0, 1], [2, 2]]);
  const lf2 = new Linfun([[-1, 1], [3, 2]]);
  const lf3 = new Linfun([[3, 1], [6, 0], [9, 1]]);
  const result = Linfun.eval((a, b, c) => a * b * c, 1, lf1, lf2, lf3);
  expect(result.array).toEqual([
    [-1, 1],
    [0, 1.25],
    [2, 3.5],
    [3, 4],
    [6, 0],
    [9, 4],
  ]);
});

test('test non-numeric evaluation function goes to 0', () => {
  const lf1 = new Linfun([[0, 1], [2, 2]]);
  const result = Linfun.eval((a) => `${a}`, 0, lf1);
  expect(result.array).toEqual([
    [0, 0],
    [2, 0],
  ]);
});

test('test invalid numeric parameter', () => {
  const lf1 = new Linfun(42);
  expect(lf1.array).toEqual([]);
});

test('test array that is not nested correctly', () => {
  const lf1 = new Linfun([42, -500]);
  expect(lf1.array).toEqual([]);
});

test('test single coord', () => {
  const lf1 = new Linfun([[42, -500]]);
  expect(lf1.array).toEqual([[42, -500]]);
});

test('test invalid coord', () => {
  const lf1 = new Linfun([[42, '-500']]);
  expect(lf1.array).toEqual([]);
});

test('test 1 invalid, 1 valid coord', () => {
  const lf1 = new Linfun([[false, -500], [41.99, -1273]]);
  expect(lf1.array).toEqual([[41.99, -1273]]);
});

test('test toString on linfun length up to 5', () => {
  const lf1 = new Linfun([
    [1, 1],
    [2, 0],
    [3.01010101, 1],
    [4, 0],
    [4.5, 123],
    [-5, 100.00987], // lower t, gets removed
  ]);
  expect(lf1.toString()).toEqual('Time series of length 5: [1,1],[2,0],[3.01010101,1],[4,0],[4.5,123]');
});

test('test toString on linfun length 6 or more', () => {
  const lf1 = new Linfun([
    [1, 1],
    [2, 0],
    [3.01010101, 1],
    [4, 0],
    [4.5, 123],
    [5, 100.00987],
  ]);
  expect(lf1.toString()).toEqual('Time series of length 6: [1,1],[2,0],[3.01010101,1],[4,0],...[5,100.00987]');
});

test('test mapping function for values only', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.map((t, v) => (2 + t) * (3 + v));
  expect(lf2.array).toEqual([
    [1, 15],
    [3, 35],
  ]);
});

test('test mapping function for times and values', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.map((t, v) => [10 * v, 3 * (t + v)]);
  expect(lf2.array).toEqual([
    [20, 9],
    [40, 21],
  ]);
});

test('test invalid mapping function, non-array', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.map((t, v) => 'invalid value');
  expect(lf1 === lf2).toBeFalsy();
  expect(lf1.array === lf2.array).toBeFalsy();
  expect(lf1.array[0] === lf2.array[0]).toBeFalsy();
  expect(lf2.array).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test('test invalid mapping function, array', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.map((t, v) => [t, 'invalid coord value']);
  expect(lf1 === lf2).toBeFalsy();
  expect(lf1.array === lf2.array).toBeFalsy();
  expect(lf1.array[0] === lf2.array[0]).toBeFalsy();
  expect(lf2.array).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test('test mapping with non-function gives same result back', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.map('invalid function, it is a string');
  expect(lf1 === lf2).toBeTruthy();
});

test('test linear map', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.linearMap(100, 10, 10000, 1000);
  // t => 100 + 10 * t
  // v => 10000 + 1000 * v
  expect(lf2.array).toEqual([
    [110, 12000],
    [130, 14000],
  ]);
});

test('test linear map with invalid data', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const lf2 = lf1.linearMap('...some invalid data here');
  expect(lf1 === lf2).toBeTruthy();
});

test('splitting with intermediate time', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ]);
  const [lf2, lf3] = lf1.split(5);
  expect(lf2.array).toEqual([
    [1, 2],
    [3, 4],
  ]);
  expect(lf3.array).toEqual([
    [5, 6],
    [7, 8],
  ]);
});

test('splitting with time before', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const [lf2, lf3] = lf1.split(0.5);
  expect(lf2.array).toEqual([]);
  expect(lf3.array).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test('splitting with invalid time', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const [lf2, lf3] = lf1.split('invalid split time');
  expect(lf2 === lf1).toBeTruthy();
  expect(lf3.array).toEqual([]);
});
