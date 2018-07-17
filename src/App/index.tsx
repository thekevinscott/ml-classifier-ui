import * as React from 'react';

import Dropzone from '../Dropzone';
import {
  getFilesAsImageArray,
  // loadImage,
  // IImageData,
  IFileData,
  splitImagesFromLabels,
} from 'utils/getFilesAsImages';

import {
  ITrainResult,
} from '../types';

import Model from '../Model';
import Preview from '../Preview';

import MLClassifier from 'ml-classifier';

import styles from './styles.scss';

export interface IImage {
  imageSrc: string;
  label: string;
}
interface IParams {
  [index: string]: any;
}

interface IState {
  status: string;
  images?: string[];
  labels: string[];
  downloading: boolean;
  predictions: {
    prediction: string;
    label: string;
  }[];
  logs: {
    [index: string]: any;
  };
  accuracy: {
    training?: number;
    evaluation?: number;
  };
}

// const prepareImages = async (images:IImageData[] = []) => {
//   const data: {
//     imageData: any[];
//     labels: string[];
//   } = {
//     imageData: [],
//     labels: [],
//   };

//   for (let i = 0; i < images.length; i++) {
//     const {
//       image,
//       label,
//     } = images[i];
//     data.labels.push(label);
//     data.imageData.push(image);
//   }

//   return data;
// };

interface IProps {
  params: {
    train?: IParams;
    evaluate?: IParams;
    save?: IParams;
  };
  onAddDataStart?: Function;
  getMLClassifier?: Function;
  uploadFormat: string;
  imagesFormats: string[];
}

// const transformIntArrayToImage = async(image: IImageData) => {
//   const canvas = document.createElement("canvas");
//   if (!canvas) {
//     throw new Error('No canvas was found. Are you in the browser?');
//   }

//   const data = canvas.toDataURL('image/png');
//   const img = await loadImage(data);
//   return img;
// };

class MLClassifierUI extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    params: { },
    uploadFormat: 'nested',
    imagesFormats: undefined,
  };

  private classifier: any;

  constructor(props: IProps) {
    super(props);

    this.state = {
      status: 'empty',
      images: undefined,
      downloading: false,
      predictions: [],
      logs: {},
      labels: [],
      accuracy: {
        training: undefined,
        evaluation: undefined,
      },
    };
  }

  componentDidMount() {
    console.log('yo');
    this.classifier = new MLClassifier({
      onAddDataStart: this.onAddDataStart,
      onAddDataComplete: this.onAddDataComplete,
    });

    if (this.props.getMLClassifier) {
      this.props.getMLClassifier(this.classifier);
    }
  }

  private onDrop = (files: FileList) => {
    this.setState({
      status: 'uploading',
    });

//     if (this.props.onBegin) {
//       this.props.onBegin();
//     }
  }

  private onAddDataStart = async (imageSrcs: string[], _labels: any, dataType: string) => {
    console.log('added data');
    this.setState({
      status: 'parsing'
    });

    if (this.props.onAddDataStart) {
      this.props.onAddDataStart();
    }

    if (dataType === 'train') {
      this.setState({
        status: 'training',
        images: imageSrcs,
      });
    }
  }

  private onParseFiles = async (files: FileList) => {
    console.log('incoming files, should turn into a flat array of src and label');
    const imageFiles: IFileData[] = await getFilesAsImageArray(files);

    const {
      images,
      labels,
    } = await splitImagesFromLabels(imageFiles);
    return this.classifier.addData(images, labels, 'train');
  }

  private onAddDataComplete = async (imageSrcs: string[], labels: string[], dataType: string) => {
    console.log('data has all been added');
    if (dataType === 'train') {
      // let images: Array<HTMLImageElement> = [];
      // for (let i = 0; i < imageData.length; i++) {
      //   const src = imageSrcs[i];
      //   const img = await loadImage(src);
      //   // const data = await transformIntArrayToImage(src);
      //   images.push(img);
      // }
      this.setState({
        status: 'training',
        images: imageSrcs,
        labels,
      });
      const train = this.props.params.train || {};
      const result: ITrainResult = await this.classifier.train({
        ...train,
        callbacks: {
          onBatchEnd: (batch: any, logs: any) => {
            if (train.callbacks && train.callbacks.onBatchEnd) {
              train.callbacks.onBatchEnd(batch, logs);
            }
            const loss = logs.loss.toFixed(5);
            // log(batch, logs);
            // log('Loss is: ' + logs.loss.toFixed(5));
            this.setState({
              logs: {
                ...this.state.logs,
                loss: (this.state.logs.loss || []).concat(loss),
              }
            });
          },
        },
      });

      const {
        history: {
          acc,
          // loss,
        },
      } = result;

      const training = acc[acc.length - 1];
      this.setState({
        status: 'trained',
        accuracy: {
          ...this.state.accuracy,
          training,
        },
      });
    }
  }

  // public evaluate = async (images:IImageData[] = []) => {
  //   const labels: string[] = [];
  //   const imageData = images.map((image) => {
  //     labels.push(image.label);
  //     return image.image;
  //   });

  //   await this.classifier.addData(imageData, labels, 'eval');
  //   const [
  //     one,
  //     accuracy,
  //   ] = await this.classifier.evaluate((this.props.params || {}).evaluate);
  // }

  public predict = async (image:HTMLImageElement, label:string) => {
    console.log('predict', image, label);
    const prediction = await this.classifier.predict(image);

    this.setState({
      predictions: this.state.predictions.concat({
        prediction,
        label,
      }),
    });

    return prediction;
  };

  handleDownload = async () => {
    this.setState({
      downloading: true,
    });
    await this.classifier.save((this.props.params || {}).save);
    this.setState({
      downloading: false,
    });
  };

  public render() {
    return (
      <div className={styles.classifier}>
        {this.state.status === 'empty' && (
          <Dropzone
            onDrop={this.onDrop}
            onParseFiles={this.onParseFiles}
          />
        )}
        {['training', 'uploading', 'parsing'].includes(this.state.status) && (
          <Preview
            images={this.state.images}
          />
        )}
        {this.state.status === 'trained' && this.state.images && (
          <Model
            logs={this.state.logs}
            labels={this.state.labels}
            downloading={this.state.downloading}
            onDownload={this.handleDownload}
            predict={this.predict}
            predictions={this.state.predictions}
            accuracy={this.state.accuracy}
          />
        )}
      </div>
    );
  }
}

export default MLClassifierUI;
