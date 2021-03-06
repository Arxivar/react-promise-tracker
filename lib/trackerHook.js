"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePromiseTracker = void 0;

var _react = _interopRequireDefault(require("react"));

var _trackPromise = require("./trackPromise");

var _setupConfig = require("./setupConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var usePromiseTracker = function usePromiseTracker() {
  var outerConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _setupConfig.defaultConfig;

  var isMounted = _react["default"].useRef(false);

  _react["default"].useEffect(function () {
    isMounted.current = true;
    return function () {
      return isMounted.current = false;
    };
  }, []); // Included in state, it will be evaluated just the first time,
  // TODO: discuss if this is a good approach
  // We need to apply defensive programming, ensure area and delay default to secure data
  // cover cases like not all params informed, set secure defaults


  var _React$useState = _react["default"].useState((0, _setupConfig.setupConfig)(outerConfig)),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      config = _React$useState2[0]; // Edge case, when we start the application if we are loading just onComponentDidMount
  // data, event emitter could have already emitted the event but subscription is not yet
  // setup


  _react["default"].useEffect(function () {
    if (isMounted.current && config && config.area && (0, _trackPromise.getCounter)(config.area) > 0) {
      setInternalPromiseInProgress(true);
      setPromiseInProgress(true);
    }
  }, [config]); // Internal will hold the current value


  var _React$useState3 = _react["default"].useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      internalPromiseInProgress = _React$useState4[0],
      setInternalPromiseInProgress = _React$useState4[1]; // Promise in progress is 'public', it can be affected by the _delay_ parameter
  // it may not show the current state


  var _React$useState5 = _react["default"].useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      promiseInProgress = _React$useState6[0],
      setPromiseInProgress = _React$useState6[1]; // We need to hold a ref to latestInternal, to check the real value on
  // callbacks (if not we would get always the same value)
  // more info: https://overreacted.io/a-complete-guide-to-useeffect/


  var latestInternalPromiseInProgress = _react["default"].useRef(internalPromiseInProgress);

  var notifyPromiseInProgress = function notifyPromiseInProgress() {
    !config || !config.delay || config.delay === 0 ? setPromiseInProgress(true) : setTimeout(function () {
      // Check here ref to internalPromiseInProgress
      if (isMounted.current && latestInternalPromiseInProgress.current) {
        setPromiseInProgress(true);
      }
    }, config.delay);
  };

  var updatePromiseTrackerStatus = function updatePromiseTrackerStatus(anyPromiseInProgress, areaAffected) {
    if (isMounted.current && config.area === areaAffected) {
      setInternalPromiseInProgress(anyPromiseInProgress); // Update the ref object as well, we will check it when we need to
      // cover the _delay_ case (setTimeout)

      latestInternalPromiseInProgress.current = anyPromiseInProgress;

      if (!anyPromiseInProgress) {
        setPromiseInProgress(false);
      } else {
        notifyPromiseInProgress();
      }
    }
  };

  _react["default"].useEffect(function () {
    latestInternalPromiseInProgress.current = internalPromiseInProgress;

    _trackPromise.emitter.on(_trackPromise.promiseCounterUpdateEventId, updatePromiseTrackerStatus);

    return function () {
      return _trackPromise.emitter.off(_trackPromise.promiseCounterUpdateEventId, updatePromiseTrackerStatus);
    };
  }, []);

  return {
    promiseInProgress: promiseInProgress
  };
};

exports.usePromiseTracker = usePromiseTracker;