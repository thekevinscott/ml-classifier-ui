export interface IFileData {
  label: string;
  file: any;
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
      const file = files[label][j];
      images.push({
        label,
        src: file.src,
        file,
      });
    }
  }
  return images;
};

export default getFilesAsImageArray;

export const splitImagesFromLabels = async (images: IFileData[]) => {
  const origData: {
    images: string[];
    labels: string[];
    files: any[];
  } = {
    images: [],
    labels: [],
    files: [],
  };

  return images.reduce((data, {
    src,
    label,
    file,
  }: IFileData) => ({
    images: data.images.concat(src),
    labels: data.labels.concat(label),
    files: data.files.concat(file),
  }), origData);
}
