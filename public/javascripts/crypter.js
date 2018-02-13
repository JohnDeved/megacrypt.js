$('#send').click(function () {
  $('#urls').val().split(String.fromCharCode('10')).forEach(el => {
    $.post('/api/encrypt', { url: el }, function (data) {
      console.log(data)
      data.forEach(el => {
        $('#crypt').val($('#crypt').val() + el.name + ' [' + el.size + ']' + String.fromCharCode('10') + el.link + String.fromCharCode('10') + String.fromCharCode('10'))
      })
    })
  })
})
