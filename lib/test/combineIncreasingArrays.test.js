import combineIncreasingArrays from '../src/combineIncreasingArrays';

test('test combine no arrays', () => {
  const arr = combineIncreasingArrays();
  expect(arr).toEqual(
    [],
  );
});

test('test combine one array in increasing order', () => {
  const arr = combineIncreasingArrays(
    [5.4, 6, 7, 8.24],
  );
  expect(arr).toEqual(
    [5.4, 6, 7, 8.24],
  );
});

test('test combine two arrays in increasing order', () => {
  const arr = combineIncreasingArrays(
    [-4.01, 5.768],
    [3.00323, 4934.3],
  );
  expect(arr).toEqual(
    [-4.01, 3.00323, 5.768, 4934.3],
  );
});

test('test combine three arrays in increasing order', () => {
  const arr = combineIncreasingArrays(
    [3, 10.02],
    [-2.032, -1.23, 5.634],
    [-2.9999, 3, 3.0001],
  );
  expect(arr).toEqual(
    [-2.9999, -2.032, -1.23, 3, 3.0001, 5.634, 10.02],
  );
});

test('test combine five arrays in increasing order', () => {
  const arr = combineIncreasingArrays(
    [0, 1],
    [2, 3],
    [-0.001, 0.000234, 2.5],
    [6, 7, 8, 9, 10],
    [-1000, 1, 3, 8.99, 9.05],
  );
  expect(arr).toEqual(
    [-1000, -0.001, 0, 0.000234, 1, 2, 2.5, 3, 6, 7, 8, 8.99, 9, 9.05, 10],
  );
});

test('test non-array inputs', () => {
  const arr = combineIncreasingArrays(
    false,
    57,
    [56],
    'text',
  );
  expect(arr).toEqual(
    [56],
  );
});

test('test combine one array in non-increasing order', () => {
  const arr = combineIncreasingArrays(
    [-40.5, 49.3, 493, 2.34, 5943, 695689.323, 0],
  );
  expect(arr).toEqual(
    [-40.5, 49.3, 493, 5943, 695689.323],
  );
});

test('test combine one array with non-numeric values', () => {
  const arr = combineIncreasingArrays(
    [4, false, 5.5, null, '7', 7.01],
  );
  expect(arr).toEqual(
    [4, 5.5, 7.01],
  );
});

test('test combine five arrays in non-increasing order', () => {
  const arr = combineIncreasingArrays(
    [4, 3, 2],
    [-3, 5, 7],
    [8, 6],
    [6.01, 6.02, 6.00999],
    [-3.001, 0, -0.01],
  );
  expect(arr).toEqual(
    [-3.001, -3, 0, 4, 5, 6.01, 6.02, 7, 8],
  );
});

test('test large t - values more than 1e308 get ignored', () => {
  const arr = combineIncreasingArrays(
    [1, 1.2e308],
    [4, 1.1e308],
  );
  expect(arr).toEqual(
    [1, 4],
  );
});

test('test three arrays l3 < l2 < l1', () => {
  const arr = combineIncreasingArrays(
    [1, 2, 3],
    [4, 5],
    [6],
  );
  expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
});

test('test three arrays l3 < l1 < l2', () => {
  const arr = combineIncreasingArrays(
    [4, 5],
    [1, 2, 3],
    [6],
  );
  expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
});

test('test three arrays l2 < l1 < l3', () => {
  const arr = combineIncreasingArrays(
    [4, 5],
    [6],
    [1, 2, 3],
  );
  expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
});

test('test four arrays', () => {
  const arr = combineIncreasingArrays(
    [-1, 4.5],
    [2, 5],
    [1, 4],
    [3, 6],
  );
  expect(arr).toEqual(
    [-1, 1, 2, 3, 4, 4.5, 5, 6],
  );
});
