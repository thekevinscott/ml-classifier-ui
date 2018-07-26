import * as React from 'react';
import styles from './styles.scss';
import MLClassifierUI from 'mlClassifierUI';
import Search, {
  IImage,
} from '../Search';

const CORS_BYPASS = 'https://fast-cove-30289.herokuapp.com/';

const SHOW_HELP = true;

const splitImagesFromLabels = async (images: IImage[]) => {
  const origData: {
    images: string[];
    labels: string[];
  } = {
    images: [],
    labels: [],
  };

  return images.reduce((data, image: IImage) => ({
    images: data.images.concat(`${CORS_BYPASS}${image.src}`),
    // images: data.images.concat(`${image.src}`),
    labels: data.labels.concat(image.label),
  }), origData);
}

interface IState {
  training: boolean;
  evalImages?: IImage[];
}

class App extends React.Component {
  public state: IState = {
    training: false,
    evalImages: undefined,
  };

  private classifier:any;

  public getMLClassifier = (classifier: any) => {
    this.classifier = classifier;
  }

  public onBeginTraining = () => {
    this.setState({
      training: true,
    });
  }

  public train = async (trainImages: IImage[], evalImages?: IImage[]) => {
    this.onBeginTraining();
    const {
      images,
      labels,
    } = await splitImagesFromLabels(trainImages);

    this.setState({
      evalImages,
    });

    await this.classifier.addData(images, labels, 'train');
  }

  public onTrainComplete = async () => {
    if (this.state.evalImages && this.state.evalImages.length) {
      const {
        images,
        labels,
      } = await splitImagesFromLabels(this.state.evalImages);

      for (let i = 0; i < images.length; i++) {
        const src = images[i];
        const label = labels[i];

        this.classifier.predict(src, label);

        // const prediction = await this.predictSingleImage(src, label);
        // callback({
        //   src,
        //   label,
        //   prediction,
        // });
      }

      // return await this.classifier.addData(images, labels, 'eval');
    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className={styles.classifierContainer}>
          <div className={styles.app}>
            <MLClassifierUI
              getMLClassifier={this.getMLClassifier}
              onAddDataStart={this.onBeginTraining}
              onTrainComplete={this.onTrainComplete}
            />
          </div>
          {SHOW_HELP && this.state.training === false && (
            <div className={styles.info}>
              <h2>Instructions</h2>
              <p>
                Drag and drop some labeled images below to begin training your classifier.
                <a href="https://thekevinscott.com/download-image-datasets-for-image-classification/">You can download image datasets here.</a>
            </p>
              <p><em>Organize your images into folders, where the folders' names are the desired labels.</em></p>
              <div className={styles.imgContainer}>
                <a target="_blank" href="https://github.com/thekevinscott/ml-classifier-ui/raw/master/example/public/example.gif">
                  <img src="https://github.com/thekevinscott/ml-classifier-ui/raw/master/example/public/example-600.gif" />
                </a>
              </div>
            </div>
          )}
        </div>
        {SHOW_HELP && this.state.training === false && (
          <React.Fragment>
            <hr />
            <div className={styles.info}>
              <p>Don't have any images handy? Search below for some images. Select up to 10 that match your query.</p>
              <p><em><strong>Note</strong> This can be a little buggy at the moment due to CORS issues. Working on making it better!</em></p>
            </div>
            <Search
              train={this.train}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default App;
