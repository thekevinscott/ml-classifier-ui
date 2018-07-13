import * as React from 'react';
import loading from './loading';

const SIZE = 32;

interface IProps {
  size?: number;
}

const Loading: React.SFC<IProps> = ({
  size,
}) => (
  <img
    src={loading}
    alt="Loading..."
    style={{
      width: size || SIZE,
      height: size || SIZE,
    }}
  />
);

export default Loading;
