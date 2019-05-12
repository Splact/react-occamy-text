/**
 * @class OccamyText
 */

import * as React from 'react';


const FONT_SIZE_VARIATION_DECREASE_FACTOR = 0.5;

export type Props = {
  children: React.ReactNode,
  className?: string,
  grow: boolean,
  maxFontSize: number,
  maxFontSizeVariation: number,
  maxHeight?: number,
  minFontSize: number,
  minFontSizeVariation: number,
  shrink: boolean,
  style: object,
}

export default class OccamyText extends React.PureComponent<Props> {
  maxHeight: number;
  maxWidth: number;
  fontSize: number;
  initialFontSize: number;
  lineHeight: number | string | null;
  variationStrategy: number | null;
  isVariationStrategyChanged: boolean;
  isImperfectionReached: boolean;
  wrapper: HTMLElement | null;
  content: HTMLElement | null;

  static defaultProps = {
    grow: true,
    maxFontSize: 96,
    maxFontSizeVariation: 8,
    minFontSize: 4,
    minFontSizeVariation: 0.3,
    shrink: true,
    style: {},
  };

  constructor(props: Props) {
    super(props);

    this.maxHeight = Infinity;
    this.maxWidth = Infinity;
    this.fontSize = -1;
    this.initialFontSize = -1;
    this.lineHeight = null;
    this.variationStrategy = null;
    this.isVariationStrategyChanged = false;
    this.isImperfectionReached = false;
  }

  /** React lifecycle **/
  componentWillMount() {
    if (this.props.maxHeight) {
      this.maxHeight = this.props.maxHeight;
    }
  }
  componentDidMount() {
    if (!this.content) {
      return;
    }

    if (this.wrapper) {
      if (!this.props.maxHeight) {
        this.maxHeight = this.wrapper.offsetHeight;
      }

      this.maxWidth = this.wrapper.offsetWidth;
    }

    this.fontSize = parseInt(window.getComputedStyle(this.content).getPropertyValue('font-size'), 10);
    this.initialFontSize = this.fontSize;
    const lineHeight = window.getComputedStyle(this.content).getPropertyValue('line-height');
    const computedLineHeight = parseInt(lineHeight, 10);
    this.lineHeight = computedLineHeight > 0 ? computedLineHeight / this.fontSize : lineHeight;

    // console.log('[OCCAMY_TEXT] initial values', {
    //   fontSize: this.fontSize,
    //   maxHeight: this.maxHeight,
    //   maxWidth: this.maxWidth,
    //   lineHeight: this.lineHeight,
    // });

    this.setRightFontSize();
  }
  componentWillReceiveProps() {
    if (this.props.maxHeight) {
      this.maxHeight = this.props.maxHeight;
    }
  }

  componentDidUpdate() {
    if (!this.props.maxHeight && this.wrapper) {
      this.maxHeight = this.wrapper.offsetHeight;
      this.maxWidth = this.wrapper.offsetWidth;
      this.setRightFontSize();
    }
  }

  /** Internal methods **/
  getSizeDiff = () => {
    if (!this.content) {
      return {
        value: 0,
        axis: 'x',
      };
    }

    const x = this.content.scrollWidth - this.maxWidth;
    const y = this.content.offsetHeight - this.maxHeight;

    if (x > 0 && x > y) {
      return {
        value: x,
        axis: 'x',
      };
    }

    return {
      value: y,
      axis: 'y',
    };
  }

  getFontSizeVariation = (diff: {value: number, axis: string}) => {
    const variationStrategy = (
      diff.value > 0 && -1
      || diff.value < 0 && 1
      || 0
    );

    if (!variationStrategy) {
      return 0;
    }

    if (this.variationStrategy !== null) {
      if (this.variationStrategy !== variationStrategy) {
        // variation changed
        if (this.isVariationStrategyChanged) {
          // already changed in a previous iteration: we need to stop iterations
          this.isImperfectionReached = true;
        } else {
          this.isVariationStrategyChanged = true;
        }

        this.variationStrategy = variationStrategy;
      } else {
        this.isVariationStrategyChanged = false;
      }
    } else {
      this.variationStrategy = variationStrategy;
    }

    const diffRatio = Math.abs(diff.value) / (diff.axis === 'x' ? this.maxWidth : this.maxHeight);
    let fontSizeVariation = diffRatio * this.fontSize * FONT_SIZE_VARIATION_DECREASE_FACTOR;

    if (fontSizeVariation < this.props.minFontSizeVariation) {
      fontSizeVariation = this.props.minFontSizeVariation;
    } else if (fontSizeVariation > this.props.maxFontSizeVariation) {
      fontSizeVariation = this.props.maxFontSizeVariation;
    }

    return fontSizeVariation * this.variationStrategy;
  }

  setRightFontSize = () => {
    if (!this.content) {
      return false;
    }

    let diff = this.getSizeDiff();
    this.isVariationStrategyChanged = false;
    this.isImperfectionReached = false;
    let fontSizeVariation = this.getFontSizeVariation(diff);
    let nextFontSize = this.fontSize + fontSizeVariation;
    // let counter = 0;

    // console.log('[OCCAMY_TEXT] fitting text', {
    //   fontSize: this.fontSize + 'px',
    //   contentHeight: this.content.offsetHeight + 'px',
    //   contentWidth: this.content.scrollWidth + 'px',
    //   maxHeight: this.maxHeight + 'px',
    //   maxWidth: this.maxWidth + 'px',
    //   canGrow: this.props.grow,
    //   canShrink: this.props.shrink,
    // });

    // while the text is higher then its wrapper (or maxHeight props)
    while (
      diff.value !== 0
      && (!this.isImperfectionReached || diff.value > 0)
      && this.fontSize > this.props.minFontSize
      && this.fontSize < this.props.maxFontSize
      && (this.props.shrink || nextFontSize >= this.initialFontSize)
      && (this.props.grow || nextFontSize <= this.initialFontSize)
    ) {

      // set a new fontSize
      this.fontSize = this.fontSize + fontSizeVariation;
      this.content.setAttribute('style', `font-size: ${this.fontSize}px; line-height: ${this.lineHeight}`);

      // console.log('[OCCAMY_TEXT] trying new font-size', {
      //   newFontSize: this.fontSize + 'px',
      //   fontSizeVariation: fontSizeVariation + 'px',
      //   contentHeight: this.content.offsetHeight + 'px',
      //   contentWidth: this.content.scrollWidth + 'px',
      // });

      diff = this.getSizeDiff();
      fontSizeVariation = this.getFontSizeVariation(diff);
      nextFontSize = this.fontSize + fontSizeVariation;
      // counter++;
    }

    // console.log('[OCCAMY_TEXT] found right font-size', {
    //   fontSize: this.fontSize + 'px',
    //   attempts: counter,
    //   tollerance: Math.abs(this.maxHeight - this.content.offsetHeight) + 'px',
    //   contentHeight: this.content.offsetHeight + 'px',
    //   contentWidth: this.content.scrollWidth + 'px',
    //   maxHeight: this.maxHeight + 'px',
    //   maxWidth: this.maxWidth + 'px',
    // });

    return true;
  }

  /** Render **/
  render() {
    const {
      children,
      className,
      style,
      grow: _,
      maxFontSize: __,
      maxFontSizeVariation: ___,
      maxHeight: ____,
      minFontSize: _____,
      minFontSizeVariation: ______,
      shrink: _______,
      ...props
    } = this.props;

    const wrapperClasses = className ? `${className} occamy-text` : 'occamy-text';
    const wrapperStyle = {
      ...style,
      height: '100%',
    };

    const contentStyle = {
      fontSize: this.fontSize ? `${this.fontSize}px` : undefined,
      lineHeight: this.lineHeight ? `${this.lineHeight}em` : undefined,
    };

    return (
      <div
        ref={ r => this.wrapper = r }
        className={ wrapperClasses }
        style={ wrapperStyle }
        {...props}
      >
        <div
          ref={ r => this.content = r }
          className="occamy-text--content"
          style={ contentStyle }
        >{ children }</div>
      </div>
    );
  }
}
