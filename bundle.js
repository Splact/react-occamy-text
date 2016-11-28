require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"react-occamy-text":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var FONT_SIZE_VARIATION_DECREASE_FACTOR = 0.5;

var OccamyText = (function (_PureComponent) {
  _inherits(OccamyText, _PureComponent);

  function OccamyText(props) {
    _classCallCheck(this, OccamyText);

    _get(Object.getPrototypeOf(OccamyText.prototype), 'constructor', this).call(this, props);

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

  _createClass(OccamyText, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.maxHeight) {
        this.maxHeight = this.props.maxHeight;
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.maxHeight) {
        this.maxHeight = this.wrapper.offsetHeight;
      }

      this.fontSize = parseInt(window.getComputedStyle(this.content).getPropertyValue('font-size'), 10);
      this.initialFontSize = this.fontSize;
      var lineHeight = window.getComputedStyle(this.content).getPropertyValue('line-height');
      var computedLineHeight = parseInt(lineHeight, 10);
      this.lineHeight = computedLineHeight > 0 ? computedLineHeight / this.fontSize : lineHeight;

      // console.log('[OCCAMY_TEXT] initial values', {
      // 	fontSize: this.fontSize,
      // 	maxHeight: this.maxHeight,
      // 	lineHeight: this.lineHeight,
      // });

      this.setRightFontSize();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.maxHeight) {
        this.maxHeight = this.props.maxHeight;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (!this.props.maxHeight && this.maxHeight !== this.wrapper.offsetHeight) {
        this.maxHeight = this.wrapper.offsetHeight;
        this.setRightFontSize();
      }
    }

    /** Internal methods **/
  }, {
    key: 'fontSizeCheck',
    value: function fontSizeCheck() {
      return this.content.offsetHeight - this.maxHeight;
    }
  }, {
    key: 'getFontSizeVariation',
    value: function getFontSizeVariation(diff) {
      var variationStrategy = diff > 0 && -1 || diff < 0 && 1 || 0;

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

      var diffRatio = Math.abs(diff) / this.maxHeight;
      var fontSizeVariation = diffRatio * this.fontSize * FONT_SIZE_VARIATION_DECREASE_FACTOR;

      if (fontSizeVariation < this.props.minFontSizeVariation) {
        fontSizeVariation = this.props.minFontSizeVariation;
      } else if (fontSizeVariation > this.props.maxFontSizeVariation) {
        fontSizeVariation = this.props.maxFontSizeVariation;
      }

      return fontSizeVariation * this.variationStrategy;
    }
  }, {
    key: 'setRightFontSize',
    value: function setRightFontSize() {
      var diff = this.fontSizeCheck();
      this.variationStrategyChanged = false;
      this.reachedImperfection = false;
      var fontSizeVariation = this.getFontSizeVariation(diff);
      var nextFontSize = this.fontSize + fontSizeVariation;
      var counter = 0;

      // console.log('[OCCAMY_TEXT] fitting text', {
      // 	fontSize: this.fontSize + 'px',
      // 	contentHeight: this.content.offsetHeight + 'px',
      // 	maxHeight: this.maxHeight + 'px',
      // 	canGrow: this.props.grow,
      // 	canShrink: this.props.shrink,
      // });

      // while the text is higher then its wrapper (or maxHeight props)
      while (diff !== 0 && (!this.reachedImperfection || diff > 0) && this.fontSize > this.props.minFontSize && this.fontSize < this.props.maxFontSize && (this.props.shrink || nextFontSize >= this.initialFontSize) && (this.props.grow || nextFontSize <= this.initialFontSize)) {

        // set a new fontSize
        this.fontSize = this.fontSize + fontSizeVariation;
        this.content.setAttribute('style', 'font-size: ' + this.fontSize + 'px; line-height: ' + this.lineHeight);

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
        maxHeight: this.maxHeight + 'px'
      });
    }

    /** React **/
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var _props = this.props;
      var children = _props.children;
      var className = _props.className;
      var style = _props.style;
      var props = _props.props;

      var wrapperClasses = className ? className + ' occamy-text' : 'occamy-text';
      var wrapperStyle = _extends({}, style, {
        height: '100%'
      });

      var contentStyle = {
        fontSize: this.fontSize ? this.fontSize + 'px' : null,
        lineHeight: this.lineHeight ? this.lineHeight + 'em' : null
      };

      return _react2['default'].createElement(
        'div',
        _extends({
          ref: function (r) {
            return _this.wrapper = r;
          },
          className: wrapperClasses,
          style: wrapperStyle
        }, props),
        _react2['default'].createElement(
          'div',
          {
            ref: function (r) {
              return _this.content = r;
            },
            className: 'occamy-text--content',
            style: contentStyle
          },
          children
        )
      );
    }
  }]);

  return OccamyText;
})(_react.PureComponent);

OccamyText.defaultProps = {
  grow: true,
  maxFontSize: 96,
  maxFontSizeVariation: 8,
  minFontSize: 4,
  minFontSizeVariation: 0.3,
  shrink: true,
  style: {}
};
OccamyText.propTypes = {
  children: _react.PropTypes.node,
  className: _react.PropTypes.string,
  grow: _react.PropTypes.bool,
  maxFontSize: _react.PropTypes.number,
  maxFontSizeVariation: _react.PropTypes.number,
  maxHeight: _react.PropTypes.number,
  minFontSize: _react.PropTypes.number,
  minFontSizeVariation: _react.PropTypes.number,
  shrink: _react.PropTypes.bool,
  style: _react.PropTypes.object
};

exports['default'] = OccamyText;
module.exports = exports['default'];

},{"react":undefined}]},{},[]);
