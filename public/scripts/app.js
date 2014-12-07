function Viewmodel(){
    var self = this;

    this.text = ko.observable(null);
    this.text.subscribe(function(text){
        $('.mermaid').removeAttr('data-processed');
        setTimeout(function(){
            mermaid.init();
            self.url(null);
        }, 1);
    });

    this.url = ko.observable();

    if (location.hash){
        var hash = location.hash.replace('#', '');

        $.ajax({
            url: '/link/' + hash,
            method: 'GET'
        }).success(function(data){
            self.text(data.text);
            setTimeout(function(){
                self.url(location.origin + '#' + data._id);
            }, 1);
        });
    }
}

Viewmodel.prototype.getUrl = function(){
    var text = this.text(),
        self = this;

    if (!text){
        return;
    }

    $.ajax({
        url: '/link',
        method: 'POST',
        data: text,
        headers:{
            'Content-Type': 'text/html'
        }
    }).success(function(data){
        self.url(location.origin + '#' + data.id);
    });
}

ko.applyBindings(new Viewmodel());

var converter = new Showdown.converter();
$('.markdown').html(converter.makeHtml($('.markdown').text()));
