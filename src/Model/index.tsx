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
  evaluate: Function;
  accuracy: {
    training?: number;
    evaluation?: number;
  };
}

interface IState {
}

class Model extends React.Component<IProps, IState> {
  render() {
    const {
      images,
      onDownload,
      downloading,
      predict,
      evaluate,
      accuracy: {
        training,
        evaluation,
      },
    } = this.props;

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
        />
        {predict && (
          <Evaluator predict={predict} evaluate={evaluate} />
        )}
      </div>
    );
  }
}

export default Model;
