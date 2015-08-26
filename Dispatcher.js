'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Event = require('./Event.js');

var Dispatcher = (function () {
    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        this.listeners = {};
    }

    _createClass(Dispatcher, [{
        key: '_parseArguments',
        value: function _parseArguments(arg1, arg2, arg3) {
            switch (arguments.length) {
                case 1:
                    arg3 = arg1;
                    arg1 = arg2 = '*';
                    break;
                case 2:
                    arg3 = arg2;
                    arg2 = '*';
                    break;
            }

            return [arg1, arg2, arg3];
        }
    }, {
        key: 'register',
        value: function register(type, action, callback) {
            var listeners = this.listeners,
                obj = listeners[type],
                arr = undefined,
                listener = undefined;

            var _parseArguments2 = this._parseArguments(type, action, callback);

            var _parseArguments22 = _slicedToArray(_parseArguments2, 3);

            type = _parseArguments22[0];
            action = _parseArguments22[1];
            callback = _parseArguments22[2];

            if (!obj) {
                obj = listeners[type] = {};
            }

            arr = obj[action];

            if (!arr) {
                arr = obj[action] = [];
            }

            arr.push(listener = {
                action: action,
                type: type,
                callback: callback
            });

            return listener;
        }
    }, {
        key: 'unregister',
        value: function unregister(listener) {
            var listeners = this.listeners,
                type = listener.type,
                obj = listeners[type];

            if (obj) {
                var arr = obj[listener.action];

                var index = arr.findIndex(function (_listener) {
                    return _listener === listener;
                });

                if (index !== -1) {
                    arr.splice(index, 1);
                }
            }
        }
    }, {
        key: 'dispatch',
        value: function dispatch(type, action, payload) {
            var me = this;

            var _parseArguments3 = this._parseArguments(type, action, payload);

            var _parseArguments32 = _slicedToArray(_parseArguments3, 3);

            type = _parseArguments32[0];
            action = _parseArguments32[1];
            payload = _parseArguments32[2];

            return new Promise(function (resolve, reject) {
                var listeners = me.listeners,
                    _type = undefined;

                for (_type in listeners) {
                    var allListeners = undefined;

                    if (_type === type || _type === '*') {
                        var obj = listeners[_type],
                            listenerArray = undefined;

                        if (obj) {
                            listenerArray = obj[action];

                            if (allListeners) {
                                allListeners = allListeners.concat(listenerArray);
                            } else {
                                allListeners = listenerArray;
                            }
                        }

                        listenerArray = obj['*'];

                        if (action !== '*' && listenerArray && listenerArray.length) {
                            if (allListeners) {
                                allListeners = allListeners.concat(listenerArray);
                            } else {
                                allListeners = listenerArray;
                            }
                        }
                    }

                    if (allListeners && allListeners.length) {
                        var _event = new Event({
                            listeners: allListeners,
                            payload: payload,
                            type: type
                        });

                        _event.execute().then(resolve, reject);

                        return _event;
                    }
                }
            });
        }
    }, {
        key: 'listeners',
        get: function get() {
            return this._listeners;
        },
        set: function set(listeners) {
            this._listeners = listeners;

            return this;
        }
    }]);

    return Dispatcher;
})();

module.exports = new Dispatcher();

