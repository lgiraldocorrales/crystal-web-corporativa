   
        $('i#prev').click(function() {
            M.Slider.getInstance(document.querySelector('.slider'))?.prev();
        });

        $('i#next').click(function() {
            M.Slider.getInstance(document.querySelector('.slider'))?.next();
        });
    