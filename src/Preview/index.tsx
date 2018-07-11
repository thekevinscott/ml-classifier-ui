import * as React from 'react';
import styled, { StyledFunction } from "styled-components"
import { ClipLoader } from 'react-spinners';
import {
  IImageData,
} from '../utils/getFilesAsImages';

interface IProps {
  images?: IImageData[];
  status: string;
  imagesParsed: number;
  totalFiles: number;
}

interface IState {
  imageIdx: number;
}

interface ContainerProps {
  images?: any;
}

const div: StyledFunction<ContainerProps & React.HTMLProps<HTMLInputElement>> = styled.div;
const Container = div `
  border-radius: 5px;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 2px dashed ${props => props.images ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.2)'};

  img, canvas {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

const Loader = styled.div `
  opacity: 0.2;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const LOOP_SPEED = 100;

class Preview extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      imageIdx: 0,
    };
  }

  private timeout: any;

  componentWillReceiveProps(nextProps: IProps) {
    if (!this.props.images && nextProps.images) {
      this.loopImages();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  loopImages = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.setState({
      imageIdx: this.state.imageIdx + 1,
    });

    this.timeout = setTimeout(() => {
      this.loopImages();
    }, LOOP_SPEED);
  }

  render() {
    const {
      images,
      status,
      imagesParsed,
      totalFiles,
    } = this.props;

    const image = images && images[this.state.imageIdx % images.length];
    return (
      <Container images={images}>
        {image && (
          <img src={image.image.src} />
        )}
        <Loader>
          <ClipLoader />
          {status === 'uploading' && (<span>Reading images</span>)}
          {status === 'parsing' && (<span>{imagesParsed} images of {totalFiles} converted</span>)}
          {status === 'training' && (<span>Training {(images || []).length} images</span>)}
        </Loader>
      </Container>
    );
  }
}

export default Preview;
