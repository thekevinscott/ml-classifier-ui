import * as React from 'react';
import styled, { StyledFunction } from "styled-components"
import Prediction, {
  IPrediction,
} from './Prediction';

interface ContainerProps {
  children?: any;
}

const ul: StyledFunction<ContainerProps & React.HTMLProps<HTMLInputElement>> = styled.ul;

const PredictionsContainer = ul `
  img {
    width: 100%;
    max-width: 300px;
    display: block;
  }
`;

interface IProps {
  predictions: IPrediction[];
}

const Predictions: React.SFC<IProps> = ({
  predictions,
}) => {
  return (
    <PredictionsContainer>
      {predictions.map((prediction: IPrediction, idx: number) => (
        <Prediction prediction={prediction} key={idx} />
      ))}
    </PredictionsContainer>
  );
};

export default Predictions;
