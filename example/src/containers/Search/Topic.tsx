import * as React from 'react';
import styles from './styles.scss';
import loading from './loading.gif';
import {
  IImgurImage,
} from './getImages';

const Topic = ({
  topic,
  images,
  picked,
  handlePicked,
  handleRemove,
}: {
  topic: string;
  images: IImgurImage[];
  picked: string[];
  handlePicked: (topic: string) => (id: string) => () => void;
  handleRemove: (topic: string) => (id: string) => () => void;
}) => (
  <div className={styles.images}>
    <div className={styles.carousel}>
      {images.length ? (
        <Images
          title={topic}
          images={images}
          picked={picked}
          handlePicked={handlePicked(topic)}
          handleRemove={handleRemove(topic)}
        />
      ) : (
        <img className={styles.loading} src={loading} />
      )}
    </div>
  </div>
);

const splitImages = (images: IImgurImage[], picked: string[]) => {
  const startingData: {
    pickedImages: IImgurImage[];
    unpickedImages: IImgurImage[];
  } = {
    pickedImages: [],
    unpickedImages: [],
  };
  return images.reduce(({
    pickedImages,
    unpickedImages,
  }, image: IImgurImage) => {
    if (picked.includes(image.id)) {
      return {
        unpickedImages,
        pickedImages: [
          ...pickedImages,
          image,
        ],
      };
    }

    return {
      pickedImages,
      unpickedImages: [
        ...unpickedImages,
        image,
      ],
    };
  }, startingData);
};

const Images = ({
  title,
  images,
  picked,
  handlePicked,
  handleRemove,
}: {
  title: string;
  images: IImgurImage[];
  picked: string[];
  handlePicked: (id: string) => () => void;
  handleRemove: (id: string) => () => void;
}) => {
  const {
    pickedImages,
    unpickedImages,
  } = splitImages(images, picked);

  const training = pickedImages.slice(0, 5);
  const validation = pickedImages.slice(5);

  return (
    <React.Fragment>
      <div className={styles.top}>
        <label>{title}</label>
        {training.length > 0 ? (
          <ImageSet
            handleRemove={handleRemove}
            images={training}
            title="Training"
          />
        ): null}
        {validation.length > 0 ? (
          <ImageSet
            handleRemove={handleRemove}
            images={validation}
            title="Validation"
          />
        ): null}
      </div>
      {pickedImages.length < 10 ? (
        <div className={styles.unpicked}>
          {unpickedImages.map((image: IImgurImage) => (
            <SearchImage
              src={image.link}
              key={image.id}
              handleClick={handlePicked(image.id)}
            />
          ))}
        </div>
      ) : <p>All done with these images!</p>}
    </React.Fragment>
  );
};

interface IImageSetProps {
  title: string;
  images: IImgurImage[];
  handleRemove: (id: string) => () => void;
}

interface IState {
  mounted: boolean;
}

class ImageSet extends React.Component<IImageSetProps> {
  public state: IState = {
    mounted: false,
  };

  public componentDidMount() {
    setTimeout(() => {
      this.setState({
        mounted: true,
      });
    }, 10);
  }

  public render() {
    const {
      images,
      title,
      handleRemove
    } = this.props;

    const className = `${styles.set} ${this.state.mounted ? styles.show : ''}`;

    return (
      <div className={className}>
        <label>{title} ({images.length}/5)</label>
        {images.map((image: IImgurImage) => (
          <SearchImage
            src={image.link}
            key={image.id}
          >
            <button onClick={handleRemove(image.id)}>&times;</button>
          </SearchImage>
        ))}
      </div>
    );
  }
}

const SearchImage = ({
  src,
  handleClick,
  children,
}: {
  src: string;
  handleClick?: () => void;
  children?: any;
}) => (
  <div className={styles.image} onClick={handleClick}>
    {children}
    <img src={src} />
  </div>
);

export default Topic;
