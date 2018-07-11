import * as React from 'react';
import classNames from 'utils/classNames';
import styles from './styles.scss';
import loading from '../assets/loading.gif';
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

    const className = classNames(styles.container, {
      [styles.images]: images && images.length > 0,
    });
    return (
      <div className={className}>
        {image && (
          <img src={image.image.src} />
        )}
        <div className={styles.loader}>
          <img src={loading} />
          {status === 'uploading' && (<span>Reading images</span>)}
          {status === 'parsing' && (<span>{imagesParsed} images of {totalFiles} converted</span>)}
          {status === 'training' && (<span>Training {(images || []).length} images</span>)}
        </div>
      </div>
    );
  }
}

export default Preview;
