import * as React from 'react';
import styled from 'styled-components';
import Info, {
  IDatum,
} from './Info';
import {
  IImageData,
} from '../../utils/getFilesAsImages';

interface IProps {
  images?: IImageData[];
  downloading: boolean;
  onDownload?: Function;
  accuracy: IDatum[];
}

interface IState {
}

const Container = styled.div `
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  background: rgba(0,13,51,0.6);
  padding: 20px;
  color: rgba(255,255,255,0.8);
  font-size: 20px;
  display: flex;
  flex-direction: column;

  button {
    width: 120px;
    height: 40px;
    border: none;
    border-radius: 5px;
  }
`;

const Footer = styled.div `
  flex: 1;
  display: flex;
  align-items: flex-end;
`;

const Logs = styled.div `
  flex: 1;
`;

interface IData {
  label: string;
}

const getData = (images: IData[] = []) => {
  const numOfImages = images.reduce((obj, image) => ({
    ...obj,
    [image.label]: (obj[image.label] || 0) + 1,
  }), {});

  return Object.keys(numOfImages).map((label) => {
    return {
      label,
      data: numOfImages[label],
    };
  });
};

class Metrics extends React.Component<IProps, IState> {
  render() {
    const {
      images,
      onDownload,
      downloading,
      accuracy,
    } = this.props;

    return (
      <Container>
        <Info
          title="Data"
          data={getData(images)}
        />
        <Info
          title="Accuracy"
          data={accuracy}
        />
        <Footer>
          <Logs>
            logs
          </Logs>
          {onDownload && (
            <button
              disabled={downloading}
              onClick={() => onDownload()}
            >
              Download
            </button>
          )}
        </Footer>
      </Container>
    );
  }
}

export default Metrics;

export { IMetricsInfoProps, IDatum } from './Info';
