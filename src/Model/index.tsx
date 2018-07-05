import * as React from 'react';
import styled from 'styled-components';
import Evaluator from './Evaluator';
import Metrics from './Metrics';
import {
  IImageData,
} from '../utils/getFilesAsImages';

interface IProps {
  images: IImageData[];
  downloading: boolean;
  onDownload?: Function;
  predict?: Function;
}

interface IState {
}

const Container = styled.div `
  display: flex;
  flex-direction: column;
`;

class Model extends React.Component<IProps, IState> {
  render() {
    const {
      images,
      onDownload,
      downloading,
      predict,
    } = this.props;

    return (
      <Container>
        <Metrics
          images={images}
          onDownload={onDownload}
          downloading={downloading}
        />
        {predict && (
          <Evaluator predict={predict} />
        )}
      </Container>
    );
  }
}

export default Model;
