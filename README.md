# Occamy Text

>Occamy is choranaptyxic, meaning it will grow or shrink to fit available space
>
>-- <cite>Fantastic Beasts and Where to Find Them</cite>

React component for automatically sized text that fits in its parent.

[![NPM](https://img.shields.io/npm/v/react-occamy-text.svg)](https://www.npmjs.com/package/react-occamy-text) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Alt text](example/preview.png?raw=true "Example preview")

## Demo & Examples
Live demo: [splact.github.io/react-occamy-text](http://splact.github.io/react-occamy-text/)

To build the examples locally, run:

```
cd example
npm install
npm start
```


## Installation
```bash
npm install --save react-occamy-text
```


## Usage
```tsx
import * as React from 'react';

import OccamyText from 'react-occamy-text';

class Example extends React.Component {
  render () {
    return <OccamyText>Abra cadabra flipendo, alabif shazam!</OccamyText>;
  }
}
```

It should not be used inside auto-sized (eg. `height: auto`) elements.

### Properties
* children – the text that need to be resized
* grow – true if the text can scale up its original size (default `true`)
* shrink – true if the text can scale down its original size (default `true`)
* maxFontSize – maximum font size in pixels (default `96`)
* minFontSize – minimum font size in pixels (default `4`)
* maxFontSizeVariation – maximum font size variation per iteration (default `8`)
* minFontSizeVariation – minimum font size variation per iteration (default `0.3`)
* maxHeight – maximum height (default `undefined`, parent height will be used instead)

### Notes
OccamyText is rendered as a `div` with `occamy-text` class and `height: 100%` style defined inline to make it fits in its parent.


## Tollerance
The output text will not always *perfectly* fit the parent height, in some cases a subtile tollerance is accepted, giving always the larger text that doesn't exceed its parent.


## Development
To get started, in one tab, run:
`npm run start`
And in another tab, run the create-react-app devserver:
`cd example && npm run start`

## License
MIT © [Splact](https://github.com/Splact)
