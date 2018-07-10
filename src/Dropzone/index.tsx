import * as React from 'react';
import styled, { StyledFunction } from "styled-components"
import transformFiles from './transformFiles';

interface IProps {
  onDrop?: Function;
  onParseFiles: Function;
  style?: any;
  children?: any;
}

interface IState {
  over: boolean;
}

interface ContainerProps {
  over: boolean;
}

const div: StyledFunction<ContainerProps & React.HTMLProps<HTMLInputElement>> = styled.div;

const Container = div `
  text-align: center;
  font-size: 2rem;
  color: rgba(0,0,0,0.4);
  border-radius: 5px;
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;

  input {
    display: none;
  }

  background: ${props => props.over ? 'rgba(155,77,202,0.2)' : 'rgba(0,0,0,0)'};
  border: 2px dashed ${props => props.over ? '#9b4dca;' : 'rgba(0,0,0,0.2)'};
  transition-duration: ${props => props.over ? '0.1s' : '0.2s'};

/*
  &:before {
    content: "";
    border-left: 2px solid #9b4dca;
    border-top: 2px solid #9b4dca;
    height: 20px;
    width: 20px;
    position: absolute;
    left: 3px;
    top: 3px;
    border-radius: 5px 0 0 0;
  }
  */
`;

class Dropzone extends React.Component<IProps, IState> {
  private timeout: NodeJS.Timer;
  constructor(props: IProps) {
    super(props);

    this.state = {
      over: false,
    };
  }

  public handleDrop = async (e: React.DragEvent) => {
    if (this.props.onDrop) {
      this.props.onDrop();
    }
    e.preventDefault();
    e.persist();
    const folders = await transformFiles(e);
    if (e.dataTransfer.items) {
      e.dataTransfer.items.clear();
    } else {
      e.dataTransfer.clearData();
    }
    this.props.onParseFiles(folders);
  }

  public handleDrag = (over: boolean) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      this.setState({
        over,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public stop = (e: any) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.state.over === false) {
      this.setState({
        over: true,
      });
    }
    this.timeout = setTimeout(() => {
      this.setState({
        over: false,
      });
    }, 50);
    e.preventDefault();
  }

  public render() {
    return (
      <Container
        draggable={true}
        // onDragStart={this.handleDrag(true)}
        // onDragEnd={this.handleDrag(false)}
        onDrop={this.handleDrop}
        onDragOver={this.stop}
        over={this.state.over}
        style={this.props.style}
      >
        {this.props.children || (<span>Drop Images To Begin Training</span>)}
        <input
          type="file"
          name="files[]"
          data-multiple-caption="{count} files selected"
          multiple={true}
        />
      </Container>
    );
  }
};

export default Dropzone;
