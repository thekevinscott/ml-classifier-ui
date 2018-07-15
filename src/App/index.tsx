import * as React from 'react';
import * as tf from '@tensorflow/tfjs';

import Dropzone from '../Dropzone';
import getFilesAsImages, {
  IImageData,
  // IFileData,
} from 'utils/getFilesAsImages';

import Model from '../Model';
import Preview from '../Preview';

import MLClassifier, {
  // DataType,
} from 'ml-classifier';
enum DataType {
  TRAIN = "train",
  EVAL = "eval",
};

import styles from './styles.scss';

interface IParams {
  [index: string]: any;
}

interface IState {
  status: string;
  images?: IImageData[];
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

const getImagesAsTensors = async (images:IImageData[] = []) => {
  const data: {
    imageData: any[];
    labels: string[];
  } = {
    imageData: [],
    labels: [],
  };

  for (let i = 0; i < images.length; i++) {
    const {
      image,
      label,
    } = images[i];
    const pixelData = tf.fromPixels(image);
    data.labels.push(label);
    data.imageData.push(pixelData);
    await tf.nextFrame();
  }

  return data;
};

interface IProps {
  params: {
    train?: IParams;
    evaluate?: IParams;
    save?: IParams;
  };
  getMLClassifier?: Function;
  uploadFormat: string;
  imagesFormats: string[];
}

interface ITrainResult {
  epoch: number[];
  history: {
    acc: number[];
    loss: number[];
  };
  model: any;
  params: any;
  validationData: any;
}

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
      accuracy: {
        training: undefined,
        evaluation: undefined,
      },
    };
  }

  componentDidMount() {
    this.classifier = new MLClassifier();
    if (this.props.getMLClassifier) {
      this.props.getMLClassifier(this.classifier);
    }
  }

  private onDrop = (files: FileList) => {
    this.setState({
      status: 'uploading',
    });
  }

  private onParseFiles = (files: FileList) => {
    this.setState({
      status: 'parsing'
    });

    // const callback = (image: HTMLImageElement, label: string, files: IFileData[]) => {
    //   // this.setState({
    //   //   imagesParsed: this.state.imagesParsed + 1,
    //   //   totalFiles: files.length,
    //   // });
    // };

    return getFilesAsImages(files).then(images => {
      this.setState({
        status: 'training',
        images,
      });

      this.train(images);

      return images;
    });
  }

  private train = async (images:IImageData[] = []) => {
    const {
      imageData,
      labels,
    } = await getImagesAsTensors(images);
    const train = this.props.params.train || {};
    // const labels: string[] = [];
    return this.classifier.addData(imageData, labels, DataType.TRAIN).then(() => {
      return this.classifier.train({
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
    }).then((result: ITrainResult) => {
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
    });
  }

  public evaluate = async (images:IImageData[] = []) => {
    const labels: string[] = [];
    const imageData = images.map((image) => {
      const data = this.convertImageToTensor(image.image);
      labels.push(image.label);
      return data;
    });

    await this.classifier.addData(imageData, labels, DataType.EVAL);
    const [
      one,
      accuracy,
    ] = await this.classifier.evaluate((this.props.params || {}).evaluate);
  }

  public predict = async (image:HTMLImageElement, label:string) => {
    const data = this.convertImageToTensor(image);
    const prediction = await this.classifier.predict(data);

    this.setState({
      predictions: this.state.predictions.concat({
        prediction,
        label,
      }),
    });

    return prediction;
  };

  private convertImageToTensor = (image: HTMLImageElement) => {
    return tf.fromPixels(image);
  }

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
            images={this.state.images}
            downloading={this.state.downloading}
            onDownload={this.handleDownload}
            predict={this.predict}
            predictions={this.state.predictions}
            evaluate={this.evaluate}
            accuracy={this.state.accuracy}
          />
        )}
      </div>
    );
  }
}

export default MLClassifierUI;
