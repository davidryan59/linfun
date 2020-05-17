import Linfun from '../src/Linfun';
import isLinfun from '../src/isLinfun';

test('', () => expect(isLinfun()).toBeFalsy());
test('', () => expect(isLinfun(4)).toBeFalsy());
test('', () => expect(isLinfun(true)).toBeFalsy());
test('', () => expect(isLinfun('string')).toBeFalsy());
test('', () => expect(isLinfun(['array'])).toBeFalsy());
test('', () => expect(isLinfun({ an: 'object' })).toBeFalsy());
test('', () => expect(isLinfun(() => 'a function')).toBeFalsy());
test('', () => expect(isLinfun({ markAsLf: 'true' })).toBeFalsy());

test('', () => expect(isLinfun({ markAsLf: true })).toBeTruthy()); // Only truthy by hacking!

test('', () => expect(isLinfun(new Linfun())).toBeTruthy());
test('', () => expect(isLinfun(new Linfun('string'))).toBeTruthy());
test('', () => expect(isLinfun(new Linfun([]))).toBeTruthy());
test('', () => expect(isLinfun(new Linfun([[1, 2]]))).toBeTruthy());
test('', () => expect(isLinfun(new Linfun([[1, 2], [-3.29, 30239.33221]]))).toBeTruthy());
