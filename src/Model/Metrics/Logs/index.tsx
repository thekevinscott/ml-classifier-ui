import * as React from 'react';
import classNames from 'utils/classNames';
import styles from './styles.scss';

interface IProps {
  logs: {
    [index: string]: any;
  };
}

interface IState {
  expanded: boolean;
}

class Logs extends React.Component<IProps, IState> {
  public state: IState = {
    expanded: false,
  };

  handleClick = (e:any) => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const {
      logs,
    } = this.props;

    return (
      <div
        className={classNames(styles.logs, {
          [styles.expanded]: this.state.expanded,
        })}
      >
        <div className={styles.expand}>
          <a onClick={this.handleClick}>&#9654;</a>
          <label>Loss</label>
        </div>
        <pre>
          {logs.loss.join('\n')}
        </pre>
      </div>
    );
  }
}

export default Logs;
