import * as React from 'react';
// import Classifier from 'components/Classifier';
import styles from './styles.scss';
import 'dist/index.css';
import MLClassifierUI from 'dist/';

console.log('i am app v3.');

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
