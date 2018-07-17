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

import Model, { ImageError } from '../Model';
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
  files: any[];
  labels: string[];
  downloading: boolean;
  predictions: {
    src: string;
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
  errors?: ImageError[];
}

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
      errors: [],
      files: [],
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
    this.classifier = new MLClassifier({
      onAddDataStart: this.onAddDataStart,
      onAddDataComplete: this.onAddDataComplete,
      onPredictComplete: this.onPredictComplete,
    });

    if (this.props.getMLClassifier) {
      this.props.getMLClassifier(this.classifier);
    }
  }

  private onDrop = (files: FileList) => {
    this.setState({
      status: 'uploading',
    });
  }

  private onAddDataStart = async (imageSrcs: string[], _labels: any, dataType: string) => {
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

  private onParseFiles = async (origFiles: FileList) => {
    const imageFiles: IFileData[] = await getFilesAsImageArray(origFiles);

    const {
      images,
      labels,
      files,
    } = await splitImagesFromLabels(imageFiles);

    this.setState({
      files,
    });

    return this.classifier.addData(images, labels, 'train');
  }

  private onAddDataComplete = async (imageSrcs: string[], labels: string[], dataType: string, errors?: ImageError[]) => {
    if (dataType === 'train') {
      this.setState({
        status: 'training',
        images: imageSrcs,
        labels,
        errors: (errors || []).map((error: ImageError) => {
          return {
            ...error,
            file: this.state.files[error.index],
          };
        }),
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

  public onPredictComplete = async (src: string, label: string, pred: string | number) => {
    const prediction = `${pred}`;

    this.setState({
      predictions: this.state.predictions.concat({
        src,
        prediction,
        label,
      }),
    });
  }

  public predict = async (imageFiles: IFileData[]) => {
    for (let i = 0; i < imageFiles.length; i++) {
      const {
        src,
        label,
      } = imageFiles[i];

      await this.classifier.predict(src, label);
    }
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
            errors={this.state.errors}
          />
        )}
      </div>
    );
  }
}

export default MLClassifierUI;
