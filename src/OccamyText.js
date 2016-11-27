import React, {PureComponent, PropTypes} from 'react';


const FONT_SIZE_VARIATION_DECREASE_FACTOR = 0.5;


class OccamyText extends PureComponent {
  constructor(props) {
    super(props);

    this.maxHeight = Infinity;
    this.fontSize = null;
    this.initialFontSize = null;
    this.variationStrategy = null;
    this.variationStrategyChanged = false;
    this.reachedImperfection = false;

    // refs
    this.wrapper = null;

    // binding methods
    this.fontSizeCheck = this.fontSizeCheck.bind(this);
    this.getFontSizeVariation = this.getFontSizeVariation.bind(this);
    this.setRightFontSize = this.setRightFontSize.bind(this);
  }


  /** React lifecycle **/
  componentWillMount() {
    if (this.props.maxHeight) {
      this.maxHeight = this.props.maxHeight;
    }
  }
  componentDidMount() {
    if (!this.props.maxHeight) {
      this.maxHeight = this.wrapper.offsetHeight;
    }

    this.fontSize = parseInt(window.getComputedStyle(this.content).getPropertyValue('font-size'), 10);
    this.initialFontSize = this.fontSize;
    const lineHeight = window.getComputedStyle(this.content).getPropertyValue('line-height');
    const computedLineHeight = parseInt(lineHeight, 10);
    this.lineHeight = computedLineHeight > 0 ? computedLineHeight / this.fontSize : lineHeight;

    // console.log('[OCCAMY_TEXT] initial values', {
    // 	fontSize: this.fontSize,
    // 	maxHeight: this.maxHeight,
    // 	lineHeight: this.lineHeight,
    // });

    this.setRightFontSize();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.maxHeight) {
      this.maxHeight = this.props.maxHeight;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.maxHeight && this.maxHeight !== this.wrapper.offsetHeight) {
      this.maxHeight = this.wrapper.offsetHeight;
      this.setRightFontSize();
    }
  }

  /** Internal methods **/
  fontSizeCheck() {
    return this.content.offsetHeight - this.maxHeight;
  }
  getFontSizeVariation(diff) {
    const variationStrategy = (
      diff > 0 && -1
      || diff < 0 && 1
      || 0
    );

    if (!variationStrategy) {
      return 0;
    }

    if (this.variationStrategy !== null) {
      if (this.variationStrategy !== variationStrategy) {
        // variation changed
        if (this.variationStrategyChanged) {
          // already changed in a previous iteration: we need to stop iterations
          this.reachedImperfection = true;
        } else {
          this.variationStrategyChanged = true;
        }

        this.variationStrategy = variationStrategy;
      } else {
        this.variationStrategyChanged = false;
      }
    } else {
      this.variationStrategy = variationStrategy;
    }

    const diffRatio = Math.abs(diff) / this.maxHeight;
    let fontSizeVariation = diffRatio * this.fontSize * FONT_SIZE_VARIATION_DECREASE_FACTOR;

    if (fontSizeVariation < this.props.minFontSizeVariation) {
      fontSizeVariation = this.props.minFontSizeVariation;
    } else if (fontSizeVariation > this.props.maxFontSizeVariation) {
      fontSizeVariation = this.props.maxFontSizeVariation;
    }

    return fontSizeVariation * this.variationStrategy;
  }
  setRightFontSize() {
    let diff = this.fontSizeCheck();
    this.variationStrategyChanged = false;
    this.reachedImperfection = false;
    let fontSizeVariation = this.getFontSizeVariation(diff);
    let nextFontSize = this.fontSize + fontSizeVariation;
    let counter = 0;

    // console.log('[OCCAMY_TEXT] fitting text', {
    // 	fontSize: this.fontSize + 'px',
    // 	contentHeight: this.content.offsetHeight + 'px',
    // 	maxHeight: this.maxHeight + 'px',
    // 	canGrow: this.props.grow,
    // 	canShrink: this.props.shrink,
    // });

    // while the text is higher then its wrapper (or maxHeight props)
    while (
      diff !== 0
      && (!this.reachedImperfection || diff > 0)
      && this.fontSize > this.props.minFontSize
      && this.fontSize < this.props.maxFontSize
      && (this.props.shrink || nextFontSize >= this.initialFontSize)
      && (this.props.grow || nextFontSize <= this.initialFontSize)
    ) {

      // set a new fontSize
      this.fontSize = this.fontSize + fontSizeVariation;
      this.content.setAttribute('style', `font-size: ${this.fontSize}px; line-height: ${this.lineHeight}`);

      // console.log('[OCCAMY_TEXT] trying new font-size', {
      // 	newFontSize: this.fontSize + 'px',
      // 	fontSizeVariation: fontSizeVariation + 'px',
      // 	contentHeight: this.content.offsetHeight + 'px',
      // });

      diff = this.fontSizeCheck();
      fontSizeVariation = this.getFontSizeVariation(diff);
      nextFontSize = this.fontSize + fontSizeVariation;
      counter++;
    }

    console.log('[OCCAMY_TEXT] found right font-size', {
      fontSize: this.fontSize + 'px',
      attempts: counter,
      tollerance: Math.abs(this.maxHeight - this.content.offsetHeight) + 'px',
      contentHeight: this.content.offsetHeight + 'px',
      maxHeight: this.maxHeight + 'px',
    });
  }

  /** React **/
  render() {
    const { children, className, props } = this.props;

    const wrapperClasses = className ? `${className} occamy-text` : 'occamy-text';

    const contentStyle = {
      fontSize: this.fontSize ? `${this.fontSize}px` : null,
      lineHeight: this.lineHeight ? `${this.lineHeight}em` : null,
    };

    return (
      <div ref={ r => this.wrapper = r } className={ wrapperClasses } {...props}>
        <div
          ref={ r => this.content = r }
          className="occamy-text--content"
          style={ contentStyle }
        >{ children }</div>
      </div>
    );
  }
}


OccamyText.defaultProps = {
  grow: true,
  maxFontSize: 96,
  maxFontSizeVariation: 8,
  minFontSize: 4,
  minFontSizeVariation: 0.3,
  shrink: true,
};
OccamyText.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  grow: PropTypes.bool,
  maxFontSize: PropTypes.number,
  maxFontSizeVariation: PropTypes.number,
  maxHeight: PropTypes.number,
  minFontSize: PropTypes.number,
  minFontSizeVariation: PropTypes.number,
  shrink: PropTypes.bool,
};


export default OccamyText;
