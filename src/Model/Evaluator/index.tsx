import * as React from 'react';
import Dropzone from '../../Dropzone';
import {
  IFileData,
  getFilesAsImageArray,
} from '../../utils/getFilesAsImages';
import Predictions from './Predictions';
import {
  IPrediction,
} from './Predictions/Prediction';

interface IProps {
  predict: Function;
}

interface IState {
  imagesParsed: number;
  totalFiles: number;
  predictions: IPrediction[];
}

class Evaluator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      imagesParsed: 0,
      predictions: [],
      totalFiles: 0,
    };
  }

  private onParseFiles = async (files: FileList) => {

    const imageFiles: IFileData[] = await getFilesAsImageArray(files);
    for (let i = 0; i < imageFiles.length; i++) {
      const {
        src,
        label,
      } = imageFiles[i];

      const prediction = await this.props.predict(src, label);
      this.setState({
        predictions: this.state.predictions.concat({
          prediction,
          label,
          src,
        }),
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Dropzone
          onParseFiles={this.onParseFiles}
          style={{ borderRadius: '0 0 5px 5px', marginTop: '-2px', height: '300px' }}
        >
          Drop Images to test</Dropzone>
        <Predictions predictions={this.state.predictions} />
      </React.Fragment>
    );
  }
};

export default Evaluator;
