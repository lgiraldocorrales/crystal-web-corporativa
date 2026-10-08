
        document.addEventListener("DOMContentLoaded", function(){
            var item='Water'
            $("div").removeClass("flashit");
            $("#" + item).addClass("flashit");
            $('html,body').animate({
                scrollTop: $("#" + item).offset().top-130
            }, 'slow');
        });   
    