const clientID = '21211812267bd50';

interface IData {
  data: IImgurDatum[];
}

interface IImgurDatum {
  id: string;
  images: IImgurImage[];
}

export interface IImgurImage {
  id: string;
  link: string;
  size: number;
  width: number;
  height: number;
  gifv?: string;
  type: string;
}

const getImages = (q: string) => fetch(`https://api.imgur.com/3/gallery/search?q=${q}`, {
  headers: {
    Authorization: `Client-ID ${clientID}`,
  },
}).then(resp => resp.json()).then(({ data }: IData) => {
  const startingData: IImgurImage[] = [];
  const c = data.reduce((collectedImages, { images }) => {
    if (!images) {
      return collectedImages;
    }

    return collectedImages.concat(images);
  }, startingData);

  return c.filter((image: IImgurImage) => {
    return image && !image.gifv && [
      'image/jpeg',
      'image/png',
      'image/gif',
    ].includes(image.type);
  });
  // .map((image: IImgurImage) => image.link);
});

export default getImages;
