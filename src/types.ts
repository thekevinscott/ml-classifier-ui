export interface IProps {
}

export interface ITrainResult {
  epoch: number[];
  history: {
    acc: number[];
    loss: number[];
  };
  model: any;
  params: any;
  validationData: any;
}
