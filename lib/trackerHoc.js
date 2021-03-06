"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promiseTrackerHoc = void 0;

var _react = _interopRequireWildcard(require("react"));

var _trackPromise = require("./trackPromise");

var _setupConfig = require("./setupConfig");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Props:
// config: {
//  area:  // can be null|undefined|'' (will default to DefaultArea) or area name
//  delay: // Wait Xms to display the spinner (fast connections scenario avoid blinking)
//            default value 0ms
// }
var promiseTrackerHoc = function promiseTrackerHoc(ComponentToWrap) {
  return /*#__PURE__*/function (_Component) {
    _inherits(promiseTrackerComponent, _Component);

    var _super = _createSuper(promiseTrackerComponent);

    function promiseTrackerComponent(props) {
      var _this;

      _classCallCheck(this, promiseTrackerComponent);

      _this = _super.call(this, props);
      _this.state = {
        promiseInProgress: false,
        internalPromiseInProgress: false,
        config: (0, _setupConfig.setupConfig)(props.config)
      };
      _this.notifyPromiseInProgress = _this.notifyPromiseInProgress.bind(_assertThisInitialized(_this));
      _this.updateProgress = _this.updateProgress.bind(_assertThisInitialized(_this));
      _this.subscribeToCounterUpdate = _this.subscribeToCounterUpdate.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(promiseTrackerComponent, [{
      key: "notifyPromiseInProgress",
      value: function notifyPromiseInProgress() {
        var _this2 = this;

        this.state.config.delay === 0 ? this.setState({
          promiseInProgress: true
        }) : setTimeout(function () {
          var progress = Boolean((0, _trackPromise.getCounter)(_this2.state.config.area) > 0);

          _this2.setState({
            promiseInProgress: progress
          });
        }, this.state.config.delay);
      }
    }, {
      key: "updateProgress",
      value: function updateProgress(progress, afterUpdateCallback) {
        this.setState({
          internalPromiseInProgress: progress
        }, afterUpdateCallback);
        !progress ? this.setState({
          promiseInProgress: false
        }) : this.notifyPromiseInProgress();
      }
    }, {
      key: "subscribeToCounterUpdate",
      value: function subscribeToCounterUpdate() {
        var _this3 = this;

        _trackPromise.emitter.on(_trackPromise.promiseCounterUpdateEventId, function (anyPromiseInProgress, area) {
          if (_this3.state.config.area === area) {
            _this3.updateProgress(anyPromiseInProgress);
          }
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.updateProgress(Boolean((0, _trackPromise.getCounter)(this.state.config.area) > 0), this.subscribeToCounterUpdate);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        _trackPromise.emitter.off(_trackPromise.promiseCounterUpdateEventId);
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react["default"].createElement(ComponentToWrap, _extends({}, this.props, {
          config: this.state.config,
          promiseInProgress: this.state.promiseInProgress
        }));
      }
    }]);

    return promiseTrackerComponent;
  }(_react.Component);
};

exports.promiseTrackerHoc = promiseTrackerHoc;