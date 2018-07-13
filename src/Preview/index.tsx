import * as React from 'react';
import classNames from 'utils/classNames';
import styles from './styles.scss';
import Loading from '../Loading';
// const styles = require('./styles.scss');
import {
  IImageData,
} from '../utils/getFilesAsImages';

interface IProps {
  images?: IImageData[];
}

interface IState {
  imageIdx: number;
}

const LOOP_SPEED = 150;

class Preview extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      imageIdx: 0,
    };
  }

  private timeout: any;

  componentWillMount() {
    this.loopImages();
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
    } = this.props;

    const image = images && images[this.state.imageIdx % images.length];

    const className = classNames(styles.container, {
      [styles.images]: images && images.length > 0,
    });
    console.log(image && image.image && image.image.src);
    return (
      <div className={className}>
        {image ? (
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(${image.image.src})`,
            }}
          />
        ) : (
          <div className={styles.loader}>
            <Loading />
            <span>Reading images</span>
          </div>
        )}
      </div>
    );
  }
}

export default Preview;
