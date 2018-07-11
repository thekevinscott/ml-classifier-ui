import * as React from 'react';
import styles from './styles.scss';
import Prediction, {
  IPrediction,
} from './Prediction';

interface IProps {
  predictions: IPrediction[];
}

const Predictions: React.SFC<IProps> = ({
  predictions,
}) => {
  return (
    <ul className={styles.container}>
      {predictions.map((prediction: IPrediction, idx: number) => (
        <Prediction prediction={prediction} key={idx} />
      ))}
    </ul>
  );
};

export default Predictions;
