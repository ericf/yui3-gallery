
var User = Y.Base.create('user', Y.Model, [Y.ModelSync], {
    root    : '/user/',
    url     : '{id}/'
}, {
    ATTRS : {
        fullname : {},
        username : {},
        password : {}
    }
});
