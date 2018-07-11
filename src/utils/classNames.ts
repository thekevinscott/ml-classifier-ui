interface IClassNameObject {
  [index:string]: boolean | undefined;
}

const arr: string[] = [];

type Name = string|IClassNameObject|undefined|null;

const transformObjToArr = (name: IClassNameObject) => Object.entries(name).filter(entry => entry[1]).map(([ key ]) => key);

const classNames = (...names: Name[]) => (names || []).reduce((arr, name: Name) => {
  if (!name) {
    return arr;
  }

  if (typeof name === 'string') {
    return arr.concat(name);
  }

  return arr.concat(transformObjToArr(name));
}, arr).join(' ');

export default classNames;
