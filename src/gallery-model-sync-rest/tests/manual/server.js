var fs      = require('fs'),
    combo   = require('combohandler'),
    express = require('express'),

    app     = express.createServer(),
    todos   = [],

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

app.get('/todo', function (req, res) {
    res.json(todos);
});

app.post('/todo', function (req, res) {
    var todo = req.body;
    todo.id = todos.length;
    todos.push(todo);
    res.json(todo);
});

// Get the todo, set it on the request object, and continue or error out.
app.all('/todo/:id', function (req, res, next) {
    var id   = req.params.id,
        todo = todos[id];

    if (todo) {
        req.todo = todo;
        next();
    } else {
        res.send('Cannot find todo: ' + id, 404);
    }
});

app.get('/todo/:id', function (req, res) {
    res.json(req.todo);
});

app.put('/todo/:id', function (req, res) {
    todos[req.todo.id] = req.body;
    res.send();
});

app.del('/todo/:id', function (req, res) {
    todos.splice(req.todo.id, 1);
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
