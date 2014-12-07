var express = require('express');
var app = express();
var config = require('./config') || {};
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

require('./models/url');

var Url = mongoose.model('Url');

app.use(bodyParser.text({ type: 'text/html' }));

app.get('/', function (req, res) {
    res.sendFile('index.html',{
        root: __dirname + '/public/'
    });
});

app.post('/link', function(req, res){
    var text = req.body,
        id = s4() + s4() + s4();

    if (!text){
        return res.status(500).send();
    }

    var url = new Url({
        _id: id,
        text: text,
        timestamp: new Date(),
        views: 0
    });

    url.save(function(err, model){
        if (err){
            return res.status(500).send(err);
        }

        res.status(200).send({id: model._id});
    });
});

app.get('/link/:id', function(req, res){
    var id = req.params.id;

    if (!id){
        return res.status(500).send();
    }

    Url.findOne({_id: id}, function(err, url){
        if (err || !url){
            return res.status(500).send(err);
        }

        res.status(200).send(url);

        url.timestamp = new Date();
        url.views += 1;
        url.save();
    });
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(config.port || process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

    mongoose.connect(config.connectionString || process.env.MONGO, function(){
        console.log('Connected to database');
    });
});

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
