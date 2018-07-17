import * as React from 'react';
import styles from './styles.scss';
import MLClassifierUI from 'mlClassifierUI';
import Search, {
  IImage,
} from '../Search';

// const loadImage = async (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
//   const image = new Image();
//   image.crossOrigin = 'anonymous';
//   image.src = src;
//   image.onload = () => resolve(image);
//   image.onerror = (err) => reject(err);
// });

// const transformImageToIntArray = (image: HTMLImageElement) => {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   if (context) {
//     context.drawImage(image, 0, 0);
//     // const data = context.getImageData(0, 0, image.width, image.height)
//     const data = context.getImageData(0, 0, 224, 224);
//     return data;
//   }

//   return null;
// };

const splitImagesFromLabels = async (images: IImage[]) => {
  const origData: {
    images: string[];
    labels: string[];
  } = {
    images: [],
    labels: [],
  };

  return images.reduce((data, image: IImage) => ({
    images: data.images.concat(image.imageSrc),
    labels: data.labels.concat(image.label),
  }), origData);
}

// DEPRECATED
// const getImagesAsDataAndLabels = async (images: IImage[]) => {
//   const imageData: any[] = [];
//   const labels: string[] = [];

//   for (let i = 0; i < images.length; i++) {
//     const {
//       image,
//       label,
//     } = images[i];
//     let img;
//     if (image instanceof HTMLImageElement) {
//       img = await loadImage(image.src);
//     } else {
//       img = await loadImage(image);
//     }
//     const data = transformImageToIntArray(img);
//     // if (data && data.data) {
//     imageData.push(data);
//     labels.push(label);
//     // }
//   }

//   return {
//     imageData,
//     labels,
//   };
// };

interface IState {
  training: boolean;
}

class App extends React.Component {
  public state: IState = {
    training: false,
  };

  private classifier:any;

  public getMLClassifier = (classifier: any) => {
    this.classifier = classifier;
  }

  public onBeginTraining = () => {
    this.setState({
      training: true,
    });
  }

  public train = async (trainImages: IImage[], evalImages: IImage[]) => {
    this.onBeginTraining();
    const {
      images,
      labels,
    } = await splitImagesFromLabels(trainImages);

    console.log('add data to classifier', images, labels);
    await this.classifier.addData(images, labels, 'train');
    // await this.classifier.train();
    // const {
    //   imageData: evalImageData,
    //   labels: evalLabels,
    // } = await getImagesAsDataAndLabels(evalImages);

    // return await this.classifier.addData(evalImageData, evalLabels, 'eval');
  }

  public render() {
    return (
      <React.Fragment>
        <div className={styles.info}>
          <p>Drag and drop some labeled images below to test it out.</p>
          <p>Organize your images into folders, where the folders' names are the desired labels.</p>
        </div>
        <div className={styles.app}>
          <MLClassifierUI
            getMLClassifier={this.getMLClassifier}
            onAddDataStart={this.onBeginTraining}
          />
        </div>
        {this.state.training === false && (
          <React.Fragment>
            <hr />
            <div className={styles.info}>
              <p>Don't have any images handy?</p>
              <p>Search below for some images. Select up to 10 that match your query.</p>
            </div>
            <Search
              train={this.train}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default App;
