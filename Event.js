'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Event = (function () {
    function Event(config) {
        _classCallCheck(this, Event);

        var me = this;

        me.action = config.action;
        me.executing = false;
        me.listeners = config.listeners;
        me.payload = config.payload;
        me.type = config.type;
    }

    _createClass(Event, [{
        key: 'execute',
        value: function execute() {
            var me = this;

            if (me.executing) {
                return me.promise;
            }

            me.executing = true;

            return me.promise = new Promise(function (resolve, reject) {
                var listeners = me.listeners;

                listeners.forEach(function (listener) {
                    if (!me.executing) {
                        reject();

                        return;
                    }

                    var callback = listener.callback;

                    if (callback) {
                        callback(me, listener);
                    }
                });

                resolve();

                me.executing = false;
                me.promise = null;
            });
        }
    }, {
        key: 'stop',
        value: function stop() {
            var me = this;

            if (me.executing) {
                var promise = me.promise;

                if (promise) {
                    promise.reject();
                }

                me.executing = false;
                me.promise = null;
            }
        }
    }, {
        key: 'action',
        get: function get() {
            return this._action;
        },
        set: function set(action) {
            this._action = action;

            return this;
        }
    }, {
        key: 'executing',
        get: function get() {
            return this._executing;
        },
        set: function set(executing) {
            this._executing = executing;

            return this;
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
    }, {
        key: 'payload',
        get: function get() {
            return this._payload;
        },
        set: function set(payload) {
            this._payload = payload;

            return this;
        }
    }, {
        key: 'promise',
        get: function get() {
            return this._promise;
        },
        set: function set(promise) {
            this._promise = promise;

            return this;
        }
    }, {
        key: 'type',
        get: function get() {
            return this._type;
        },
        set: function set(type) {
            this._type = type;

            return this;
        }
    }]);

    return Event;
})();

module.exports = Event;

