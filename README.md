# ML Classifier UI

ML Classifier is a React front end for a machine learning engine for quickly training image classification models in your browser. Models can be saved with a single command, and the resulting models reused to make image classification predictions.

This package is the UI front end for [`ml-classifier`](https://github.com/thekevinscott/ml-classifier).

## Demo

An interactive demo can be found here.

![Demo](https://github.com/thekevinscott/ml-classifier-ui/raw/master/example/public/example.gif)
*Screenshot of demo*

## Getting Started

### Installation

`ml-classifier-ui` can be installed via `yarn` or `npm`:

```
yarn add ml-classifier-ui
```

or

```
npm install ml-classifier-ui
```

### Quick Start

Start by instantiating a new MLClassifierUI.

```
import React from 'react';
import ReactDOM from 'react-dom';
import MLClassifierUI from 'ml-classifier-ui';

ReactDOM.render(<MLClassifierUI />, document.getElementById('root'));
```

## API Documentation

`MLClassifierUI` accepts a number of parameters:

* **getMLClassifier** (`Function`) *Optional* - A callback that returns an instance of the underlying `ml-classifier` object. Call this if you want to programmatically call methods like `addData`, `train`, and `predict`. For more information on `ml-classifier`'s API methods [refer to it's documentation](https://github.com/thekevinscott/ml-classifier#api-documentation).
* **methodParams** (`Object`) *Optional* - A set of parameters that will be passed in calls to `ml-classifier`'s methods. See below for more information.
* **uploadFormat** (`string`) *Optional* - A string denoting what type of upload format to accept. Formats can be `flat` or `nested`. See below note for more information on that. If omitted, all formats are accepted.
* **imageFormats** (`string[]`) *Optional* - An array of file extensions to accept. By default, all valid images are accepted. Images are transformed via the native `Image` tag in the browser, so if the browser can display the image, it'll be processed.

`MLClassifierUI` also accepts a number of callbacks that are called on the beginnings and ends of `ml-classifier` functions. [You can view a list of those here](https://github.com/thekevinscott/ml-classifier#parameters).

### `getMLClassifier`

`getMLClassifier` returns an instance of `ml-classifier` for programmatic access to the underlying methods.

#### Example

```
<MLClassifierUI
  getMLClassifier={(mlClassifier) => {
    mlClassifier.addData(...);
  }}
/>
```

### `methodParams`

`methodParams` can be used to pass method-specific parameters to `ml-classifier`. The key will be used to determine which method to pass parameters to.

Accepted keys are `train`, `evaluate`, and `save`. Other keys will be ignored.

#### Example

```
<MLClassifierUI
  methodParams={{
    train: {
      epochs: 20,
    },
    evaluate: {
      batchSize: 32,
    },
    save: {
    },
  }}
/>
```

### `uploadFormat`

`uploadFormat` corresponds to how uploaded images should be organized. There are two options:

#### `nested`
Expects images to be organized in folders matching the label. Only the immediate parent folder's name will be used as the label. For example:

```
- containing-folder/
  - dogs/
    - IMG-1.jpg
    - IMG-2.jpg
    - IMG-3.jpg
  - cats/
    - IMG-1.jpg
    - IMG-2.jpg
    - IMG-3.jpg
```

Will product an array of three `dogs` labels and three `cats` labels.

Nested folders will be searched recursively, but only immediate parent folders' names will be used. If an invalidly nested structure is found an error will be thrown.

#### `flat` (*currently in development*)
Expects files' names to be the label. Nested folders will be searched recursively (if the browser supports it) to build a flat array of files.

```
- folder/
  - dog-1.jpg
  - dog-2.jpg
  - dog-3.jpg
  - cat-1.jpg
  - cat-2.jpg
  - cat-3.jpg
```

#### Example

```
<MLClassifierUI
  uploadFormat={"nested"}
/>
```

### `imageFormats` (*currently in development*)

`imageFormats` denotes the list of acceptable image formats for upload. Any images not matching the list of acceptable formats will be ignored.

#### Example

```
<MLClassifierUI
  imageFormats={[
    'png',
    'gif',
  ]}
/>
```

## Contributing

Contributions are welcome!

You can run the local example with:

```
yarn watch
```

`ml-classifier-ui` is written in Typescript and React.

### Tests

Tests are a work in progress. Currently, the test suite only consists of unit tests. Pull requests for additional tests are welcome!

Run tests with:

```
yarn test
```

## Author

* [Kevin Scott](https://thekevinscott.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details
