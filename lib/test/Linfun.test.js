import Linfun from '../src/Linfun';

test('test empty constructor', () => {
  const lf1 = new Linfun();
  expect(lf1.length).toEqual(1);
  expect(lf1.array).toEqual([[0, 0]]);
  expect(lf1.first).toEqual([0, 0]);
  expect(lf1.last).toEqual([0, 0]);
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
  expect(lf1.tMin).toEqual(3.21);
  expect(lf1.tMax).toEqual(3.22);
  expect(Math.abs(lf1.tStep - 0.01) < 0.000001).toBeTruthy(); // Actual step is 0.010000000000000231
  expect(lf1.vMin).toEqual(3.4405);
  expect(lf1.vMax).toEqual(5.69);
  expect(Math.abs(lf1.vStep - 2.2495) < 0.000001).toBeTruthy(); // Actual step is 2.2495000000000003
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

test('test repeated t component makes 2nd coord disappear', () => {
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

test('test immutability of Linfun, cannot add a new parameter', () => {
  const lf1 = new Linfun([[-4, -8], [2, 0], [3, -1]]);
  expect(lf1.newParam).toBeUndefined();
  try { lf1.newParam = 'try to set it'; } catch (e) {} /* eslint-disable-line no-empty */
  expect(lf1.newParam).toBeUndefined();
});

test('test immutability of Linfun array, cannot push a new coordinate', () => {
  const lf1 = new Linfun([[-4, -8], [2, 0], [3, -1]]);
  expect(lf1.array.length).toEqual(3);
  try { lf1.array.push([4, 5]); } catch (e) {} /* eslint-disable-line no-empty */
  expect(lf1.array.length).toEqual(3);
});

test('test immutability of Linfun first coord, cannot alter value', () => {
  const lf1 = new Linfun([[-4, -8], [2, 0], [3, -1]]);
  expect(lf1.first[0]).toEqual(-4); // lf.first[0] = lf.tMin, but can't use for assignment
  try { lf1.first[0] = -5; } catch (e) {} /* eslint-disable-line no-empty */
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
  // Note - any coords that are not increasing in t component will be removed
  // If t components match across a concat, the second will be shifted slightly forward
  const lf1 = new Linfun([[1, 1], [2, 2], [3, 3]]);
  const lf2 = new Linfun([[3, 4], [4, 4], [4, 3], [6, 3]]);
  const lf3 = new Linfun();
  const lf4 = new Linfun([[5.99, 42], [6, -3], [8, 10]]);
  const lf5 = Linfun.concat(lf1, lf2, 'string', lf3, lf4);
  expect(lf5.length).toEqual(7);
  expect(lf5.array).toEqual([
    [1, 1],
    [2, 2],
    [3, 3],
    [3.00000001, 4],
    [4, 4],
    [6, 3],
    [8, 10],
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
  expect(lf1.array).toEqual([[0, 0]]);
});

test('test array that is not nested correctly', () => {
  const lf1 = new Linfun([42, -500]);
  expect(lf1.array).toEqual([[0, 0]]);
});

test('test single coord', () => {
  const lf1 = new Linfun([[42, -500]]);
  expect(lf1.array).toEqual([[42, -500]]);
});

test('test invalid coord', () => {
  const lf1 = new Linfun([[42, '-500']]);
  expect(lf1.array).toEqual([[0, 0]]);
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
  expect(lf1.toString()).toEqual('Linfun of length 5: [1,1],[2,0],[3.01010101,1],[4,0],[4.5,123]');
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
  expect(lf1.toString()).toEqual('Linfun of length 6: [1,1],[2,0],[3.01010101,1],[4,0],...[5,100.00987]');
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
  const lf2 = lf1.map(() => 'invalid value');
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
  const lf2 = lf1.map((t) => [t, 'invalid coord value']);
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

test('splitting with intermediate t', () => {
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

test('splitting with t before', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const [lf2, lf3] = lf1.split(0.5);
  expect(lf2.array).toEqual([[0, 0]]);
  expect(lf3.array).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test('splitting with invalid t', () => {
  const lf1 = new Linfun([
    [1, 2],
    [3, 4],
  ]);
  const [lf2, lf3] = lf1.split('invalid split t');
  expect(lf2 === lf1).toBeTruthy();
  expect(lf3.array).toEqual([[0, 0]]);
});

test('adding 0 Linfuns', () => {
  const lf1 = Linfun.add();
  expect(lf1.array).toEqual([[0, 0]]);
});

test('adding 1 Linfun', () => {
  const lf1 = new Linfun([
    [1, -6],
    [4, 70],
  ]);
  const lf2 = Linfun.add(lf1);
  expect(lf2.array).toEqual([
    [1, -6],
    [4, 70],
  ]);
});

test('adding 2 Linfuns', () => {
  const lf1 = new Linfun([
    [1, 6],
    [3, 7],
  ]);
  const lf2 = new Linfun([
    [2, 14],
    [4, 15],
  ]);
  const lf3 = Linfun.add(lf1, lf2);
  expect(lf3.array).toEqual([
    [1, 20],
    [2, 20.5],
    [3, 21.5],
    [4, 22],
  ]);
});

test('adding 4 Linfuns', () => {
  const lf1 = new Linfun([[1, 1], [2, 2]]);
  const lf2 = new Linfun([[1, 1], [3, 3]]);
  const lf3 = new Linfun([[1, 1], [4, 4]]);
  const lf4 = new Linfun([[1, 1], [5, 5]]);
  const lf5 = Linfun.add(lf1, lf2, lf3, lf4);
  expect(lf5.array).toEqual([
    [1, 4],
    [2, 8],
    [3, 11],
    [4, 13],
    [5, 14],
  ]);
});

test('multiplying 0 Linfuns', () => {
  const lf1 = Linfun.mult();
  expect(lf1.array).toEqual([[0, 0]]);
});

test('multiplying 1 Linfun', () => {
  const lf1 = new Linfun([
    [1, -6],
    [4, 70],
  ]);
  const lf2 = Linfun.mult(lf1);
  expect(lf2.array).toEqual([
    [1, -6],
    [4, 70],
  ]);
});

test('multiplying 2 Linfuns', () => {
  const lf1 = new Linfun([
    [1, 6],
    [3, 7],
  ]);
  const lf2 = new Linfun([
    [2, 14],
    [4, 15],
  ]);
  const lf3 = Linfun.mult(lf1, lf2);
  expect(lf3.array).toEqual([
    [1, 84],
    [2, 91],
    [3, 101.5],
    [4, 105],
  ]);
});

test('multiplying 5 Linfuns', () => {
  const lf1 = new Linfun([[1, 1], [2, 2]]);
  const lf2 = new Linfun([[1, 1], [2, 3]]);
  const lf3 = new Linfun([[1, 1], [3, 3]]);
  const lf4 = new Linfun([[2, 1], [3, 4]]);
  const lf5 = new Linfun([[2, 1], [4, 4]]);
  const lf6 = Linfun.mult(lf1, lf2, lf3, lf4, lf5);
  expect(lf6.array).toEqual([
    [1, 1 * 1 * 1 * 1 * 1], // 1
    [2, 2 * 3 * 2 * 1 * 1], // 12
    [3, 2 * 3 * 3 * 4 * 2.5], // 180
    [4, 2 * 3 * 3 * 4 * 4], // 288
  ]);
});
