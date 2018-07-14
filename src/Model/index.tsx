import * as React from 'react';
import styles from './styles.scss';
// const styles = require('./styles.scss');
import Evaluator from './Evaluator';
import Metrics, { IDatum } from './Metrics';
import {
  IImageData,
} from '../utils/getFilesAsImages';

interface IProps {
  images: IImageData[];
  downloading: boolean;
  onDownload?: Function;
  predict?: Function;
  predictions: {
    prediction: string;
    label: string;
  }[];
  evaluate: Function;
  logs: {
    [index: string]: any;
  };
  accuracy: {
    training?: number;
    evaluation?: number;
  };
}

interface IState {
}

const getEvaluation = (predictions: any[]) => {
  if (predictions.length > 0) {
    return predictions.reduce((sum, {
      prediction,
      label,
    }) => sum + (prediction === label ? 1 : 0), 0) / predictions.length;
  }

  return null;
};

class Model extends React.Component<IProps, IState> {
  render() {
    const {
      images,
      onDownload,
      downloading,
      predict,
      evaluate,
      predictions,
      logs,
      accuracy: {
        training,
      },
    } = this.props;

    const evaluation = getEvaluation(predictions);

    const accuracy: IDatum[] = [{
      data: training ? `${training * 100}%` : '--',
      label: 'Training',
    }, {
      data: evaluation ? `${evaluation * 100}%` : '--',
      label: 'Evaluation',
    }];

    return (
      <div className={styles.container}>
        <Metrics
          images={images}
          onDownload={onDownload}
          downloading={downloading}
          accuracy={accuracy}
          logs={logs}
        />
        {predict && (
          <Evaluator predict={predict} evaluate={evaluate} />
        )}
      </div>
    );
  }
}

export default Model;
