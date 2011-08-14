
var User = Y.Base.create('user', Y.Model, [Y.ModelSync.Rest], {
    root    : '/users/',
    url     : '/user/{id}/'
}, {
    ATTRS : {
        fullname : {},
        username : {},
        password : {}
    }
});

var Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.Rest], {
    model   : User,
    url     : '/users/'
});
