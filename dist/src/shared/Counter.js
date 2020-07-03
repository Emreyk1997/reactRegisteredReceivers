'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var logger = require('../logger.js');
var reactHooks = require('@apollo/react-hooks');
var counterQueries = require('../state/queries/counterQueries.js');
var counterMutation = require('../state/mutations/counterMutation.js');

// import { IProvider } from '../providers/providers';

var Counter = function Counter() {
  var _a = reactHooks.useQuery(counterQueries.GET_CONFIG),
      dataR = _a.data,
      loadingR = _a.loading;

  var _b = reactHooks.useQuery(counterQueries.GET_COUNTER),
      data = _b.data,
      loading = _b.loading,
      error = _b.error;

  var _c = React__default.useState(null),
      setErrorCatch = _c[1];

  var increment = reactHooks.useMutation(counterMutation.UPDATE_COUNTER, {
    variables: {
      offset: 1
    }
  })[0];
  var decrement = reactHooks.useMutation(counterMutation.UPDATE_COUNTER, {
    variables: {
      offset: -1
    }
  })[0]; // const provider = useInjection<IProvider<string>>('nameProvider');

  var logIncrement = function logIncrement() {
    logger.logger.error('ERROR');
    logger.logger.info('INFO');
    logger.logger.warn('WARN');
    logger.logger.debug('DEBUG');
    console.log('INCREMENTTTTT');
    increment();
  };

  if (loading) return /*#__PURE__*/React__default.createElement("p", null, "Loading...");
  if (error) return /*#__PURE__*/React__default.createElement("p", null, "Error");

  if ((data === null || data === void 0 ? void 0 : data.counter) < 5) {
    console.log('DATAAS', data, dataR);
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", null, "Provider:"), /*#__PURE__*/React__default.createElement("p", {
      "data-testid": "counter"
    }, "Counter: ", data === null || data === void 0 ? void 0 : data.counter), /*#__PURE__*/React__default.createElement("p", null, "Process: ", dataR.process), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "button-up",
      type: "button",
      onClick: function onClick() {
        return logIncrement();
      }
    }, "Increase"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "button-down",
      type: "button",
      onClick: function onClick() {
        return decrement();
      }
    }, "Decrease"));
  } else {
    logger.logger.error('Error from Boundary'); // setErrorCatch(() => {
    //   throw new Error('error');
    // });
  }
};

exports.default = Counter;
//# sourceMappingURL=Counter.js.map
