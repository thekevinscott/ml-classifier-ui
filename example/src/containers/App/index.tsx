import * as React from 'react';
import styles from './styles.scss';
import MLClassifierUI from 'mlClassifierUI';

class App extends React.Component {
  public render() {
    return (
      <div className={styles.app}>
        <MLClassifierUI />
      </div>
    );
  }
}

export default App;
