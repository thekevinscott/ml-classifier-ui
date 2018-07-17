import * as React from 'react';
import styles from './styles.scss';

export interface IPrediction {
  prediction: string;
  label: string;
  src: string;
};

interface IProps {
  prediction: IPrediction;
}

const Prediction: React.SFC<IProps> = ({
  prediction: {
    src,
    prediction,
    label,
  },
}) => (
  <li>
    <img src={src} />
    <ul className={styles.info}>
      <li>Prediction: {prediction}</li>
      <li className={styles.label}>Label: {label}</li>
    </ul>
  </li>
);

export default Prediction;
