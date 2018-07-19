import * as React from 'react';
import classNames from 'utils/classNames';
import styles from './styles.scss';
import Loading from '../Loading';
// import {
//   loadImage,
// } from 'utils/getFilesAsImages';
// const styles = require('./styles.scss');
// import {
//   IImageData,
// } from '../utils/getFilesAsImages';

interface IProps {
  images?: string[];
}

interface IState {
  imageIdx: number;
  // images: {
  //   [index:string]: HTMLImageElement | null;
  // };
}

const LOOP_SPEED = 75;

class Preview extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      imageIdx: 0,
      // images: { },
    };
  }

  private timeout: any;

  componentWillMount() {
    this.loopImages();
  }

  // componentWillReceiveProps(nextProps: IProps) {
  //   if ((this.props.images || []).length !== (nextProps.images || []).length) {
  //     (nextProps.images || []).map((src: string) => {
  //       if (this.state.images[src] === undefined) {
  //         console.log('load image', src);

  //         this.setState({
  //           images: {
  //             ...this.state.images,
  //             [src]: null,
  //           },
  //         });

  //         loadImage(src).then(image => {
  //           this.setState({
  //             images: {
  //               ...this.state.images,
  //               [src]: image,
  //             },
  //           });
  //         });
  //       }
  //     });
  //   }
  // }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private last: any;
  loopImages = () => {
    if (this.last) {
      const now = (new Date()).getTime();
      const diff = now - this.last;
      if (diff > LOOP_SPEED + 200) { // 200 ms wiggle room
        // TODO: this indicates a UI slowdown
        // console.log('diff', diff);
      }
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.setState({
      imageIdx: this.state.imageIdx + 1,
    });

    this.last = (new Date()).getTime();
    this.timeout = setTimeout(() => {
      this.loopImages();
    }, LOOP_SPEED);
  }

  render() {
    // const images = Object.values(this.state.images);
    const {
      images,
    } = this.props;

    const src = images && images[this.state.imageIdx % images.length];

    const className = classNames(styles.container, {
      [styles.images]: images && images.length > 0,
    });

    return (
      <div className={className}>
        {src ? (
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(${src})`,
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
