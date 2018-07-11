import getFile from './getFile';

const readDir = async (dir: any, path: string) => new Promise(resolve => {
  const dirReader = dir.createReader();
  let items: any = [];
  dirReader.readEntries(async (entries: any) => {
    for (let i = 0; i <entries.length; i++) {
      const item = entries[i];
      if (item.isFile) {
        const file = await getFile(item, path);
        items.push(file);
      } else {
        const subImages = await traverseFileTree(item, path + item.name + "/");
        items = items.concat(subImages);
      }
    }

    return resolve(items);
  });
});

const traverseFileTree = async (item: any, path = "") => {
  return await readDir(item, path);
};

export default traverseFileTree;
