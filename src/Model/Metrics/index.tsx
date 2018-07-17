import * as React from 'react';
import styles from './styles.scss';
import Info, {
  IDatum,
} from './Info';
// import {
//   IImageData,
// } from 'utils/getFilesAsImages';
import Logs from './Logs';
export interface ImageError {
  image: any;
  error: Error;
  file?: any;
  index: number;
}

interface IProps {
  labels?: string[];
  downloading: boolean;
  onDownload?: Function;
  errors?: ImageError[];
  logs: {
    [index: string]: any;
  };
  accuracy: IDatum[];
}

// interface IData {
//   label: string;
// }

const getData = (labels: string[] = []) => {
  const numOfLabels = labels.reduce((obj, label) => ({
    ...obj,
    [label]: (obj[label] || 0) + 1,
  }), {});

  return Object.keys(numOfLabels).map((label) => {
    return {
      label,
      data: numOfLabels[label],
    };
  });
};

const getErrors = (errors: ImageError[] = []) => errors.map(({ file }, key) => (
  <p key={key} className={styles.error}>
    Error loading image: {`${file.path}/${file.file.name}`}
  </p>
));

class Metrics extends React.Component<IProps> {
  render() {
    const {
      labels,
      onDownload,
      downloading,
      accuracy,
      logs,
      errors,
    } = this.props;

    return (
      <div className={styles.container}>
        <Info
          title="Data"
          data={getData(labels)}
        />
        <div className={styles.errors}>
          {errors && getErrors(errors)}
        </div>
        <Info
          title="Accuracy"
          data={accuracy}
        />
        <div className={styles.footer}>
          <Logs logs={logs} />
          {onDownload && (
            <button
              disabled={downloading}
              onClick={() => onDownload()}
            >
              Download
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Metrics;

export { IMetricsInfoProps, IDatum } from './Info';
