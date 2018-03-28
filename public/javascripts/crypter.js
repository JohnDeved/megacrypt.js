const clipboard = new ClipboardJS('.copy')
$('#send').click(function () {
  $('#urls').val().split(String.fromCharCode('10')).forEach(el => {
    $.post('/api/encrypt', {
      url: el
    }, function (data) {
      console.log(data)
      data.forEach(el => {
        $('#crypt').append(' <p>' + el.name + ': [' + el.size + ']' + ' </p><p><a target="_blank" class="btn btn-default" href="' + el.link + '">Download Link</a> <button data-clipboard-text="' + el.link + '" class="btn btn-default copy">Copy</button> </p>')
      })
    })
  })
})
