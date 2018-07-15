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
  evaluate: Function;
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

    return getFilesAsImages(files, async (image: HTMLImageElement, label: string, files: IFileData[]) => {
      // this.setState({
      //   imagesParsed: this.state.imagesParsed + 1,
      //   totalFiles: files.length,
      // });
      const prediction = await this.props.predict(image, label);
      this.setState({
        predictions: this.state.predictions.concat({
          prediction,
          label,
          image,
        }),
      });
    // }).then(images => {
      // this.props.evaluate(images);
    });
    /*
    const images = await getFilesAsImages(files, async (image: HTMLImageElement, label:string, files: IFileData[]) => {
      return {
      };
    });
    this.props.evaluate(images);
    // return images;
     */
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
