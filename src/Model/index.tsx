import * as React from 'react';
import styles from './styles.scss';
// const styles = require('./styles.scss');
import Evaluator from './Evaluator';
import Metrics, {
  IDatum,
  ImageError,
} from './Metrics';
import {
  IPrediction,
} from './Evaluator/Predictions/Prediction';
// import {
//   IImageData,
// } from '../utils/getFilesAsImages';

interface IProps {
  labels: string[];
  downloading: boolean;
  onDownload?: Function;
  predict?: Function;
  predictions: IPrediction[];
  errors?: ImageError[];
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
      labels,
      onDownload,
      downloading,
      predict,
      predictions,
      logs,
      accuracy: {
        training,
      },
      errors,
    } = this.props;

    const evaluation = getEvaluation(predictions);

    const accuracy: IDatum[] = [{
      data: training ? `${Math.round(training * 100)}%` : '--',
      label: 'Training',
    }, {
      data: evaluation ? `${Math.round(evaluation * 100)}%` : '--',
      label: 'Evaluation',
    }];

    return (
      <div className={styles.container}>
        <Metrics
          labels={labels}
          onDownload={onDownload}
          downloading={downloading}
          accuracy={accuracy}
          logs={logs}
          errors={errors}
        />
        {predict && (
          <Evaluator
            predict={predict}
            predictions={predictions}
          />
        )}
      </div>
    );
  }
}

export default Model;

export { ImageError } from './Metrics';
