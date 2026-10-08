
        $(document).ready(function(){
          var elems0 = document.querySelectorAll('.slider.Col');
          var instances0 = M.Slider.init(elems0, {
              indicators: false,
              duration: 500,
              interval: 2000,
          });
          $('.slider.Con').slider('pause');
        })
        $('#hila').click(function() {
          $('.slider.Con').slider('pause');
          var elems0 = document.querySelectorAll('.slider.Col');
          var instances0 = M.Slider.init(elems0, {
              indicators: false,
              duration: 500,
              interval: 2000,
          });
        });
        $('#calce').click(function() {
          $('.slider.Con').slider('pause');
          var elems1 = document.querySelectorAll('.slider.Cal');
          var instances1 = M.Slider.init(elems1, {
              indicators: false,
              duration: 500,
              interval: 2000,
          });
        });
        $('#tej').click(function() {
          $('.slider.Con').slider('');
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
          $('.slider.Con').slider('pause');
          var elems4 = document.querySelectorAll('.slider.Te');
          var instances4 = M.Slider.init(elems4, {
              indicators: false,
              duration: 500,
              interval: 2000,
          });
        });
        $('i#prevCon').click(function() {
            $('.slider.Con').slider('prev');
        });
        $('i#nextCon').click(function() {
            $('.slider.Con').slider('next');
        });
      