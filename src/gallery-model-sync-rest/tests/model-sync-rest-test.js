YUI.add('model-sync-rest-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    modelSyncRestSuite;

// -- ModelSync.Rest Suite -----------------------------------------------------
suite = new Y.Test.Suite('ModelSync.Rest');

// -- ModelSync.Rest: Lifecycle ------------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Lifecycle',

    setUp : function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
    },

    tearDown : function () {
        delete this.TestModel;
    },

    'initializer should set local `url` property' : function () {
        var model = new this.TestModel({ url: '/model/123' });
        Assert.areSame('/model/123', model.url);
    }
}));

// -- ModelSync.Rest: Properties -----------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Properties',

    setUp : function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
    },

    tearDown : function () {
        delete this.TestModel;
    },

    '`headers` should be an Object that contains default values for `Accept` and `Content-Type`' : function () {
        var model = new this.TestModel();

        Assert.isObject(model.headers);
        Assert.areSame('application/json', model.headers['Accept']);
        Assert.areSame('application/json', model.headers['Content-Type']);
    },

    '`root` property should have a default value' : function () {
        var model = new this.TestModel();
        Assert.areSame('', model.root);
    },

    '`url` should be a function by default' : function () {
        var model = new this.TestModel();
        Assert.isTrue(Y.Lang.isFunction(model.url));
    }
}));

// -- ModelSync.Rest: Methods --------------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Methods',

    setUp : function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
    },

    tearDown : function () {
        delete this.TestModel;
    },

    '_getUrl() should return a String' : function () {
        var model = new this.TestModel();
        Assert.isString(model._getUrl());
    },

    '_getUrl() should return locally set `url` property' : function () {
        var model = new this.TestModel({ url: '/model/123' });
        Assert.areSame('/model/123', model._getUrl());
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['gallery-model-sync-test', 'model', 'model-list', 'test']
});
