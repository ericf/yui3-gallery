var fs      = require('fs'),
    combo   = require('combohandler'),
    express = require('express'),

    app     = express.createServer(),
    data    = {},

    yui3Path        = __dirname + '/../../../../../yui3',
    yui3GalleryPath = __dirname + '/../../../../';

app.configure(function(){
    // Static files.
    app.use(express.static(__dirname));
    // Handles parsing HTTP request entitiy bodies from the client.
    app.use(express.bodyParser());
});

// YUI 3 combo handler.
app.get('/yui3', combo.combine({ rootPath: yui3Path }), function (req, res) {
    res.send(res.body, 200);
});

// YUI 3 Gallery combo handler.
app.get('/yui3-gallery', combo.combine({ rootPath: yui3GalleryPath }), function (req, res) {
    res.send(res.body, 200);
});

// Lookup the data collection and set it on the request object and continue.
app.all('/data/:collection/:id?', function (req, res, next) {
    var collection = req.params.collection;
    req.collection = data[collection] || (data[collection] = []);
    next();
});

app.get('/data/:collection', function (req, res) {
    res.json(req.collection);
});

app.post('/data/:collection', function (req, res) {
    var collection  = req.collection,
        item        = req.body;

    item.id = collection.length;
    collection.push(item);
    res.json(item);
});

// Lookup specific item on a collection and set it on the request then continue,
// or error out with a 404.
app.all('/data/:collection/:id', function (req, res, next) {
    var id          = req.params.id,
        collection  = req.params.collection,
        item        = req.collection[id];

    if (item) {
        req.item = item;
        next();
    } else {
        res.send('Cannot find item: ' + id + ' in: ' + collection, 404);
    }
});

app.get('/data/:collection/:id', function (req, res) {
    res.json(req.item);
});

app.put('/data/:collection/:id', function (req, res) {
    req.collection[req.item.id] = req.body;
    res.send();
});

app.del('/data/:collection/:id', function (req, res) {
    req.collection.splice(req.item.id, 1);
    res.send();
});

// Toss a 404 for everything else.
app.get('*', function (req, res) {
    res.send('REST Model Sync Test Server', 404);
});

// Go Go Gadget Server.
app.listen(3000);

// Say what's up with the env.
console.log('YUI 3 at: ' + fs.realpathSync(yui3Path));
console.log('YUI 3 Gallery at: ' + fs.realpathSync(yui3GalleryPath));
console.log('REST Model Sync Test Server running at: http://localhost:3000/');
