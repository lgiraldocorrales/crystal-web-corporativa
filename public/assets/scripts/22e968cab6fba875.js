
  $(document).ready(function(){
    var elems0 = document.querySelectorAll('.slider.Col');
    var instances0 = M.Slider.init(elems0, {
        indicators: false,
        duration: 500,
        interval: 2000,
    });
    $('.slider.Cal').slider('pause');
    $('.slider.Pla').slider('pause');
    $('.slider.Con').slider('pause');
    $('.slider.Te').slider('pause');

  })
  $('#hila').click(function() {
    $('.slider.Cal').slider('pause');
    $('.slider.Pla').slider('pause');
    $('.slider.Con').slider('pause');
    $('.slider.Te').slider('pause');
    $('.slider.Col').slider('');
    var elems0 = document.querySelectorAll('.slider.Col');
    var instances0 = M.Slider.init(elems0, {
        indicators: false,
        duration: 500,
        interval: 2000,
    });

  });
  $('#calce').click(function() {
    $('.slider.Col').slider('pause');
    $('.slider.Pla').slider('pause');
    $('.slider.Con').slider('pause');
    $('.slider.Te').slider('pause');
    $('.slider.Cal').slider('');
    var elems1 = document.querySelectorAll('.slider.Cal');
    var instances1 = M.Slider.init(elems1, {
        indicators: false,
        duration: 500,
        interval: 2000,
    });
  });
  $('#tej').click(function() {
    $('.slider.Cal').slider('pause');
    $('.slider.Pla').slider('');
    $('.slider.Con').slider('');
    $('.slider.Te').slider('pause');
    $('.slider.Col').slider('pause');
    var elems2 = document.querySelectorAll('.slider.Con');
    var instances2 = M.Slider.init(elems2, {
        indicators: false,
        duration: 500,
        interval: 2300,
    });
    var elems3 = document.querySelectorAll('.slider.Pla');
    var instances3 = M.Slider.init(elems3, {
        indicators: false,
        duration: 500,
        interval: 2000,
    });
  });
  $('#seam').click(function() {
    $('.slider.Cal').slider('pause');
    $('.slider.Pla').slider('pause');
    $('.slider.Con').slider('pause');
    $('.slider.Te').slider('');
    $('.slider.Col').slider('pause');
    var elems4 = document.querySelectorAll('.slider.Te');
    var instances4 = M.Slider.init(elems4, {
        indicators: false,
        duration: 500,
        interval: 2000,
    });
  });
  $('i#prevPla').click(function() {
      $('.slider.Pla').slider('prev');
  });
  $('i#nextPla').click(function() {
      $('.slider.Pla').slider('next');
  });

  $('i#prevCol').click(function() {
      $('.slider.Col').slider('prev');
  });
  $('i#nextCol').click(function() {
      $('.slider.Col').slider('next');
  });
  $('i#prevCal').click(function() {
      $('.slider.Cal').slider('prev');
  });
  $('i#nextCal').click(function() {
      $('.slider.Cal').slider('next');
  });
  $('i#prevTe').click(function() {
      $('.slider.Te').slider('prev');
  });
  $('i#nextTe').click(function() {
      $('.slider.Te').slider('next');
  });
  $('i#prevCon').click(function() {
      $('.slider.Con').slider('prev');
  });
  $('i#nextCon').click(function() {
      $('.slider.Con').slider('next');
  });
