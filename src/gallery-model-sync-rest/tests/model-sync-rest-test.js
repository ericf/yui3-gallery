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
        this.TestModel      = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
        this.TestModelList  = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Rest], {
            model : this.TestModel
        });
    },

    tearDown : function () {
        delete this.TestModel;
        delete this.TestModelList;
    },

    'initializer should set local `url` property' : function () {
        var model = new this.TestModel({ url: '/model/123' });
        Assert.areSame('/model/123', model.url);

        var modelList = new this.TestModelList({ url: '/model' });
        Assert.areSame('/model', modelList.url);
    },

    'initializer should set a new IO instance on the `io` property' : function () {
        var someIO = new Y.IO();

        var model = new this.TestModel();
        Assert.isTrue(model.io instanceof Y.IO);
        Assert.areNotSame(someIO, model.io);

        var modelList = new this.TestModelList();
        Assert.isTrue(modelList.io instanceof Y.IO);
        Assert.areNotSame(someIO, modelList.io);
    },

    'initializer should not override an IO instance on the prototype' : function () {
        var io = new Y.IO();

        Assert.isTrue(io instanceof Y.IO);
        this.TestModel.prototype.io = this.TestModelList.prototype.io = io;

        var model = new this.TestModel();
        Assert.areSame(model.io, io);

        var modelList = new this.TestModelList();
        Assert.areSame(modelList.io, io);
    },

    'initializer should override `io` if it is not a IO instance' : function () {
        var fakeIO = {};

        Assert.isFalse(fakeIO instanceof Y.IO);
        this.TestModel.prototype.io = this.TestModelList.prototype.io = fakeIO;

        var model = new this.TestModel();
        Assert.areNotSame(model.io, fakeIO);
        Assert.isTrue(model.io instanceof Y.IO);

        var modelList = new this.TestModelList();
        Assert.areNotSame(modelList.io, fakeIO);
        Assert.isTrue(modelList.io instanceof Y.IO);
    }
}));

// -- ModelSync.Rest: Properties -----------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Properties',

    setUp : function () {
        this.TestModel      = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
        this.TestModelList  = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Rest], {
            model : this.TestModel
        });
    },

    tearDown : function () {
        delete this.TestModel;
        delete this.TestModelList;
    },

    '`io` property should be an IO instance by default' : function () {
        var model = new this.TestModel();
        Assert.isTrue(model.io instanceof Y.IO);

        var modelList = new this.TestModelList();
        Assert.isTrue(modelList.io instanceof Y.IO);
    },

    '`root` property should have a default value' : function () {
        var model = new this.TestModel();
        Assert.areSame('', model.root);

        var modelList = new this.TestModelList();
        Assert.areSame('', modelList.root);
    },

    '`url` should be a function by default' : function () {
        var model = new this.TestModel();
        Assert.isTrue(Y.Lang.isFunction(model.url));

        var modelList = new this.TestModelList();
        Assert.isTrue(Y.Lang.isFunction(modelList.url));
    }
}));

// -- ModelSync.Rest: Methods --------------------------------------------------
suite.add(new Y.Test.Case({
    name : 'Methods',

    setUp : function () {
        this.TestModel      = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
        this.TestModelList  = Y.Base.create('testModelList', Y.ModelList, [Y.ModelSync.Rest], {
            model : this.TestModel
        });
    },

    tearDown : function () {
        delete this.TestModel;
        delete this.TestModelList;
    },

    '_getURL() should return a String' : function () {
        var model = new this.TestModel();
        Assert.isString(model._getURL());

        var modelList = new this.TestModelList();
        Assert.isString(modelList._getURL());
    },

    '_getURL() should return locally set `url` property' : function () {
        var model = new this.TestModel({ url: '/model/123' });
        Assert.areSame('/model/123', model._getURL());

        model.url = '/model/abc';
        Assert.areSame('/model/abc', model._getURL());

        var modelList = new this.TestModelList({ url: '/model' });
        Assert.areSame('/model', modelList._getURL());

        modelList.url = '/models';
        Assert.areSame('/models', modelList._getURL());
    },

    '_getURL() should substitute placeholder values of Models’ `url`' : function () {
        var model = new this.TestModel({
            id : 123,
            url: '/model/{id}/'
        });

        Assert.areSame('/model/123/', model._getURL());

        model.addAttr('foo', { value: 'bar' });
        model.url = '/{foo}/{id}';
        Assert.areSame('/bar/123', model._getURL());
    },

    '_getURL() should not substitute placeholder values of ModelLists’ `url`' : function () {
        var modelList = new this.TestModelList({ url: '/{foo}/' });

        modelList.addAttr('foo', { value: 'bar' });
        Assert.areSame('bar', modelList.get('foo'));
        Assert.areSame('/{foo}/', modelList._getURL());
    },

    '_getURL() should URL-encode the substitutions of placeholder values of Models’ `url`' : function () {
        var model = new this.TestModel({
            id : '123 456',
            url: '/model/{id}'
        });

        Assert.areSame('/model/123%20456', model._getURL());
    },

    '_getURL() should not substitute Arrays, Objects, or Boolean values of Models’ `url`' : function () {
        var model = new this.TestModel({
            id : 'asdf',
            url: '/model/{foo}/{bar}/{baz}/{id}'
        });

        model.addAttrs({
            foo : { value: [1, 2, 3] },
            bar : { value: { zee: 'zee' } },
            baz : { value: true }
        });

        Assert.areSame('/model/{foo}/{bar}/{baz}/asdf', model._getURL());
    },

    '_getURL() should return `root` if `url` is falsy' : function () {
        var model = new this.TestModel();

        model.root  = '/model/';
        model.url   = '';

        Assert.areSame('/model/', model._getURL());
    },

    'url() should return `root` if ModelList or Model is new' : function () {
        var model = new this.TestModel();
        model.root = '/model';
        Assert.areSame(model.root, model.url());

        var modelList = new this.TestModelList();
        modelList.root = '/model';
        Assert.areSame(modelList.root, modelList.url());
    },

    'url() should return a URL that ends with a / only if Model’s `root` ends with a /' : function () {
        var model = new this.TestModel({ id: 123 });

        model.root = '/model';
        Assert.areSame('/model/123', model.url());

        model.root = '/model/';
        Assert.areSame('/model/123/', model.url());
    }
}));

// -- ModelSync.Rest: IO Events ------------------------------------------------
suite.add(new Y.Test.Case({
    name : 'IO Events',

    setUp : function () {
        this.TestModel = Y.Base.create('testModel', Y.Model, [Y.ModelSync.Rest]);
    },

    tearDown : function () {
        delete this.TestModel;
    },

    'Model instance with own IO instance should receive bubbled IO events' : function () {
        var calls   = 0,
            data    = null,
            model   = new this.TestModel({
                on : {
                    'io:foo' : function (e) {
                        calls += 1;
                        data = e.data;
                    }
                }
            });

        model.io.fire('io:foo', { 'data': 'bar' });

        Assert.areSame(1, calls);
        Assert.areSame('bar', data);
    },

    'Model instance with IO instance on the prototype should not receive bubbled IO events' : function () {
        var calls   = 0,
            data    = null,
            io      = new Y.IO({ bubbles: true }),
            model;

        this.TestModel.prototype.io = io;

        model = new this.TestModel({
            on : {
                'io:foo' : function (e) {
                    calls += 1;
                    data = e.data;
                }
            }
        });

        io.fire('io:foo', { 'data': 'bar' });

        Assert.areSame(0, calls);
        Assert.areSame(null, data);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['gallery-model-sync-rest', 'model', 'model-list', 'test']
});
