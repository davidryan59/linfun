/* eslint-disable no-console */

import { Linfun, isLinfun } from '../src';

console.log('');
console.log('***** Running Linfun examples *****');
console.log('');
console.log(`new Linfun(): ${new Linfun()}`);
console.log(`new Linfun([[1, 2], [3, -4.0000232]]): ${new Linfun([[1, 2], [3, -4.0000232]])}`);
console.log('');
console.log(`isLinfun(new Linfun()): ${isLinfun(new Linfun())}`);
console.log('');
console.log('');


// import { Linfun, isLinfun } from 'linfun'
const lf = new Linfun([
  [1, 2],
  [3, 4],
]);
console.log(lf); // true
console.log(isLinfun(lf)); // true
