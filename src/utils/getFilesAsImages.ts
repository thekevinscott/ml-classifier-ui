export interface IFileData {
  label: string;
  src: string;
};

export interface IImageData {
  label: string;
  image: HTMLImageElement;
};

export const loadImage = async (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.src = src;
  image.onload = () => resolve(image);
  image.onerror = (err) => reject(err);
});

export const getFilesAsImageArray = async (files: FileList): Promise<IFileData[]> => {
  const classes = Object.keys(files);
  const images = [];
  for (let i = 0; i < classes.length; i++) {
    const label = classes[i];
    for (let j = 0; j < files[label].length; j++) {
      const image = files[label][j];
      images.push({
        label,
        src: image.src,
      });
    }
  }
  return images;
};

// const getFilesAsImages = async (files: FileList, callback?: Function): Promise<IImageData[]> => {
//   const filesArr = await getFilesAsImageArray(files);
//   const promisedImages = await Promise.all(filesArr.map(async (file: IFileData): Promise<IImageData | null> => {
//     try {
//       const image = file.src;
//       // const image = await loadImage(file.src);
//       if (callback) {
//         callback(image, file.label, filesArr);
//       }
//       return {
//         label: file.label,
//         image,
//       };
//     } catch(err) {
//       console.error(err);
//       return null;
//     }
//   }));

//   let legitFiles: IImageData[] = [];
//   for (let i = 0; i < promisedImages.length; i++) {
//     const promisedImage = promisedImages[i];
//     if (promisedImage !== null) {
//       legitFiles.push(promisedImage);
//     }
//   }
//   return legitFiles;
// };

export default getFilesAsImageArray;

export const splitImagesFromLabels = async (images: IFileData[]) => {
  const origData: {
    images: string[];
    labels: string[];
  } = {
    images: [],
    labels: [],
  };

  return images.reduce((data, {
    src,
    label,
  }: IFileData) => ({
    images: data.images.concat(src),
    labels: data.labels.concat(label),
  }), origData);
}
