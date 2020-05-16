import isObject from 'is-object';


const isLinfun = (item) => {
  if (!isObject(item)) return false;
  return item.markAsLf === true;
};

export default isLinfun;
