'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var InversifyContext = /*#__PURE__*/React__default.createContext({
  container: null
});
var Provider = function Provider(props) {
  return /*#__PURE__*/React__default.createElement(InversifyContext.Provider, {
    value: {
      container: props.container
    }
  }, props.children);
};

exports.Provider = Provider;
//# sourceMappingURL=ioc.react.js.map
