'use strict';

class Event {
    constructor(config) {
        let me = this;

        me.action    = config.action;
        me.executing = false;
        me.listeners = config.listeners;
        me.payload   = config.payload;
        me.type      = config.type;
    }

    get action() {
        return this._action;
    }

    set action(action) {
        this._action = action;

        return this;
    }

    get executing() {
        return this._executing;
    }

    set executing(executing) {
        this._executing = executing;

        return this;
    }

    get listeners() {
        return this._listeners;
    }

    set listeners(listeners) {
        this._listeners = listeners;

        return this;
    }

    get payload() {
        return this._payload;
    }

    set payload(payload) {
        this._payload = payload;

        return this;
    }

    get promise() {
        return this._promise;
    }

    set promise(promise) {
        this._promise = promise;

        return this;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;

        return this;
    }

    execute() {
        let me = this;

        if (me.executing) {
            return me.promise;
        }

        me.executing = true;

        return me.promise = new Promise(function(resolve, reject) {
            let listeners = me.listeners;

            listeners.forEach(function(listener) {
                if (!me.executing) {
                    reject();

                    return;
                }

                let callback = listener.callback;

                if (callback) {
                    callback(me, listener);
                }
            });

            resolve();

            me.executing = false;
            me.promise   = null;
        });
    }

    stop() {
        let me = this;

        if (me.executing) {
            let promise = me.promise;

            if (promise) {
                promise.reject();
            }

            me.executing = false;
            me.promise   = null;
        }
    }
}

module.exports = Event;
