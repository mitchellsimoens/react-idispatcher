'use strict';

let Event = require('./Event.js');

class Dispatcher {
    constructor() {
        this.listeners = {};
    }

    get listeners() {
        return this._listeners;
    }

    set listeners(listeners) {
        this._listeners = listeners;

        return this;
    }

    _parseArguments(arg1, arg2, arg3) {
        switch (arguments.length) {
            case 1 :
                arg3 = arg1;
                arg1 = arg2 = '*';
                break;
            case 2 :
                arg3 = arg2;
                arg2 = '*';
                break;
        }

        return [arg1, arg2, arg3];
    }

    register(type, action, callback) {
        let listeners = this.listeners,
            obj       = listeners[type],
            arr,
            listener;

        [type, action, callback] = this._parseArguments(type, action, callback);

        if (!obj) {
            obj = listeners[type] = {};
        }

        arr = obj[action];

        if (!arr) {
            arr = obj[action] = [];
        }

        arr.push(listener = {
            action   : action,
            type     : type,
            callback : callback
        });

        return listener;
    }

    unregister(listener) {
        let listeners = this.listeners,
            type      = listener.type,
            obj       = listeners[type];

        if (obj) {
            let arr = obj[listener.action];

            let index = arr.findIndex(function(_listener) {
                return _listener === listener;
            });

            if (index !== -1) {
                arr.splice(index, 1);
            }
        }
    }

    dispatch(type, action, payload) {
        let me = this;

        [type, action, payload] = this._parseArguments(type, action, payload);

        return new Promise(function(resolve, reject) {
            let listeners = me.listeners,
                _type;

            for (_type in listeners) {
                let allListeners;

                if (_type === type || _type === '*') {
                    let obj = listeners[_type],
                        listenerArray;

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
                    let event = new Event({
                        listeners : allListeners,
                        payload,
                        type
                    });

                    event
                        .execute()
                        .then(resolve, reject);

                    return event;
                }
            }
        });
    }
}

module.exports = new Dispatcher();
