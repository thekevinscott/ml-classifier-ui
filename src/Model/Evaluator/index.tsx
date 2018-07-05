import * as React from 'react';
import Dropzone from '../../Dropzone';
import getFilesAsImages, {
  IFileData,
} from '../../utils/getFilesAsImages';
import Predictions from './Predictions';
import {
  IPrediction,
} from './Predictions/Prediction';

interface IProps {
  predict: Function;
}

interface IState {
  predictions: IPrediction[];
}

class Evaluator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      predictions: [],
    };
  }

  private onParseFiles = async (files: FileList) => {
    console.log('on parse test files');
    return getFilesAsImages(files, async (image: HTMLImageElement, label:string, files: IFileData[]) => {
      console.log(image);
      const prediction = await this.props.predict(image);
      console.log('incoming', prediction);
      this.setState({
        predictions: this.state.predictions.concat({
          prediction,
          label,
          image,
        }),
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <Dropzone
          onParseFiles={this.onParseFiles}
          style={{ borderRadius: '0 0 5px 5px', marginTop: '-2px', height: '300px' }}
        >Drop Images to test</Dropzone>
        <Predictions predictions={this.state.predictions} />
      </React.Fragment>
    );
  }
};

export default Evaluator;
