# ML Classifier

ML Classifier is a tool built on top of TensorflowJS to allow you to quickly train image classifiers in your browser using machine learning.

Trained models can be saveed with the click of a button, and the resulting models reused in your Javascript application.

# Installation

```
yarn add ml-classifier
```

or

```
npm install ml-classifier
```

# Quick Start

Start by instantiating a new MLClassifier. The constructor accepts a set of configuration parameters, detailed below.

```
import MLClassifier from 'ml-classifier';

const mlClassifier = new MLClassifier({
  callbacks: {
    onTrainBegin: () => {
      console.log('training begins');
    },
    onBatchEnd: (batch: any,logs: any) => {
      console.log('Loss is: ' + logs.loss.toFixed(5));
    }
  },
});
```

Then, train the model:

```
await mlClassifier.train(imageData);
```

And get predictions:

```
const prediction = await mlClassifier.predict(data);
```

When you have a trained model you're happy with, save it with:

```
mlClassifier.save();
```

# Configuration

`MLClassifier` accepts a number of parameters:

* `optimizer` (*tf.train.Optimizer) - A custom optimizer to use. Optional. Default is `tf.train.adam(0.0001)`.
* `loss` (*string*) - A custom loss function. Optional. Default is `categoricalCrossentropy`.
* `layers` (*function*) - A custom function to build the model's layers. Optional.
* `model` (*tf.Model*) - a custom tf.Model to use.
* `batchSize` (*number*) - Number of samples per gradient update. Optional.
* `epochs` (*number*) The number of times to iterate over the training data arrays. Optional. Default is 20.
* `callbacks` (*object*) - An object of callbacks to pass to `tf.model.fit`. Optional.
* `validationSplit` (*number*) - Float between 0 and 1 specifying the fraction of training data to be used as validation data. Optional.
* `validationData` (*([ tf.Tensor|tf.Tensor[], tf.Tensor|tf.Tensor[] ]|[tf.Tensor | tf.Tensor[], tf.Tensor|tf.Tensor[], tf.Tensor|tf.Tensor[]]*) - Data on which to evaluate the loss and any model metrics. Optional.
* `shuffle` (*boolean*) - Whether to shuffle the training data before each epoch. Optional.
* `classWeight` ({[classIndex: string]: number}) Optional dictionary mapping class indices (integers) to a weight (float) to apply to the model's loss for the samples from this class during training. Optional.
* `sampleWeight` (*tf.Tensor*) Optional array of the same length as x, containing weights to apply to the model's loss for each sample. In the case of temporal data, you can pass a 2D array with shape (samples, sequenceLength), to apply a different weight to every timestep of every sample. In this case you should make sure to specify sampleWeightMode="temporal" in compile(). Optional
* `initialEpoch` (*number*) - Epoch at which to start training (useful for resuming a previous training run). Optional
* `stepsPerEpoch` (*number*) - Total number of steps (batches of samples) before declaring one epoch finished and starting the next epoch. When training with Input Tensors such as TensorFlow data tensors, the default null is equal to the number of unique samples in your dataset divided by the batch size, or 1 if that cannot be determined. Optional
* `validationSteps` ((number*) - Only relevant if stepsPerEpoch is specified. Total number of steps (batches of samples) to validate before stopping. Optional
* `metrics` (*string[]|{[outputName: string]: string}*) - List of metrics to be evaluated by the model during training and testing. Typically you will use metrics=['accuracy']. To specify different metrics for different outputs of a multi-output model, you could also pass a dictionary. Optional
* `batchSize` (*number*) - Batch size (Integer). If unspecified, it will default to 32. Optional
* `verbose` (*ModelLoggingVerbosity*) - Verbosity mode. Optional

# Methods

## constructor

Accepts a configuration object as specified in configuration.

## `train`

Used to kick off the classifier training.

* `images` - An array of images to train on. Images should be an array of objects in the format `{ label: 'string', data: 'tf.Tensor3D' }`, where `data` is a tensor matching the pixel data of the image.
* `params` - An optional list of parameters matching the configuration object above.

```
mlClassifer.train([{
  data: { ... pixelData },
  label: 'strawberry',
}, {
  data: { ... pixelData },
  label: 'blueberry',
}], {
  epochs: 20,
  batchSize: 10,
});
```

Any parameters provided will overwrite the initialized parameters and persist for the life of the model.

`train` returns itself to allow for chaining.

## `predict`

`predict` returns a prediction for a single image. An image is specified as a 3 dimensional tensor.

```
ml.predict(imageData);
```

ml.predict accepts a single pixel data array, and returns a single class prediction.

## `save`

`save` will initiate a download from the browser.

```
ml.save(handlerOrURL?);
```

`save` accepts a `handlerOrURL` argument which can be a string or an `io.IOHandler`.

`save` returns itself, and is chainable.
