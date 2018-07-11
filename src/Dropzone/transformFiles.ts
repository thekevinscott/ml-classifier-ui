import * as React from 'react';
import traverseFileTree from './traverseFileTree';

const transformFiles = async (e: React.DragEvent) => {
  const d = e.dataTransfer || {};
  const items = d.items || [];
  let images: any = [];
  for (let i=0; i<items.length; i++) {
    // webkitGetAsEntry is where the magic happens
    const item: any = items[i].webkitGetAsEntry();
    if (item) {
      const folder = await traverseFileTree(item);
      images = images.concat(folder);
    }
  }
  const folders = images.reduce((allImages: any, image: any) => {
    if (image.path) {
      return {
        ...allImages,
        [image.path]: (allImages[image.path] || []).concat(image),
      };
    }

    return allImages;
  }, {});
  return folders;
};

export default transformFiles;
