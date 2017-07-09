const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var id = 0;
var goods = [];

app.get('/', function(req, res) {
    var tovar = req.query.id ? goods.find(x => x.id == req.query.id) : { id:0, tovar: "", ks: ""}

    res.render('index.jade', { goods: goods, tovar: tovar} );
});

app.get('/delete', function(req, res) {
    var index = goods.findIndex(x => x.id == req.query.id);
    goods.splice(index, 1);

    res.redirect(307, "/");
});

app.post('/', function(req, res) {
    var reqTovar = { 
        id: +req.body.id,
        tovar: req.body.tovar,
        ks: req.body.ks 
    };

    if(!reqTovar.tovar.trim()) {
        reqTovar.error = "Tovar nemoze byt prazdny";
        res.render('index.jade', { goods: goods, tovar: reqTovar} );
        return;
    }

    if(reqTovar.id) {
        tovar = goods.find(x => x.id == req.query.id);
        tovar.tovar = reqTovar.tovar;
        tovar.ks = reqTovar.ks;
    } else {
        reqTovar.id = ++id;
        goods.push(reqTovar);
    }

    // res.render('index.jade', { goods: goods, tovar: { id:0, tovar: "", ks: ""}} );
    res.redirect(303, "/");
});

app.get('/tovar', function(req, res) {
    res.json(goods);
});

app.post('/tovar', function(req, res) {
    var t = {
        id: ++id,
        tovar: req.body.tovar,
        ks: req.body.ks
    }
    
    goods.push(t);

    res.statusCode = 201;
    res.json(t);
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
})