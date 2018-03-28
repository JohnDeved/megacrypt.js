new ClipboardJS('.btn');
$('#send').click(function() {
    $('#urls').val().split(String.fromCharCode('10')).forEach(el => {
        $.post('/api/encrypt', {
            url: el
        }, function(data) {
            console.log(data)
            data.forEach(el => {
                $('#crypt').append(' <p>' + el.name + ': [' + el.size + ']' + ' </p><p><a target="_blank" class="btn btn-default" href="' + String.fromCharCode('10') + el.link + String.fromCharCode('10') + String.fromCharCode('10') + '">Download Link</a> <button data-clipboard-text="' + String.fromCharCode('10') + el.link + String.fromCharCode('10') + String.fromCharCode('10') + '" class="btn btn-default">Copy</button> </p>')
            })
        })
    })
})