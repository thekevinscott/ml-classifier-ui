import * as React from 'react';
import styles from './styles.scss';

export interface IPrediction {
  prediction: string;
  label: string;
  image: HTMLImageElement;
};

interface IProps {
  prediction: IPrediction;
}

const Prediction: React.SFC<IProps> = ({
  prediction: {
    image,
    prediction,
    label,
  },
}) => (
  <li>
    <img src={image.src} />
    <ul className={styles.info}>
      <li>Prediction: {prediction}</li>
      <li>Label: {label}</li>
    </ul>
  </li>
);

export default Prediction;
