import * as React from 'react';
import styles from './styles.scss';
import MLClassifierUI from 'mlClassifierUI';
import Search, {
  IImage,
} from '../Search';

const CORS_BYPASS = 'https://fast-cove-30289.herokuapp.com/';

const qs: {
  SHOW_HELP?: string;
} = (window.location.search.split('?').pop() || '').split('&').filter(p => p).map(p => p.split('=')).reduce((obj, [key, val]) => ({
  ...obj,
  [key]: (val === "1" || val === "true") ? true : false,
}), {});

const SHOW_HELP = qs.SHOW_HELP !== undefined ? qs.SHOW_HELP : true;

if (SHOW_HELP === true) {
  document.body.innerHTML += `<a href="https://github.com/thekevinscott/ml-classifier-ui" id="github-corner" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`;
}

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
                Drag and drop some labeled images below to begin training your classifier. <a href="https://thekevinscott.com/download-image-datasets-for-image-classification/">You can download image datasets here.</a>
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
