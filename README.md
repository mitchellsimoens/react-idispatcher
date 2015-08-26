# React Improved Dispatcher

An improved event dispatcher allow listeners to listen to specific events and actions
or to global events. You can register three ways:

    //all global events
    dispatcher.register(function(e) {
        //e.payload
    });

    //all foo events
    dispatcher.register('foo', function(e) {
        //e.payload
    });

    //any foo event with create action
    dispatcher.register('foo', 'create', function(e) {
        //e.payload
    });

To dispatch an event, you can dispatch via:

    dispatcher.dispatch('foo', 'create', {
        bar : 'baz'
    });
