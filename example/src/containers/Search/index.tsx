import * as React from 'react';
import styles from './styles.scss';
import getImages, {
  IImgurImage,
} from './getImages';
import Topic from './Topic';

interface IProps {
  train: (images: IImage[], evalImages: IImage[]) => {};
}

export interface IImage {
  imageSrc: string;
  label: string;
}

interface IState {
  value: string;
  topics: string[];
  searches: {
    [index: string]: IImgurImage[];
  }
  picked: {
    [index: string]: string[];
  }
}

class Search extends React.Component<IProps, IState> {
  public state: IState = {
    value: '',
    topics: [],
    searches: { },
    picked: { },
  };

  public handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = this.state.value;
      this.setState({
        topics: [
          ...this.state.topics,
          value,
        ],
        searches: {
          [value]: [],
          ...this.state.searches,
        },
        picked: {
          [value]: [],
          ...this.state.picked,
        },
        value: '',
      });
      getImages(this.state.value).then(images => {
        this.setState({
          searches: {
            ...this.state.searches,
            [value]: images,
          },
        });
      });
    } else if (e.key === 'Backspace' && this.state.value === '' && this.state.topics.length > 0) {
      this.setState({
        topics: this.state.topics.slice(0, -1),
      });
    }
  }

  public handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  };

  public train = (e:React.MouseEvent<HTMLElement>) => {

    const images = transformImages(this.state.picked, this.state.searches, 0, 5);
    const evalImages = transformImages(this.state.picked, this.state.searches, 5, 10);
    console.log(images);

    this.props.train(images, evalImages);
  }

  public componentDidMount() {
    this.props.train([{
      label: 'dog',
      imageSrc: 'https://i.imgur.com/ALmkDwN.jpg',
    }, {
      label: 'cat',
      imageSrc: 'https://i.imgur.com/40QdFBf.jpg',
    }], []);
  }

  public handleRemoveTopic = (idx: number) => (e:React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    this.setState({
      topics: this.state.topics.reduce((topics: string[], topic, topicId) => {
        if (topicId === idx) {
          return topics;
        }

        return topics.concat(topic);
      }, []),
    });
  }

  public handleSelectTopicImage = (topic: string) => (id: string) => () => {
    if (this.state.picked[topic].length < 10) {
      this.setState({
        picked: {
          ...this.state.picked,
          [topic]: (this.state.picked[topic] || []).concat(id),
        },
      });
    }
  }

  public handleRemoveTopicImage = (topic: string) => (id: string) => () => {
    this.setState({
      picked: {
        ...this.state.picked,
        [topic]: (this.state.picked[topic] || []).reduce((pickeds: string[], picked) => {
          if (picked === id) {
            return pickeds;
          }

          return pickeds.concat(picked);
        }, []),
      },
    });
  }

  public render() {
    const disabled = this.state.topics.length < 2;
    return (
      <div className={styles.search}>
        <div className={styles.input}>
          {this.state.topics.map((topic, idx) => (
            <div key={topic} className={styles.topic}>
              <button onClick={this.handleRemoveTopic(idx)}>&times;</button>
              <span>{topic}</span>
            </div>
          ))}
          <input
            type="text"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            value={this.state.value}
            placeholder="Search for some images"
          />
          <small>Search provided by Imgur</small>
        </div>
        {this.state.topics.map((topic, key) => (
          <Topic
            key={key}
            topic={topic}
            images={this.state.searches[topic] || []}
            handlePicked={this.handleSelectTopicImage}
            handleRemove={this.handleRemoveTopicImage}
            picked={this.state.picked[topic] || []}
          />
        ))}
        <button
          disabled={disabled}
          onClick={this.train}
          className={styles.trainModel}
        >
          Train the Model
        </button>
      </div>
    );
  }
}

const transformImages = (
  picked: { [index: string]: string[] },
  searches: { [index: string]: IImgurImage[]},
  start: number,
  end?: number
) => {
  const originalData: Array<{
    imageSrc: string;
    label: string;
  }> = [];

  return Object.entries(picked).reduce((collected, [label, pickedImages]) => {
    return collected.concat(pickedImages.slice(start, end).map((imageId: string) => {
      const image = searches[label].filter(({ id }: IImgurImage) => id === imageId)[0];

      return {
        imageSrc: image.link,
        label,
      };
    }));
  }, originalData);
}

export default Search;
