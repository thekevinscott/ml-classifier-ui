import * as React from 'react';
import styled from 'styled-components';
import Dropzone from './Dropzone';
import Model from './Model';
import MLClassifier, {
  DataType,
} from 'ml-classifier';
import getFilesAsImages, {
  IImageData,
  IFileData,
} from './utils/getFilesAsImages';
import Preview from './Preview';

const Classifier = styled.div `
  max-width: 300px;
  background: white;
  height: 300px;

  * {
    box-sizing: border-box;
  }

  h1,h2,h3,h4,h5,h6 {
    font-weight: inherit;
  }

  button {
    cursor: pointer;
  }

  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

interface IProps {
}

interface IState {
  status: string;
  images?: IImageData[];
  imagesParsed: number;
  totalFiles: number;
  downloading: boolean;
  accuracy: {
    training?: number;
    evaluation?: number;
  };
}

class MLClassifierUI extends React.Component<IProps, IState> {
  private classifier: any;

  constructor(props: IProps) {
    super(props);

    this.state = {
      status: 'empty',
      images: undefined,
      downloading: false,
      imagesParsed: 0,
      totalFiles: 0,
      accuracy: {
        training: undefined,
        evaluation: undefined,
      },
    };
  }

  componentDidMount() {
    this.classifier = new MLClassifier();
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

    return getFilesAsImages(files, (image: HTMLImageElement, label: string, files: IFileData[]) => {
      this.setState({
        imagesParsed: this.state.imagesParsed + 1,
        totalFiles: files.length,
      });
    }).then(images => {
      this.setState({
        status: 'training',
        images,
      });

      return this.train(images);
    });
  }

  private train = async (images:IImageData[] = []) => {
    // const labels: string[] = [];
    const {
      imageData,
      labels,
    } = images.reduce(({
      imageData,
      labels,
    }: {
      imageData: any[];
      labels: string[];
    }, {
      image,
      label,
    }) => {
      const data = this.classifier.tf.fromPixels(image);
      return {
        imageData: imageData.concat(data),
        labels: labels.concat(label),
      };
    }, {
      imageData: [],
      labels: [],
    });
    // const imageData = await Promise.all(images.map(async (image) => {
    //   const data = await this.classifier.tf.fromPixels(image.image);
    //   // const data = await this.classifier.tf.fromPixels(image.image).data();
    //   return {
    //     label: image.label,
    //     data,
    //   };
    // }));

    await this.classifier.addData(imageData, labels, DataType.TRAIN);
    const {
      history: {
        acc,
      },
    } = await this.classifier.train({
      validationSplit: 0.2,
      callbacks: {
        onTrainEnd: () => {
          this.setState({
            status: 'trained',
          });
        },
        onBatchEnd: (batch: any, logs: any) => {
          // console.log(batch, logs);
          console.log('Loss is: ' + logs.loss.toFixed(5));
        },
      },
    });
    const training = acc[acc.length - 1];
    console.log('training', training);
    this.setState({
      accuracy: {
        ...this.state.accuracy,
        training,
      },
    });
  }

  public evaluate = async (images:IImageData[] = []) => {
    const labels: string[] = [];
    const imageData = images.map((image) => {
      const data = this.classifier.tf.fromPixels(image.image);
      labels.push(image.label);
      return data;
    });

    await this.classifier.addData(imageData, labels, DataType.EVAL);
    const [
      one,
      accuracy,
    ] = await this.classifier.evaluate();
    console.log('results', one, accuracy);
  }
  public predict = async (image:HTMLImageElement) => {
    const data = this.classifier.tf.fromPixels(image);
    const {
      history: {
        acc,
      },
    } = await this.classifier.predict(data);

    this.setState({
      accuracy: {
        ...this.state.accuracy,
        evaluation: acc[acc.length - 1],
      },
    });
  };

  handleDownload = async () => {
    this.setState({
      downloading: true,
    });
    await this.classifier.save();
    this.setState({
      downloading: false,
    });
  };

  public render() {
    return (
      <Classifier>
        {this.state.status === 'empty' && (
          <Dropzone
            onDrop={this.onDrop}
            onParseFiles={this.onParseFiles}
          />
        )}
        {['training', 'uploading', 'parsing'].includes(this.state.status) && (
          <Preview
            status={this.state.status}
            images={this.state.images}
            imagesParsed={this.state.imagesParsed}
            totalFiles={this.state.totalFiles}
          />
        )}
        {this.state.status === 'trained' && this.state.images && (
          <Model
            images={this.state.images}
            downloading={this.state.downloading}
            onDownload={this.handleDownload}
            predict={this.predict}
            evaluate={this.evaluate}
            accuracy={this.state.accuracy}
          />
        )}
      </Classifier>
    );
  }
}

export default MLClassifierUI;
