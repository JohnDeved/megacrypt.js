$('#send').click(function () {
  $('#urls').val().split(String.fromCharCode('10')).forEach(el => {
    $.post('/api/encrypt', { url: el }, function (data) {
      $('#crypt').val($('#crypt').val() + data.link + String.fromCharCode('10'))
    })
  })
})
