import * as React from 'react';
import styled from 'styled-components';

const Data = styled.ul `
  display: flex;
  margin-bottom: 20px !important;
`;

const Datum = styled.li `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  data {
    font-size: 40px;
  }

  label {
    color: rgba(255,255,255,0.6);
  }

`;

const Header = styled.h2 `
  font-size: 16px;
  margin: 0;
`;

interface IProps {
  title: string;
  data: {
    data: string | number;
    label: string;
  }[];
}

const Info: React.SFC<IProps> = ({
  title,
  data,
}) => {
  return (
    <React.Fragment>
      <Header>{title}</Header>
      <Data>
        {data.map(datum => (
          <Datum key={datum.label}>
            <data>{datum.data}</data>
            <label>{datum.label}</label>
          </Datum>
        ))}
      </Data>
    </React.Fragment>
  );
};

export default Info;
