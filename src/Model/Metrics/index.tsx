import * as React from 'react';
import styles from './styles.scss';
import Info, {
  IDatum,
} from './Info';
// import {
//   IImageData,
// } from 'utils/getFilesAsImages';
import Logs from './Logs';

interface IProps {
  labels?: string[];
  downloading: boolean;
  onDownload?: Function;
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

class Metrics extends React.Component<IProps> {
  render() {
    const {
      labels,
      onDownload,
      downloading,
      accuracy,
      logs,
    } = this.props;

    console.log('labels', labels);

    return (
      <div className={styles.container}>
        <Info
          title="Data"
          data={getData(labels)}
        />
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
