import * as React from 'react';
import styled from 'styled-components';

const Info = styled.ul `
  border-radius: 0 0 5px 5px;
  background: rgba(0,13,51,0.6);
  padding: 10px !important;
  display: flex;
  color: rgba(255,255,255,0.8);
  flex: 1;
  margin-bottom: 20px !important;

  &:last-child {
    text-align: right;
  }
`;

const Datum = styled.li `
`;

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
    <Info>
      <Datum>Prediction: {prediction}</Datum>
      <Datum>Label: {label}</Datum>
    </Info>
  </li>
);

export default Prediction;
