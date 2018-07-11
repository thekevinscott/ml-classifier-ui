import * as React from 'react';
import styles from './styles.scss';

export interface IMetricsInfoProps {
  title: string;
  data: IDatum[];
}

export interface IDatum {
  data: string | number;
  label: string;
}

const Info: React.SFC<IMetricsInfoProps> = ({
  title,
  data,
}) => {
  return (
    <React.Fragment>
      <h2 className={styles.header}>{title}</h2>
      <ul className={styles.data}>
        {data.map((datum: IDatum) => (
          <li className={styles.datum} key={datum.label}>
            <data>{datum.data}</data>
            <label>{datum.label}</label>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Info;
